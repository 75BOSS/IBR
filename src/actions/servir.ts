'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { deleteImage, resolveImageField } from '@/lib/cloudinary';
import { getSiteConfig } from '@/lib/config';
import { execute, queryOne } from '@/lib/db';
import type { FormState } from '@/lib/form-state';
import { sendMail } from '@/lib/mail';
import { guardPublicForm } from '@/lib/public-form';
import { siteUrl } from '@/lib/site';
import { slugify } from '@/lib/slug';
import { uniqueSlug } from '@/lib/slug-db';
import { fieldErrorsOf, id as idSchema, valuesOf } from '@/lib/validators/common';
import {
  AREA_FIELDS,
  VOLUNTARIO_FIELDS,
  areaSchema,
  voluntarioSchema,
  voluntarioUpdateSchema,
} from '@/lib/validators/servir';
import { formatPhoneEc } from '@/lib/whatsapp';

function revalidateServir() {
  revalidatePath('/servir');
  revalidatePath('/admin/servir', 'layout');
  revalidatePath('/admin');
}

export async function saveArea(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const editingId = formData.get('id') ? idSchema.safeParse(formData.get('id')) : null;
  if (editingId && !editingId.success)
    return { status: 'error', message: 'No encontramos esta área. Vuelve a la lista.' };
  const values = valuesOf(formData, AREA_FIELDS);
  const parsed = areaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos marcados en rojo.',
      fieldErrors: fieldErrorsOf(parsed.error),
      values,
    };
  }
  const current = editingId
    ? await queryOne<{ imagen_url: string | null; imagen_public_id: string | null }>(
        'SELECT imagen_url, imagen_public_id FROM areas_servicio WHERE id = ?',
        [editingId.data],
      )
    : null;
  if (editingId && !current)
    return { status: 'error', message: 'Esta área ya no existe. Vuelve a la lista.' };
  const imagen = await resolveImageField(
    formData,
    'imagen',
    { url: current?.imagen_url ?? null, publicId: current?.imagen_public_id ?? null },
    'servir',
  );
  if ('error' in imagen)
    return { status: 'error', fieldErrors: { imagen: [imagen.error] }, values };

  const d = parsed.data;
  const params = [
    d.nombre,
    d.descripcion,
    d.responsable_id,
    imagen.url,
    imagen.publicId,
    d.activo,
    d.orden,
  ];
  if (editingId) {
    await execute(
      `UPDATE areas_servicio SET nombre = ?, descripcion = ?, responsable_id = ?, imagen_url = ?,
              imagen_public_id = ?, activo = ?, orden = ? WHERE id = ?`,
      [...params, editingId.data],
    );
  } else {
    const slug = await uniqueSlug('areas_servicio', slugify(d.nombre, 120), null, 'area');
    await execute(
      `INSERT INTO areas_servicio (nombre, descripcion, responsable_id, imagen_url, imagen_public_id, activo, orden, slug)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [...params, slug],
    );
  }
  revalidateServir();
  redirect(`/admin/servir?aviso=${editingId ? 'guardado' : 'creado'}`);
}

/** Solo se borra un área sin voluntarios; si tiene, se desactiva (no se pierde el historial). */
export async function deleteArea(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(formData.get('id'));
  if (!parsed.success) return { status: 'error', message: 'No encontramos esta área.' };
  const area = await queryOne<{ nombre: string; imagen_public_id: string | null; n: number }>(
    `SELECT a.nombre, a.imagen_public_id, (SELECT COUNT(*) FROM voluntarios v WHERE v.area_id = a.id) AS n
       FROM areas_servicio a WHERE a.id = ?`,
    [parsed.data],
  );
  if (!area) return { status: 'error', message: 'Esta área ya fue eliminada. Recarga la página.' };
  if (Number(area.n) > 0) {
    return {
      status: 'error',
      message: `«${area.nombre}» tiene voluntarios registrados. Desactívala (edítala y desmarca «Activa») para sacarla del sitio sin perder su historial.`,
    };
  }
  await execute('DELETE FROM areas_servicio WHERE id = ?', [parsed.data]);
  await deleteImage(area.imagen_public_id);
  revalidateServir();
  return { status: 'success', message: `Área «${area.nombre}» eliminada.` };
}

const OFRECER_OK = '¡Gracias por querer servir! Te escribiremos pronto por WhatsApp.';

/** «Quiero servir» (público): Zod → honeypot → límite por IP → insert → aviso. */
export async function ofrecerme(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = valuesOf(formData, VOLUNTARIO_FIELDS);
  const parsed = voluntarioSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos marcados.',
      fieldErrors: fieldErrorsOf(parsed.error),
      values,
    };
  }
  const guard = await guardPublicForm(formData, 'servir', OFRECER_OK);
  if (!guard.ok)
    return { ...guard.state, values: guard.state.status === 'error' ? values : undefined };
  const d = parsed.data;
  const area = await queryOne<{ nombre: string }>(
    'SELECT nombre FROM areas_servicio WHERE id = ? AND activo = 1',
    [d.area_id],
  );
  if (!area) {
    return {
      status: 'error',
      fieldErrors: { area_id: ['Esa área ya no está disponible. Elige otra.'] },
      values,
    };
  }
  await execute(
    `INSERT INTO voluntarios (area_id, nombre, telefono, email, disponibilidad, mensaje, acepta_datos, ip)
     VALUES (?, ?, ?, ?, ?, ?, 1, INET6_ATON(?))`,
    [d.area_id, d.nombre, d.telefono, d.email, d.disponibilidad, d.mensaje, guard.ip],
  );
  const config = await getSiteConfig();
  await sendMail({
    to: config.email_avisos,
    subject: `${d.nombre} quiere servir en ${area.nombre}`,
    text: [
      `${d.nombre} se ofreció para servir en ${area.nombre}.`,
      '',
      `WhatsApp: ${formatPhoneEc(d.telefono)}`,
      d.email ? `Correo: ${d.email}` : null,
      d.disponibilidad ? `Disponibilidad: ${d.disponibilidad}` : null,
      d.mensaje ? `Mensaje: ${d.mensaje}` : null,
      '',
      `Panel: ${siteUrl()}/admin/servir/voluntarios`,
    ]
      .filter((l) => l !== null)
      .join('\n'),
  });
  revalidateServir();
  return { status: 'success', message: OFRECER_OK };
}

export async function updateVoluntario(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = voluntarioUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { status: 'error', message: 'Revisa el estado elegido e intenta de nuevo.' };
  const { affectedRows } = await execute(
    'UPDATE voluntarios SET estado = ?, notas = ? WHERE id = ?',
    [parsed.data.estado, parsed.data.notas, parsed.data.id],
  );
  if (affectedRows === 0)
    return { status: 'error', message: 'Este voluntario ya no existe. Recarga la página.' };
  revalidateServir();
  return { status: 'success', message: 'Voluntario actualizado' };
}

/** Borra los datos de un voluntario (cuando lo pide): solo administradores. */
export async function deleteVoluntario(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin({ role: 'admin' });
  const parsed = idSchema.safeParse(formData.get('id'));
  if (!parsed.success) return { status: 'error', message: 'No encontramos este voluntario.' };
  const { affectedRows } = await execute('DELETE FROM voluntarios WHERE id = ?', [parsed.data]);
  if (affectedRows === 0)
    return { status: 'error', message: 'Ya fue eliminado. Recarga la página.' };
  revalidateServir();
  return { status: 'success', message: 'Datos del voluntario eliminados.' };
}
