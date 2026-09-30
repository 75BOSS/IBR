'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { deleteImage, resolveImageField } from '@/lib/cloudinary';
import { execute, queryOne } from '@/lib/db';
import type { FormState } from '@/lib/form-state';
import { fieldErrorsOf, id as idSchema, valuesOf } from '@/lib/validators/common';
import { EQUIPO_FIELDS, equipoSchema } from '@/lib/validators/equipo';

type Foto = { foto_url: string | null; foto_public_id: string | null };

function revalidateEquipo() {
  revalidatePath('/admin/equipo');
  revalidatePath('/', 'layout'); // inicio y «Nosotros» muestran a los pastores
}

export async function saveEquipo(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const editingId = formData.get('id') ? idSchema.safeParse(formData.get('id')) : null;
  if (editingId && !editingId.success)
    return { status: 'error', message: 'No encontramos a esta persona. Vuelve a la lista.' };

  const parsed = equipoSchema.safeParse(Object.fromEntries(formData));
  const values = valuesOf(formData, EQUIPO_FIELDS);
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos marcados en rojo.',
      fieldErrors: fieldErrorsOf(parsed.error),
      values,
    };
  }

  const current = editingId
    ? await queryOne<Foto>('SELECT foto_url, foto_public_id FROM equipo WHERE id = ?', [
        editingId.data,
      ])
    : null;
  if (editingId && !current)
    return { status: 'error', message: 'Esta persona ya no existe. Vuelve a la lista.' };

  const foto = await resolveImageField(
    formData,
    'foto',
    { url: current?.foto_url ?? null, publicId: current?.foto_public_id ?? null },
    'equipo',
  );
  if ('error' in foto) return { status: 'error', fieldErrors: { foto: [foto.error] }, values };

  const d = parsed.data;
  const params = [d.nombre, d.rol, d.bio, foto.url, foto.publicId, d.es_pastor, d.orden, d.visible];
  if (editingId) {
    await execute(
      `UPDATE equipo SET nombre = ?, rol = ?, bio = ?, foto_url = ?, foto_public_id = ?, es_pastor = ?, orden = ?, visible = ?
        WHERE id = ?`,
      [...params, editingId.data],
    );
  } else {
    await execute(
      `INSERT INTO equipo (nombre, rol, bio, foto_url, foto_public_id, es_pastor, orden, visible)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      params,
    );
  }
  revalidateEquipo();
  redirect(`/admin/equipo?aviso=${editingId ? 'guardado' : 'creado'}`);
}

export async function deleteEquipo(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(formData.get('id'));
  if (!parsed.success)
    return { status: 'error', message: 'No encontramos a esta persona. Recarga la página.' };
  const row = await queryOne<Foto & { nombre: string }>(
    'SELECT nombre, foto_url, foto_public_id FROM equipo WHERE id = ?',
    [parsed.data],
  );
  if (!row)
    return { status: 'error', message: 'Esta persona ya fue eliminada. Recarga la página.' };
  await execute('DELETE FROM equipo WHERE id = ?', [parsed.data]);
  await deleteImage(row.foto_public_id);
  revalidateEquipo();
  return { status: 'success', message: `${row.nombre} fue eliminado del equipo.` };
}
