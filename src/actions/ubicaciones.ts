'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { execute, queryOne } from '@/lib/db';
import type { FormState } from '@/lib/form-state';
import { fieldErrorsOf, id as idSchema, valuesOf } from '@/lib/validators/common';
import { UBICACION_FIELDS, ubicacionSchema } from '@/lib/validators/ubicaciones';

export async function saveUbicacion(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const editingId = formData.get('id') ? idSchema.safeParse(formData.get('id')) : null;
  if (editingId && !editingId.success)
    return { status: 'error', message: 'No encontramos este lugar. Vuelve a la lista.' };
  const parsed = ubicacionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos marcados en rojo.',
      fieldErrors: fieldErrorsOf(parsed.error),
      values: valuesOf(formData, UBICACION_FIELDS),
    };
  }
  const d = parsed.data;
  const params = [
    d.nombre,
    d.tipo,
    d.direccion,
    d.referencia,
    d.zona,
    d.maps_url,
    d.publica,
    d.activo,
  ];
  if (editingId) {
    await execute(
      `UPDATE ubicaciones SET nombre = ?, tipo = ?, direccion = ?, referencia = ?, zona = ?, maps_url = ?, publica = ?, activo = ?
        WHERE id = ?`,
      [...params, editingId.data],
    );
  } else {
    await execute(
      `INSERT INTO ubicaciones (nombre, tipo, direccion, referencia, zona, maps_url, publica, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      params,
    );
  }
  revalidatePath('/', 'layout');
  redirect(`/admin/ubicaciones?aviso=${editingId ? 'guardado' : 'creado'}`);
}

export async function deleteUbicacion(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(formData.get('id'));
  if (!parsed.success)
    return { status: 'error', message: 'No encontramos este lugar. Recarga la página.' };
  const uso = await queryOne<{ grupos: number; reuniones: number; eventos: number }>(
    `SELECT (SELECT COUNT(*) FROM grupos WHERE ubicacion_id = ?) AS grupos,
            (SELECT COUNT(*) FROM reuniones WHERE ubicacion_id = ?) AS reuniones,
            (SELECT COUNT(*) FROM eventos WHERE ubicacion_id = ?) AS eventos`,
    [parsed.data, parsed.data, parsed.data],
  );
  const total = Number(uso?.grupos ?? 0) + Number(uso?.reuniones ?? 0) + Number(uso?.eventos ?? 0);
  if (total > 0) {
    // Prevención de errores: borrar dejaría grupos o reuniones sin lugar.
    return {
      status: 'error',
      message: `Este lugar lo usan ${uso?.grupos ?? 0} grupo(s), ${uso?.reuniones ?? 0} reunión(es) y ${uso?.eventos ?? 0} evento(s). Cámbialos de lugar primero, o edita este lugar y desmarca «Activo».`,
    };
  }
  const { affectedRows } = await execute('DELETE FROM ubicaciones WHERE id = ?', [parsed.data]);
  if (affectedRows === 0)
    return { status: 'error', message: 'Este lugar ya fue eliminado. Recarga la página.' };
  revalidatePath('/admin/ubicaciones');
  return { status: 'success', message: 'Lugar eliminado.' };
}
