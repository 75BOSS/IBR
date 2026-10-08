'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { imageProblem, isCloudinaryConfigured, uploadImage } from '@/lib/cloudinary';
import { CONFIG_TAG } from '@/lib/config';
import {
  CONFIG_SECTIONS,
  type BankAccount,
  type ConfigField,
  MAX_BANK_ACCOUNTS,
} from '@/lib/config-fields';
import { execute } from '@/lib/db';
import type { FormState } from '@/lib/form-state';
import { expandMapsLink, isGoogleMapsLink, safeMapsEmbedUrl } from '@/lib/maps';
import {
  checkbox,
  optionalEmail,
  optionalPhone,
  optionalText,
  optionalUrl,
  optionalWhatsapp,
  requiredText,
} from '@/lib/validators/common';

type Parsed = { value: string | null } | { error: string } | { keep: true };

const text = (formData: FormData, name: string) => String(formData.get(name) ?? '').trim();

async function parseField(field: ConfigField, formData: FormData): Promise<Parsed> {
  const raw = formData.get(field.key);
  const fromSchema = (
    result:
      | { success: true; data: unknown }
      | { success: false; error: { issues: { message: string }[] } },
  ): Parsed =>
    result.success
      ? { value: result.data === null ? null : String(result.data) }
      : { error: result.error.issues[0]?.message ?? 'Revisa este campo.' };

  switch (field.kind) {
    case 'text':
    case 'textarea':
      return fromSchema(
        field.required
          ? requiredText(field.label.toLowerCase(), field.max ?? 255).safeParse(raw)
          : optionalText(field.max ?? 1000).safeParse(raw),
      );
    case 'url':
      return fromSchema(optionalUrl.safeParse(raw));
    case 'phone':
      return fromSchema(optionalPhone.safeParse(raw));
    case 'whatsapp':
      return fromSchema(optionalWhatsapp.safeParse(raw));
    case 'email':
      return fromSchema(optionalEmail.safeParse(raw));
    case 'bool':
      return { value: checkbox.parse(raw) ? '1' : '0' };
    case 'maps': {
      const value = text(formData, field.key);
      if (!value) return { value: null };
      const src = safeMapsEmbedUrl(value);
      return src
        ? { value: src }
        : {
            error:
              'No reconocemos ese mapa. En Google Maps: Compartir → Insertar un mapa → Copiar HTML.',
          };
    }
    case 'mapsLink': {
      const value = text(formData, field.key);
      if (!value) return { value: null };
      if (!isGoogleMapsLink(value)) {
        return {
          error:
            'Pega el enlace de Google Maps: busca la iglesia, toca Compartir → Copiar enlace (ej. https://maps.app.goo.gl/…).',
        };
      }
      // El enlace corto no trae coordenadas: se guarda el del lugar para poder dibujar el mapa.
      return { value: await expandMapsLink(value) };
    }
    case 'youtubeChannel': {
      const value = text(formData, field.key);
      if (!value) return { value: null };
      return /^UC[\w-]{22}$/.test(value)
        ? { value }
        : {
            error:
              'El ID del canal empieza con UC y tiene 24 caracteres, ej. UCxxxxxxxxxxxxxxxxxxxxxx.',
          };
    }
    case 'image': {
      const file = formData.get(field.key);
      if (file instanceof File && file.size > 0) {
        const problem = imageProblem(file);
        if (problem) return { error: problem };
        if (!isCloudinaryConfigured())
          return {
            error: 'La subida de fotos aún no está activada (falta configurar Cloudinary).',
          };
        const { url } = await uploadImage(file, 'config');
        return { value: url };
      }
      return formData.get(`${field.key}__quitar`) === '1' ? { value: null } : { keep: true };
    }
    case 'accounts': {
      const accounts: BankAccount[] = [];
      for (let i = 0; i < MAX_BANK_ACCOUNTS; i++) {
        const account: BankAccount = {
          banco: text(formData, `cuenta_${i}_banco`),
          tipo: text(formData, `cuenta_${i}_tipo`),
          numero: text(formData, `cuenta_${i}_numero`),
          titular: text(formData, `cuenta_${i}_titular`),
          ruc_ci: text(formData, `cuenta_${i}_ruc_ci`),
        };
        if (Object.values(account).every((v) => v === '')) continue;
        if (!account.banco || !account.numero) {
          return {
            error: `A la cuenta ${i + 1} le falta el banco o el número. Complétalos o deja la cuenta vacía.`,
          };
        }
        if (Object.values(account).some((v) => v.length > 120)) {
          return {
            error: `Algún dato de la cuenta ${i + 1} es demasiado largo (máximo 120 caracteres).`,
          };
        }
        accounts.push(account);
      }
      return { value: JSON.stringify(accounts) };
    }
  }
}

export async function saveConfig(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin({ role: 'admin' });
  const section = CONFIG_SECTIONS.find((s) => s.group === formData.get('grupo'));
  if (!section)
    return {
      status: 'error',
      message: 'No reconocemos esta sección. Recarga la página e intenta de nuevo.',
    };

  const updates: [string, string | null][] = [];
  const fieldErrors: Record<string, string[]> = {};
  // Todo lo escrito (incluidas las cuentas) vuelve al formulario si hay errores.
  const values: Record<string, string> = {};
  for (const [name, raw] of formData.entries()) if (typeof raw === 'string') values[name] = raw;
  for (const field of section.fields) {
    let parsed: Parsed;
    try {
      parsed = await parseField(field, formData);
    } catch (error) {
      console.error(`[config] no se pudo procesar ${field.key}:`, error);
      parsed = { error: 'No se pudo subir la foto. Intenta de nuevo en un momento.' };
    }
    if ('error' in parsed) fieldErrors[field.key] = [parsed.error];
    else if ('value' in parsed) updates.push([field.key, parsed.value]);
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Revisa los campos marcados en rojo.', fieldErrors, values };
  }

  for (const [key, value] of updates) {
    await execute(
      'INSERT INTO config (clave, valor, grupo) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE valor = VALUES(valor)',
      [key, value, section.group],
    );
  }
  revalidateTag(CONFIG_TAG);
  revalidatePath('/', 'layout');
  return { status: 'success', message: `Guardado: ${section.title}` };
}
