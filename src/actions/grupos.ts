'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { deleteImage, resolveImageField } from '@/lib/cloudinary';
import { getSiteConfig, noticeEmail } from '@/lib/config';
import { execute, queryOne } from '@/lib/db';
import type { FormState } from '@/lib/form-state';
import { sendMail } from '@/lib/mail';
import { guardPublicForm } from '@/lib/public-form';
import { siteUrl } from '@/lib/site';
import { fieldErrorsOf, id as idSchema, optionalText, valuesOf } from '@/lib/validators/common';
import { GRUPO_FIELDS, grupoSchema, unirmeSchema } from '@/lib/validators/grupos';
import { formatPhoneEc } from '@/lib/whatsapp';
import { sendWhatsAppTemplate } from '@/lib/whatsapp-cloud';

function revalidateGrupos(id?: number) {
  revalidatePath('/admin/grupos');
  revalidatePath('/grupos');
  if (id) revalidatePath(`/grupos/${id}`);
}

export async function saveGrupo(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const editingId = formData.get('id') ? idSchema.safeParse(formData.get('id')) : null;
  if (editingId && !editingId.success)
    return { status: 'error', message: 'No encontramos este grupo. Vuelve a la lista.' };
  const values = valuesOf(formData, GRUPO_FIELDS);
  const parsed = grupoSchema.safeParse(Object.fromEntries(formData));
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
    ? await queryOne<{ imagen_url: string | null; imagen_public_id: string | null }>(
        'SELECT imagen_url, imagen_public_id FROM grupos WHERE id = ?',
        [id],
      )
    : null;
  if (id && !current)
    return { status: 'error', message: 'Este grupo ya no existe. Vuelve a la lista.' };
  const imagen = await resolveImageField(
    formData,
    'imagen',
    { url: current?.imagen_url ?? null, publicId: current?.imagen_public_id ?? null },
    'grupos',
  );
  if ('error' in imagen)
    return { status: 'error', fieldErrors: { imagen: [imagen.error] }, values };

  const d = parsed.data;
  const params = [
    d.nombre,
    d.descripcion,
    d.tipo,
    d.rango_edad_id,
    d.ubicacion_id,
    d.dia_semana,
    d.hora,
    d.frecuencia,
    d.lider_nombre,
    d.lider_telefono,
    d.lider_email,
    d.cupo,
    imagen.url,
    imagen.publicId,
    d.publico,
    d.activo,
  ];
  if (id) {
    await execute(
      `UPDATE grupos SET nombre = ?, descripcion = ?, tipo = ?, rango_edad_id = ?, ubicacion_id = ?, dia_semana = ?, hora = ?,
              frecuencia = ?, lider_nombre = ?, lider_telefono = ?, lider_email = ?, cupo = ?, imagen_url = ?,
              imagen_public_id = ?, publico = ?, activo = ?
        WHERE id = ?`,
      [...params, id],
    );
  } else {
    await execute(
      `INSERT INTO grupos (nombre, descripcion, tipo, rango_edad_id, ubicacion_id, dia_semana, hora, frecuencia, lider_nombre,
                           lider_telefono, lider_email, cupo, imagen_url, imagen_public_id, publico, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params,
    );
  }
  revalidateGrupos(id ?? undefined);
  redirect(`/admin/grupos?aviso=${id ? 'guardado' : 'creado'}`);
}

export async function deleteGrupo(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(formData.get('id'));
  if (!parsed.success)
    return { status: 'error', message: 'No encontramos este grupo. Recarga la página.' };
  const row = await queryOne<{ nombre: string; imagen_public_id: string | null }>(
    'SELECT nombre, imagen_public_id FROM grupos WHERE id = ?',
    [parsed.data],
  );
  if (!row) return { status: 'error', message: 'Este grupo ya fue eliminado. Recarga la página.' };
  await execute('DELETE FROM grupos WHERE id = ?', [parsed.data]); // solicitudes: ON DELETE CASCADE
  await deleteImage(row.imagen_public_id);
  revalidateGrupos(parsed.data);
  return { status: 'success', message: `El grupo «${row.nombre}» fue eliminado.` };
}

const solicitudUpdateSchema = z.object({
  id: idSchema,
  estado: z.enum(['pendiente', 'contactado', 'integrado', 'rechazado'], {
    error: 'Elige un estado.',
  }),
  notas: optionalText(1000),
});

export async function updateSolicitud(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = solicitudUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { status: 'error', message: 'Revisa el estado elegido e intenta de nuevo.' };
  const { affectedRows } = await execute(
    'UPDATE solicitudes_grupo SET estado = ?, notas = ? WHERE id = ?',
    [parsed.data.estado, parsed.data.notas, parsed.data.id],
  );
  if (affectedRows === 0)
    return { status: 'error', message: 'Esta solicitud ya no existe. Recarga la página.' };
  revalidatePath('/admin/grupos/solicitudes');
  revalidatePath('/admin');
  return { status: 'success', message: 'Solicitud actualizada' };
}

const JOIN_OK = '¡Listo! El líder del grupo te escribirá pronto por WhatsApp.';

/** «Quiero unirme» (público): Zod → honeypot → límite por IP → insert → aviso al líder. */
export async function joinGroup(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = valuesOf(formData, ['nombre', 'telefono', 'mensaje', 'acepta_datos']);
  const parsed = unirmeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos marcados.',
      fieldErrors: fieldErrorsOf(parsed.error),
      values,
    };
  }
  const guard = await guardPublicForm(formData, 'unirme_grupo', JOIN_OK);
  if (!guard.ok)
    return { ...guard.state, values: guard.state.status === 'error' ? values : undefined };

  const d = parsed.data;
  const group = await queryOne<{
    id: number;
    nombre: string;
    lider_nombre: string | null;
    lider_email: string | null;
    lider_telefono: string | null;
  }>(
    'SELECT id, nombre, lider_nombre, lider_email, lider_telefono FROM grupos WHERE id = ? AND publico = 1 AND activo = 1',
    [d.grupo_id],
  );
  if (!group)
    return {
      status: 'error',
      message: 'Este grupo ya no recibe solicitudes. Mira otros grupos en el directorio.',
    };

  await execute(
    `INSERT INTO solicitudes_grupo (grupo_id, nombre, telefono, mensaje, acepta_datos, ip)
     VALUES (?, ?, ?, ?, 1, INET6_ATON(?))`,
    [group.id, d.nombre, d.telefono, d.mensaje, guard.ip],
  );
  const config = await getSiteConfig();
  await sendMail({
    to: group.lider_email ?? noticeEmail(config),
    subject: `Nueva persona quiere unirse a «${group.nombre}»`,
    text: [
      `Hola${group.lider_nombre ? ` ${group.lider_nombre}` : ''}:`,
      '',
      `${d.nombre} quiere unirse al grupo «${group.nombre}».`,
      `Teléfono / WhatsApp: ${formatPhoneEc(d.telefono)}`,
      d.mensaje ? `Mensaje: ${d.mensaje}` : '',
      '',
      // El líder normalmente no entra al panel: a él solo se le pide escribir; el enlace al panel
      // va cuando el aviso llega al correo de la iglesia.
      group.lider_email
        ? 'Escríbele pronto por WhatsApp para darle la bienvenida.'
        : `Escríbele pronto y marca la solicitud en el panel: ${siteUrl()}/admin/grupos/solicitudes`,
    ]
      .filter((line) => line !== null)
      .join('\n'),
  });
  // Plantilla «nueva_solicitud_grupo»: {{1}} líder, {{2}} persona, {{3}} grupo, {{4}} su WhatsApp.
  if (group.lider_telefono) {
    await sendWhatsAppTemplate({
      to: group.lider_telefono,
      template: 'WHATSAPP_TEMPLATE_SOLICITUD',
      params: [group.lider_nombre ?? 'líder', d.nombre, group.nombre, formatPhoneEc(d.telefono)],
    });
  }
  revalidatePath('/admin/grupos/solicitudes');
  return { status: 'success', message: JOIN_OK };
}
