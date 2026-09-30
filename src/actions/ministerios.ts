'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { resolveImageField } from '@/lib/cloudinary';
import { execute, queryOne } from '@/lib/db';
import type { FormState } from '@/lib/form-state';
import { slugify } from '@/lib/slug';
import { uniqueSlug } from '@/lib/slug-db';
import { fieldErrorsOf, id as idSchema, valuesOf } from '@/lib/validators/common';
import { MINISTERIO_FIELDS, ministerioSchema } from '@/lib/validators/ministerios';

/**
 * Ministerios = rangos de edad (tabla del sistema heredado, ver MIGRACION-PHP.md). Se crean y
 * editan, pero no se borran: grupos, registros y reuniones apuntan a ellos. Para sacarlo del
 * sitio se desactiva. El slug no cambia al editar, para no romper enlaces compartidos.
 */
export async function saveMinisterio(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const editingId = formData.get('id') ? idSchema.safeParse(formData.get('id')) : null;
  if (editingId && !editingId.success)
    return { status: 'error', message: 'No encontramos este ministerio. Vuelve a la lista.' };

  const values = valuesOf(formData, MINISTERIO_FIELDS);
  const parsed = ministerioSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos marcados en rojo.',
      fieldErrors: fieldErrorsOf(parsed.error),
      values,
    };
  }

  const current = editingId
    ? await queryOne<{ slug: string; imagen_url: string | null; imagen_public_id: string | null }>(
        'SELECT slug, imagen_url, imagen_public_id FROM rangos_edad WHERE id = ?',
        [editingId.data],
      )
    : null;
  if (editingId && !current)
    return { status: 'error', message: 'Este ministerio ya no existe. Vuelve a la lista.' };

  const imagen = await resolveImageField(
    formData,
    'imagen',
    { url: current?.imagen_url ?? null, publicId: current?.imagen_public_id ?? null },
    'ministerios',
  );
  if ('error' in imagen)
    return { status: 'error', fieldErrors: { imagen: [imagen.error] }, values };

  const d = parsed.data;
  const params = [
    d.nombre,
    d.nombre_ministerio,
    d.edad_min,
    d.edad_max,
    d.descripcion,
    d.color,
    imagen.url,
    imagen.publicId,
    d.orden,
    d.activo,
  ];
  if (editingId) {
    await execute(
      `UPDATE rangos_edad SET nombre = ?, nombre_ministerio = ?, edad_min = ?, edad_max = ?, descripcion = ?,
              color = ?, imagen_url = ?, imagen_public_id = ?, orden = ?, activo = ?
        WHERE id = ?`,
      [...params, editingId.data],
    );
  } else {
    const slug = await uniqueSlug('rangos_edad', slugify(d.nombre, 70), null, 'ministerio');
    await execute(
      `INSERT INTO rangos_edad (nombre, nombre_ministerio, edad_min, edad_max, descripcion, color,
                                imagen_url, imagen_public_id, orden, activo, slug)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [...params, slug],
    );
  }
  revalidatePath('/admin/ministerios');
  // Nombre y color del ministerio se ven en grupos, reuniones, eventos y el inicio.
  revalidatePath('/', 'layout');
  redirect(`/admin/ministerios?aviso=${editingId ? 'guardado' : 'creado'}`);
}
