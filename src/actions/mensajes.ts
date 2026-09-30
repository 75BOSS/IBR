'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { getSiteConfig } from '@/lib/config';
import { execute } from '@/lib/db';
import type { FormState } from '@/lib/form-state';
import { sendMail } from '@/lib/mail';
import { guardPublicForm } from '@/lib/public-form';
import { siteUrl } from '@/lib/site';
import { fieldErrorsOf, id as idSchema, valuesOf } from '@/lib/validators/common';
import { contactoSchema, peticionSchema } from '@/lib/validators/mensajes';
import { formatPhoneEc } from '@/lib/whatsapp';

const ORACION_OK = 'Recibimos tu petición. Vamos a orar por ti.';
const CONTACTO_OK = '¡Gracias! Te responderemos lo antes posible.';

export async function sendPeticion(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = valuesOf(formData, [
    'nombre',
    'telefono',
    'email',
    'texto',
    'es_privada',
    'acepta_datos',
  ]);
  const parsed = peticionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos marcados.',
      fieldErrors: fieldErrorsOf(parsed.error),
      values,
    };
  }
  const guard = await guardPublicForm(formData, 'oracion', ORACION_OK);
  if (!guard.ok)
    return { ...guard.state, values: guard.state.status === 'error' ? values : undefined };
  const d = parsed.data;
  await execute(
    'INSERT INTO peticiones (nombre, telefono, email, texto, es_privada, ip) VALUES (?, ?, ?, ?, ?, INET6_ATON(?))',
    [d.nombre, d.telefono, d.email, d.texto, d.es_privada, guard.ip],
  );
  const config = await getSiteConfig();
  await sendMail({
    to: config.email_avisos,
    subject: `Nueva petición de oración${d.nombre ? ` de ${d.nombre}` : ''}${d.es_privada ? ' (privada)' : ''}`,
    text: [
      d.es_privada
        ? 'Petición PRIVADA: solo para los pastores.'
        : 'Se puede compartir en la reunión de oración.',
      '',
      d.texto,
      '',
      d.nombre ? `Nombre: ${d.nombre}` : 'Anónima',
      d.telefono ? `WhatsApp: ${formatPhoneEc(d.telefono)}` : null,
      d.email ? `Correo: ${d.email}` : null,
      '',
      `Panel: ${siteUrl()}/admin/peticiones`,
    ]
      .filter((l) => l !== null)
      .join('\n'),
  });
  revalidatePath('/admin/peticiones');
  revalidatePath('/admin');
  return { status: 'success', message: ORACION_OK };
}

export async function sendContacto(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = valuesOf(formData, ['nombre', 'telefono', 'email', 'mensaje', 'acepta_datos']);
  const parsed = contactoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos marcados.',
      fieldErrors: fieldErrorsOf(parsed.error),
      values,
    };
  }
  const guard = await guardPublicForm(formData, 'contacto', CONTACTO_OK);
  if (!guard.ok)
    return { ...guard.state, values: guard.state.status === 'error' ? values : undefined };
  const d = parsed.data;
  await execute(
    'INSERT INTO contactos (nombre, email, telefono, mensaje, ip) VALUES (?, ?, ?, ?, INET6_ATON(?))',
    [d.nombre, d.email, d.telefono, d.mensaje, guard.ip],
  );
  const config = await getSiteConfig();
  await sendMail({
    to: config.email_avisos,
    replyTo: d.email,
    subject: `Mensaje de ${d.nombre} desde la página web`,
    text: [
      d.mensaje,
      '',
      `Nombre: ${d.nombre}`,
      d.telefono ? `WhatsApp: ${formatPhoneEc(d.telefono)}` : null,
      d.email ? `Correo: ${d.email}` : null,
      '',
      `Panel: ${siteUrl()}/admin/mensajes`,
    ]
      .filter((l) => l !== null)
      .join('\n'),
  });
  revalidatePath('/admin/mensajes');
  revalidatePath('/admin');
  return { status: 'success', message: CONTACTO_OK };
}

export async function togglePeticionAtendida(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = idSchema.safeParse(formData.get('id'));
  if (!parsed.success)
    return { status: 'error', message: 'No encontramos esta petición. Recarga la página.' };
  const atender = formData.get('atendida') === '1';
  const { affectedRows } = await execute(
    'UPDATE peticiones SET atendida = ?, atendida_por = ?, atendida_en = CASE WHEN ? THEN NOW() END WHERE id = ?',
    [atender, atender ? admin.id : null, atender, parsed.data],
  );
  if (affectedRows === 0)
    return { status: 'error', message: 'Esta petición ya no existe. Recarga la página.' };
  revalidatePath('/admin/peticiones');
  revalidatePath('/admin');
  return { status: 'success', message: atender ? 'Marcada como atendida' : 'Volvió a pendientes' };
}

export async function deletePeticion(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin({ role: 'admin' });
  const parsed = idSchema.safeParse(formData.get('id'));
  if (!parsed.success)
    return { status: 'error', message: 'No encontramos esta petición. Recarga la página.' };
  const { affectedRows } = await execute('DELETE FROM peticiones WHERE id = ?', [parsed.data]);
  if (affectedRows === 0)
    return { status: 'error', message: 'Esta petición ya fue eliminada. Recarga la página.' };
  revalidatePath('/admin/peticiones');
  return { status: 'success', message: 'Petición eliminada.' };
}

export async function toggleContactoLeido(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(formData.get('id'));
  if (!parsed.success)
    return { status: 'error', message: 'No encontramos este mensaje. Recarga la página.' };
  const leido = formData.get('leido') === '1';
  const { affectedRows } = await execute('UPDATE contactos SET leido = ? WHERE id = ?', [
    leido,
    parsed.data,
  ]);
  if (affectedRows === 0)
    return { status: 'error', message: 'Este mensaje ya no existe. Recarga la página.' };
  revalidatePath('/admin/mensajes');
  revalidatePath('/admin');
  return { status: 'success', message: leido ? 'Marcado como leído' : 'Marcado como no leído' };
}

export async function deleteContacto(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin({ role: 'admin' });
  const parsed = idSchema.safeParse(formData.get('id'));
  if (!parsed.success)
    return { status: 'error', message: 'No encontramos este mensaje. Recarga la página.' };
  const { affectedRows } = await execute('DELETE FROM contactos WHERE id = ?', [parsed.data]);
  if (affectedRows === 0)
    return { status: 'error', message: 'Este mensaje ya fue eliminado. Recarga la página.' };
  revalidatePath('/admin/mensajes');
  return { status: 'success', message: 'Mensaje eliminado.' };
}
