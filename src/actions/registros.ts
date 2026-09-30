'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { getSiteConfig } from '@/lib/config';
import { execute, queryOne } from '@/lib/db';
import type { FormState } from '@/lib/form-state';
import { sendMail } from '@/lib/mail';
import { guardPublicForm } from '@/lib/public-form';
import { siteUrl } from '@/lib/site';
import { fieldErrorsOf, id as idSchema, optionalText, valuesOf } from '@/lib/validators/common';
import {
  COMO_LLEGO,
  REGISTRO_FIELDS,
  SITUACIONES,
  registroAdminSchema,
  soyNuevoSchema,
} from '@/lib/validators/registros';
import { formatPhoneEc } from '@/lib/whatsapp';

const SOY_NUEVO_OK = '¡Gracias por escribirnos! Pronto alguien de la iglesia te contactará.';
const label = (list: readonly { value: string; label: string }[], value: string | null) =>
  list.find((i) => i.value === value)?.label ?? '—';

/** «Soy nuevo» (público): Zod → honeypot → límite por IP → insert → aviso por correo. */
export async function registerNewcomer(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = valuesOf(formData, REGISTRO_FIELDS);
  const parsed = soyNuevoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos marcados.',
      fieldErrors: fieldErrorsOf(parsed.error),
      values,
    };
  }
  const guard = await guardPublicForm(formData, 'soy_nuevo', SOY_NUEVO_OK);
  if (!guard.ok)
    return { ...guard.state, values: guard.state.status === 'error' ? values : undefined };

  const d = parsed.data;
  await execute(
    `INSERT INTO registros (nombres, apellidos, telefono, email, rango_edad_id, sector, origen, como_llego, situacion, peticion,
                            acepta_datos, acepta_datos_en, acepta_datos_ip, estado)
     VALUES (?, ?, ?, ?, ?, ?, 'web', ?, ?, ?, 1, NOW(), INET6_ATON(?), 'nuevo')`,
    [
      d.nombres,
      d.apellidos,
      d.telefono,
      d.email,
      d.rango_edad_id,
      d.sector,
      d.como_llego,
      d.situacion,
      d.peticion,
      guard.ip,
    ],
  );
  const config = await getSiteConfig();
  await sendMail({
    to: config.email_avisos,
    replyTo: d.email,
    subject: `Nuevo registro: ${d.nombres}${d.apellidos ? ` ${d.apellidos}` : ''}`,
    text: [
      'Alguien se registró en «Soy nuevo»:',
      '',
      `Nombre: ${d.nombres} ${d.apellidos ?? ''}`.trim(),
      `WhatsApp: ${formatPhoneEc(d.telefono)}`,
      d.email ? `Correo: ${d.email}` : null,
      d.sector ? `Sector: ${d.sector}` : null,
      `Situación: ${label(SITUACIONES, d.situacion)}`,
      `Cómo llegó: ${label(COMO_LLEGO, d.como_llego)}`,
      d.peticion ? `Petición: ${d.peticion}` : null,
      '',
      `Ver y marcar el seguimiento: ${siteUrl()}/admin/registros`,
    ]
      .filter((line) => line !== null)
      .join('\n'),
  });
  revalidatePath('/admin/registros');
  revalidatePath('/admin');
  return { status: 'success', message: SOY_NUEVO_OK };
}

export async function createRegistro(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = valuesOf(formData, [...REGISTRO_FIELDS, 'origen']);
  const parsed = registroAdminSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos marcados en rojo.',
      fieldErrors: fieldErrorsOf(parsed.error),
      values,
    };
  }
  const d = parsed.data;
  if (d.telefono) {
    const existing = await queryOne<{ nombres: string }>(
      'SELECT nombres FROM registros WHERE telefono = ? LIMIT 1',
      [d.telefono],
    );
    if (existing && formData.get('confirmar_duplicado') !== '1') {
      return {
        status: 'error',
        message: `Ya hay un registro con ese teléfono (${existing.nombres}). Si es otra persona, marca «Registrar de todos modos».`,
        fieldErrors: { telefono: ['Este teléfono ya está registrado.'] },
        values: { ...values, duplicado: '1' },
      };
    }
  }
  await execute(
    `INSERT INTO registros (nombres, apellidos, telefono, email, rango_edad_id, sector, origen, como_llego, situacion, peticion, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'nuevo')`,
    [
      d.nombres,
      d.apellidos,
      d.telefono,
      d.email,
      d.rango_edad_id,
      d.sector,
      d.origen,
      d.como_llego,
      d.situacion,
      d.peticion,
    ],
  );
  revalidatePath('/admin/registros');
  redirect('/admin/registros?aviso=creado');
}

const estadoSchema = z.object({
  id: idSchema,
  estado: z.enum(['nuevo', 'contactado', 'integrado', 'sin_respuesta'], {
    error: 'Elige un estado.',
  }),
  notas: optionalText(2000),
});

export async function updateRegistroEstado(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = estadoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { status: 'error', message: 'Revisa el estado elegido e intenta de nuevo.' };
  const { affectedRows } = await execute(
    'UPDATE registros SET estado = ?, notas_admin = ? WHERE id = ?',
    [parsed.data.estado, parsed.data.notas, parsed.data.id],
  );
  if (affectedRows === 0)
    return { status: 'error', message: 'Este registro ya no existe. Recarga la página.' };
  revalidatePath('/admin/registros');
  revalidatePath('/admin');
  return { status: 'success', message: 'Registro actualizado' };
}

export async function deleteRegistro(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin({ role: 'admin' });
  const parsed = idSchema.safeParse(formData.get('id'));
  if (!parsed.success)
    return { status: 'error', message: 'No encontramos este registro. Recarga la página.' };
  const { affectedRows } = await execute('DELETE FROM registros WHERE id = ?', [parsed.data]);
  if (affectedRows === 0)
    return { status: 'error', message: 'Este registro ya fue eliminado. Recarga la página.' };
  revalidatePath('/admin/registros');
  return { status: 'success', message: 'Registro eliminado (datos personales borrados).' };
}
