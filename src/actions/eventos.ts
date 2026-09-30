'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { deleteImage, resolveImageField } from '@/lib/cloudinary';
import { todayInChurchTz } from '@/lib/dates';
import { execute, queryOne } from '@/lib/db';
import type { FormState } from '@/lib/form-state';
import { slugify } from '@/lib/slug';
import { uniqueSlug } from '@/lib/slug-db';
import { fieldErrorsOf, id as idSchema, valuesOf } from '@/lib/validators/common';
import { EVENTO_FIELDS, eventoSchema } from '@/lib/validators/eventos';

function revalidateEventos(slug?: string) {
  revalidatePath('/admin/eventos');
  revalidatePath('/eventos');
  if (slug) revalidatePath(`/eventos/${slug}`);
  revalidatePath('/', 'layout'); // el inicio muestra los próximos eventos
}

export async function saveEvento(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const editingId = formData.get('id') ? idSchema.safeParse(formData.get('id')) : null;
  if (editingId && !editingId.success)
    return { status: 'error', message: 'No encontramos este evento. Vuelve a la lista.' };
  const values = valuesOf(formData, EVENTO_FIELDS);
  const parsed = eventoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos marcados en rojo.',
      fieldErrors: fieldErrorsOf(parsed.error),
      values,
    };
  }
  const id = editingId?.data ?? null;
  const current = id
    ? await queryOne<{ slug: string; imagen_url: string | null; imagen_public_id: string | null }>(
        'SELECT slug, imagen_url, imagen_public_id FROM eventos WHERE id = ?',
        [id],
      )
    : null;
  if (id && !current)
    return { status: 'error', message: 'Este evento ya no existe. Vuelve a la lista.' };

  const imagen = await resolveImageField(
    formData,
    'imagen',
    { url: current?.imagen_url ?? null, publicId: current?.imagen_public_id ?? null },
    'eventos',
  );
  if ('error' in imagen)
    return { status: 'error', fieldErrors: { imagen: [imagen.error] }, values };

  const d = parsed.data;
  // El enlace se mantiene al editar (ya pudo compartirse por WhatsApp); solo se crea al inicio.
  const slug =
    current?.slug ??
    (await uniqueSlug(
      'eventos',
      `${slugify(d.titulo, 190)}-${todayInChurchTz(d.fecha_inicio)}`,
      id,
      'evento',
    ));
  if (d.destacado) await execute('UPDATE eventos SET destacado = 0 WHERE id <> ?', [id ?? 0]);
  const params = [
    d.titulo,
    d.resumen,
    d.cuerpo,
    d.categoria,
    d.fecha_inicio,
    d.fecha_fin,
    d.todo_el_dia,
    d.ubicacion_id,
    d.rango_edad_id,
    imagen.url,
    imagen.publicId,
    d.link_externo,
    d.destacado,
    d.publicado,
    d.requiere_inscripcion,
    d.requiere_inscripcion ? d.cupo : null,
  ];
  if (id) {
    await execute(
      `UPDATE eventos SET titulo = ?, resumen = ?, cuerpo = ?, categoria = ?, fecha_inicio = ?, fecha_fin = ?, todo_el_dia = ?,
              ubicacion_id = ?, rango_edad_id = ?, imagen_url = ?, imagen_public_id = ?, link_externo = ?, destacado = ?, publicado = ?,
              requiere_inscripcion = ?, cupo = ?
        WHERE id = ?`,
      [...params, id],
    );
  } else {
    await execute(
      `INSERT INTO eventos (titulo, resumen, cuerpo, categoria, fecha_inicio, fecha_fin, todo_el_dia, ubicacion_id, rango_edad_id,
                            imagen_url, imagen_public_id, link_externo, destacado, publicado,
                            requiere_inscripcion, cupo, slug, creado_por)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [...params, slug, admin.id],
    );
  }
  revalidateEventos(slug);
  redirect(`/admin/eventos?aviso=${id ? 'guardado' : 'creado'}`);
}

export async function deleteEvento(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(formData.get('id'));
  if (!parsed.success)
    return { status: 'error', message: 'No encontramos este evento. Recarga la página.' };
  const row = await queryOne<{ slug: string; titulo: string; imagen_public_id: string | null }>(
    'SELECT slug, titulo, imagen_public_id FROM eventos WHERE id = ?',
    [parsed.data],
  );
  if (!row) return { status: 'error', message: 'Este evento ya fue eliminado. Recarga la página.' };
  await execute('DELETE FROM eventos WHERE id = ?', [parsed.data]);
  await deleteImage(row.imagen_public_id);
  revalidateEventos(row.slug);
  return { status: 'success', message: `«${row.titulo}» fue eliminado.` };
}
