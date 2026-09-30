'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { execute } from '@/lib/db';
import type { FormState } from '@/lib/form-state';
import { fieldErrorsOf, id as idSchema, valuesOf } from '@/lib/validators/common';
import { REUNION_FIELDS, reunionSchema } from '@/lib/validators/reuniones';

function revalidateReuniones() {
  revalidatePath('/admin/reuniones');
  revalidatePath('/', 'layout'); // inicio y /reuniones muestran los horarios
}

export async function saveReunion(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const editingId = formData.get('id') ? idSchema.safeParse(formData.get('id')) : null;
  if (editingId && !editingId.success)
    return { status: 'error', message: 'No encontramos esta reunión. Vuelve a la lista.' };
  const parsed = reunionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos marcados en rojo.',
      fieldErrors: fieldErrorsOf(parsed.error),
      values: valuesOf(formData, REUNION_FIELDS),
    };
  }
  const d = parsed.data;
  const params = [
    d.nombre,
    d.descripcion,
    d.dia_semana,
    d.hora_inicio,
    d.hora_fin,
    d.ubicacion_id,
    d.rango_edad_id,
    d.en_linea,
    d.orden,
    d.activo,
  ];
  if (editingId) {
    await execute(
      `UPDATE reuniones SET nombre = ?, descripcion = ?, dia_semana = ?, hora_inicio = ?, hora_fin = ?,
              ubicacion_id = ?, rango_edad_id = ?, en_linea = ?, orden = ?, activo = ?
        WHERE id = ?`,
      [...params, editingId.data],
    );
  } else {
    await execute(
      `INSERT INTO reuniones (nombre, descripcion, dia_semana, hora_inicio, hora_fin, ubicacion_id, rango_edad_id, en_linea, orden, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params,
    );
  }
  revalidateReuniones();
  redirect(`/admin/reuniones?aviso=${editingId ? 'guardado' : 'creado'}`);
}

export async function deleteReunion(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(formData.get('id'));
  if (!parsed.success)
    return { status: 'error', message: 'No encontramos esta reunión. Recarga la página.' };
  const { affectedRows } = await execute('DELETE FROM reuniones WHERE id = ?', [parsed.data]);
  if (affectedRows === 0)
    return { status: 'error', message: 'Esta reunión ya fue eliminada. Recarga la página.' };
  revalidateReuniones();
  return { status: 'success', message: 'Reunión eliminada.' };
}
