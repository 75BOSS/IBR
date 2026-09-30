'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { todayInChurchTz } from '@/lib/dates';
import { execute, queryOne } from '@/lib/db';
import type { FormState } from '@/lib/form-state';
import { slugify } from '@/lib/slug';
import { uniqueSlug } from '@/lib/slug-db';
import { fieldErrorsOf, id as idSchema, valuesOf } from '@/lib/validators/common';
import { PREDICA_FIELDS, predicaSchema } from '@/lib/validators/predicas';
import { youTubeThumbnail } from '@/lib/youtube';
import { fetchVideoInfo } from '@/lib/youtube-api';

function revalidatePredicas() {
  revalidatePath('/admin/predicas');
  revalidatePath('/predicas');
  revalidatePath('/', 'layout'); // el inicio muestra la última prédica
}

export async function savePredica(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const editingId = formData.get('id') ? idSchema.safeParse(formData.get('id')) : null;
  if (editingId && !editingId.success)
    return { status: 'error', message: 'No encontramos esta prédica. Vuelve a la lista.' };
  const values = valuesOf(formData, PREDICA_FIELDS);
  const parsed = predicaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos marcados en rojo.',
      fieldErrors: fieldErrorsOf(parsed.error),
      values,
    };
  }
  const d = parsed.data;
  const id = editingId?.data ?? null;

  const duplicate = await queryOne<{ id: number; titulo: string }>(
    'SELECT id, titulo FROM predicas WHERE youtube_id = ? AND id <> ?',
    [d.enlace, id ?? 0],
  );
  if (duplicate) {
    return {
      status: 'error',
      fieldErrors: { enlace: [`Este video ya está cargado como «${duplicate.titulo}».`] },
      values,
    };
  }

  const current = id
    ? await queryOne<{
        youtube_id: string;
        miniatura_url: string | null;
        duracion_seg: number | null;
      }>('SELECT youtube_id, miniatura_url, duracion_seg FROM predicas WHERE id = ?', [id])
    : null;
  if (id && !current)
    return { status: 'error', message: 'Esta prédica ya no existe. Vuelve a la lista.' };

  // Solo se consulta YouTube si el video es nuevo o cambió, o si falta el título.
  const videoChanged = !current || current.youtube_id !== d.enlace;
  const info = videoChanged || !d.titulo ? await fetchVideoInfo(d.enlace) : null;
  const titulo = d.titulo ?? info?.titulo;
  if (!titulo) {
    return {
      status: 'error',
      fieldErrors: { titulo: ['No pudimos traer el título desde YouTube. Escríbelo aquí.'] },
      values,
    };
  }
  const fecha = d.fecha ?? info?.fecha ?? todayInChurchTz();
  const miniatura = videoChanged
    ? (info?.miniatura_url ?? youTubeThumbnail(d.enlace))
    : current!.miniatura_url;
  const duracion = videoChanged ? (info?.duracion_seg ?? null) : current!.duracion_seg;
  const slug = await uniqueSlug('predicas', `${slugify(titulo, 190)}-${fecha}`, id, 'predica');

  if (d.destacada) await execute('UPDATE predicas SET destacada = 0 WHERE id <> ?', [id ?? 0]);
  const params = [
    titulo,
    slug,
    d.enlace,
    d.serie,
    d.predicador,
    fecha,
    d.descripcion,
    d.pasaje,
    miniatura,
    duracion,
    d.destacada,
    d.publicada,
  ];
  if (id) {
    await execute(
      `UPDATE predicas SET titulo = ?, slug = ?, youtube_id = ?, serie = ?, predicador = ?, fecha = ?, descripcion = ?,
              pasaje = ?, miniatura_url = ?, duracion_seg = ?, destacada = ?, publicada = ?
        WHERE id = ?`,
      [...params, id],
    );
  } else {
    await execute(
      `INSERT INTO predicas (titulo, slug, youtube_id, serie, predicador, fecha, descripcion, pasaje, miniatura_url, duracion_seg, destacada, publicada)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params,
    );
  }
  revalidatePredicas();
  redirect(`/admin/predicas?aviso=${id ? 'guardado' : 'creado'}`);
}

export async function deletePredica(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(formData.get('id'));
  if (!parsed.success)
    return { status: 'error', message: 'No encontramos esta prédica. Recarga la página.' };
  const { affectedRows } = await execute('DELETE FROM predicas WHERE id = ?', [parsed.data]);
  if (affectedRows === 0)
    return { status: 'error', message: 'Esta prédica ya fue eliminada. Recarga la página.' };
  revalidatePredicas();
  return { status: 'success', message: 'Prédica eliminada del sitio (el video sigue en YouTube).' };
}
