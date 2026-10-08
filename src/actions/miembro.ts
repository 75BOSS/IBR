'use server';

import { redirect } from 'next/navigation';
import { after } from 'next/server';
import { z } from 'zod';
import { execute, query } from '@/lib/db';
import type { FormState } from '@/lib/form-state';
import {
  getMemberSession,
  hashAccessCode,
  isKnownPhone,
  newAccessCode,
  sameHash,
} from '@/lib/miembro';
import { guardPublicForm } from '@/lib/public-form';
import { consumeRateLimit, minutesText, reserveAttempt } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/request';
import { fieldErrorsOf, requiredPhone } from '@/lib/validators/common';
import { isWhatsAppConfigured, sendWhatsAppTemplate } from '@/lib/whatsapp-cloud';

const CODE_TTL_MINUTES = 10;
/** Intentos por código (además del límite diario por número). */
const MAX_TRIES = 5;

const SENT =
  'Si tu número está registrado en la iglesia, te llegó un código por WhatsApp. Escríbelo abajo.';

const DAY = 24 * 60;

/**
 * Paso 1: pedir el código. Para no revelar quién es de la iglesia, todo número recibe el mismo
 * trato: se guarda un código (a los desconocidos, uno señuelo que nunca se envía), la respuesta
 * es la misma y el WhatsApp sale después de responder (after), así no cambia la demora.
 * Solo se envía a números que la iglesia ya tiene. Límites: por IP, 3 cada 10 min y 5 por día
 * por número, y un tope diario global de mensajes pagados.
 */
export async function solicitarCodigo(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = String(formData.get('telefono') ?? '');
  const parsed = z.object({ telefono: requiredPhone }).safeParse({ telefono: raw });
  if (!parsed.success) {
    return {
      status: 'error',
      fieldErrors: fieldErrorsOf(parsed.error),
      values: { telefono: raw },
    };
  }
  if (!isWhatsAppConfigured('WHATSAPP_TEMPLATE_CODIGO')) {
    return {
      status: 'error',
      message:
        'Todavía no podemos enviar códigos por WhatsApp. Mientras tanto, escríbenos desde la página de Contacto y te ayudamos.',
      values: { telefono: raw },
    };
  }
  const guard = await guardPublicForm(formData, 'codigo_ip', SENT);
  if (!guard.ok) return { ...guard.state, values: { telefono: raw } };
  const { telefono } = parsed.data;
  for (const [form, options] of [
    ['codigo_telefono', { max: 3 }],
    ['codigo_telefono_dia', { max: 5, windowMinutes: DAY }],
  ] as const) {
    const limit = await consumeRateLimit(form, { account: telefono }, options);
    if (limit.blocked) {
      return {
        status: 'error',
        message: `Ya enviamos varios códigos a ese número. Espera ${minutesText(limit.retryAfterMinutes)} y vuelve a intentar.`,
        values: { telefono: raw },
      };
    }
  }

  const known = await isKnownPhone(telefono);
  const code = newAccessCode();
  // A un número desconocido se le guarda el hash de otro código (señuelo): el paso 2 responde
  // igual para todos y nadie puede averiguar quién está registrado.
  const stored = known ? code : newAccessCode() + ':señuelo';
  await execute(
    `INSERT INTO codigos_acceso (telefono, codigo_hash, expira_en, ip)
     VALUES (?, ?, NOW() + INTERVAL ? MINUTE, INET6_ATON(?))`,
    [telefono, hashAccessCode(telefono, stored), CODE_TTL_MINUTES, guard.ip],
  );
  if (known) {
    const global = await consumeRateLimit(
      'codigo_global',
      { account: 'todos' },
      { max: 300, windowMinutes: DAY },
    );
    if (global.blocked) {
      console.warn('[mi-cuenta] se alcanzó el tope diario de códigos por WhatsApp; no se envió.');
    } else {
      // Sale después de responder; si falla, sendWhatsAppTemplate lo registra.
      after(() =>
        sendWhatsAppTemplate({
          to: telefono,
          template: 'WHATSAPP_TEMPLATE_CODIGO',
          params: [code],
          buttonCode: code,
        }),
      );
    }
  }
  return { status: 'success', message: SENT, values: { telefono } };
}

/**
 * Paso 2: comprobar el código y abrir la sesión. Cada intento se reserva antes de comparar con
 * un límite exacto por número (10 por día, con candado): pedidos en paralelo no suman intentos.
 * Sirve cualquier código vigente del número, así pedir otro no le quita el suyo al dueño.
 */
export async function verificarCodigo(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = z
    .object({
      telefono: requiredPhone,
      codigo: z
        .string()
        .trim()
        .regex(/^\d{6}$/, { error: 'El código tiene 6 números, ej. 482913.' }),
    })
    .safeParse({ telefono: formData.get('telefono'), codigo: formData.get('codigo') });
  if (!parsed.success) return { status: 'error', fieldErrors: fieldErrorsOf(parsed.error) };
  const { telefono, codigo } = parsed.data;
  const tooMany = (minutes: number): FormState => ({
    status: 'error',
    message: `Demasiados intentos. Espera ${minutesText(minutes)} y pide un código nuevo.`,
  });
  const byIp = await consumeRateLimit('codigo_verificar', { ip: await getClientIp() }, { max: 15 });
  if (byIp.blocked) return tooMany(byIp.retryAfterMinutes);
  const attempt = await reserveAttempt(
    'codigo_fallido',
    { account: telefono },
    { max: 10, windowMinutes: DAY },
  );
  if (attempt.blocked) return tooMany(attempt.retryAfterMinutes);
  const rows = await query<{ id: number; codigo_hash: string }>(
    `SELECT id, codigo_hash FROM codigos_acceso
      WHERE telefono = ? AND usado = 0 AND expira_en > NOW() AND intentos < ?`,
    [telefono, MAX_TRIES],
  );
  if (rows.length === 0) {
    return { status: 'error', message: 'El código venció o ya no sirve. Pide uno nuevo.' };
  }
  const expected = hashAccessCode(telefono, codigo);
  const match = rows.find((r) => sameHash(r.codigo_hash, expected));
  if (!match) {
    await execute(
      `UPDATE codigos_acceso SET intentos = intentos + 1
        WHERE telefono = ? AND usado = 0 AND expira_en > NOW()`,
      [telefono],
    );
    return {
      status: 'error',
      fieldErrors: {
        codigo: [
          'Ese código no coincide. Revisa el último mensaje de WhatsApp y vuelve a escribirlo.',
        ],
      },
    };
  }
  const { affectedRows } = await execute(
    'UPDATE codigos_acceso SET usado = 1 WHERE id = ? AND usado = 0 AND intentos < ?',
    [match.id, MAX_TRIES],
  );
  if (affectedRows !== 1)
    return { status: 'error', message: 'Ese código ya se usó. Pide uno nuevo.' };
  // Entró: el intento no cuenta contra su límite diario.
  await attempt.release();
  const session = await getMemberSession();
  session.telefono = telefono;
  await session.save();
  redirect('/mi-cuenta');
}

export async function salirMiembro(): Promise<void> {
  const session = await getMemberSession();
  session.destroy();
  redirect('/mi-cuenta');
}
