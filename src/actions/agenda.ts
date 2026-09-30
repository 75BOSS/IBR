'use server';

import { revalidatePath } from 'next/cache';
import {
  agendaUrl,
  buildAgendaText,
  getSuscriptorByToken,
  listActiveSuscriptores,
  newSubscriberToken,
} from '@/lib/agenda';
import { requireAdmin } from '@/lib/auth';
import { getSiteConfig } from '@/lib/config';
import { execute, queryOne } from '@/lib/db';
import type { FormState } from '@/lib/form-state';
import { sendMail } from '@/lib/mail';
import { guardPublicForm } from '@/lib/public-form';
import { consumeRateLimit, minutesText } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/request';
import { SUSCRIPCION_FIELDS, envioSchema, suscripcionSchema } from '@/lib/validators/agenda';
import { fieldErrorsOf, id as idSchema, valuesOf } from '@/lib/validators/common';

async function sendConfirmation(email: string, nombre: string | null, token: string) {
  const config = await getSiteConfig();
  return sendMail({
    to: email,
    subject: `Confirma tu suscripción a la agenda de ${config.nombre_corto ?? 'la iglesia'}`,
    text: [
      `Hola${nombre ? ` ${nombre}` : ''}:`,
      '',
      `Pediste recibir cada semana la agenda de ${config.nombre_iglesia}.`,
      `Para confirmarlo, abre este enlace y pulsa «Confirmar»: ${agendaUrl(token)}`,
      '',
      'Si no fuiste tú, ignora este correo: no te enviaremos nada más.',
    ].join('\n'),
  });
}

/**
 * Suscripción pública con doble confirmación. La respuesta es la misma exista o no el correo
 * (no revela quién está suscrito); a quien no ha confirmado se le reenvía el enlace.
 */
export async function suscribirse(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = valuesOf(formData, SUSCRIPCION_FIELDS);
  const parsed = suscripcionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos marcados.',
      fieldErrors: fieldErrorsOf(parsed.error),
      values,
    };
  }
  const ok = `Te enviamos un correo a ${parsed.data.email}. Ábrelo y confirma tu suscripción.`;
  const guard = await guardPublicForm(formData, 'agenda', ok);
  if (!guard.ok)
    return { ...guard.state, values: guard.state.status === 'error' ? values : undefined };
  const d = parsed.data;

  const existing = await queryOne<{ id: number; token: string; activo: boolean }>(
    'SELECT id, token, activo FROM suscriptores WHERE email = ?',
    [d.email],
  );
  if (existing?.activo) return { status: 'success', message: ok };
  let token: string;
  if (existing) {
    token = existing.token;
    await execute(
      'UPDATE suscriptores SET nombre = COALESCE(?, nombre), acepta_datos = 1, ip = INET6_ATON(?) WHERE id = ?',
      [d.nombre, guard.ip, existing.id],
    );
  } else {
    token = newSubscriberToken();
    await execute(
      `INSERT INTO suscriptores (email, nombre, token, activo, acepta_datos, ip)
       VALUES (?, ?, ?, 0, 1, INET6_ATON(?))`,
      [d.email, d.nombre, token, guard.ip],
    );
  }
  await sendConfirmation(d.email, d.nombre, token);
  revalidatePath('/admin/agenda');
  return { status: 'success', message: ok };
}

async function changeSubscription(formData: FormData, activate: boolean): Promise<FormState> {
  const limit = await consumeRateLimit('agenda_baja', { ip: await getClientIp() });
  if (limit.blocked) {
    return {
      status: 'error',
      message: `Demasiados intentos. Espera ${minutesText(limit.retryAfterMinutes)} y vuelve a intentar.`,
    };
  }
  const s = await getSuscriptorByToken(String(formData.get('token') ?? ''));
  if (!s) return { status: 'error', message: 'Este enlace no es válido. Revisa el último correo.' };
  await execute(
    activate
      ? 'UPDATE suscriptores SET activo = 1, confirmado_en = COALESCE(confirmado_en, NOW()), baja_en = NULL WHERE id = ?'
      : 'UPDATE suscriptores SET activo = 0, baja_en = NOW() WHERE id = ?',
    [s.id],
  );
  revalidatePath(`/agenda/${s.token}`);
  revalidatePath('/admin/agenda');
  return {
    status: 'success',
    message: activate
      ? '¡Listo! Recibirás la agenda cada semana.'
      : 'Listo, ya no recibirás la agenda. Puedes volver cuando quieras.',
  };
}

export async function confirmarSuscripcion(_prev: FormState, formData: FormData) {
  return changeSubscription(formData, true);
}

export async function darseDeBaja(_prev: FormState, formData: FormData) {
  return changeSubscription(formData, false);
}

const SEND_CONCURRENCY = 4;

/**
 * Envía la agenda a todos los suscriptores activos, cada uno con su enlace de baja. Se envía en
 * paralelo de a 4 para no saturar el SMTP de Hostinger (que limita envíos por hora).
 */
export async function enviarAgenda(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = envioSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos marcados en rojo.',
      fieldErrors: fieldErrorsOf(parsed.error),
    };
  }
  const subs = await listActiveSuscriptores();
  if (subs.length === 0)
    return { status: 'error', message: 'Todavía no hay suscriptores confirmados.' };
  const body = await buildAgendaText(parsed.data.intro);

  let sent = 0;
  let failed = 0;
  let missingSmtp = false;
  const queue = [...subs];
  await Promise.all(
    Array.from({ length: SEND_CONCURRENCY }, async () => {
      for (let s = queue.shift(); s && !missingSmtp; s = queue.shift()) {
        const result = await sendMail({
          to: s.email,
          subject: parsed.data.asunto,
          text: `${s.nombre ? `Hola ${s.nombre}:\n\n` : ''}${body}\n\n—\nPara dejar de recibir la agenda: ${agendaUrl(s.token)}`,
          unsubscribeUrl: agendaUrl(s.token),
        });
        if (result.sent) sent++;
        else if (result.reason === 'sin-smtp') missingSmtp = true;
        else failed++;
      }
    }),
  );
  if (missingSmtp) {
    return {
      status: 'error',
      message:
        'No se envió nada: falta configurar el correo del sitio (SMTP_HOST, SMTP_USER y SMTP_PASS en Hostinger). Avisa a Pixelia.',
    };
  }
  await execute(
    'INSERT INTO envios_agenda (asunto, enviados, fallidos, enviado_por) VALUES (?, ?, ?, ?)',
    [parsed.data.asunto, sent, failed, admin.id],
  );
  revalidatePath('/admin/agenda');
  return failed > 0
    ? {
        status: 'error',
        message: `Se envió a ${sent} ${sent === 1 ? 'persona' : 'personas'}, pero falló con ${failed}. Revisa el registro del servidor o intenta más tarde.`,
      }
    : {
        status: 'success',
        message: `Agenda enviada a ${sent} ${sent === 1 ? 'persona' : 'personas'}.`,
      };
}

/** Borra a un suscriptor (cuando pide que borremos su correo): solo administradores. */
export async function deleteSuscriptor(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin({ role: 'admin' });
  const parsed = idSchema.safeParse(formData.get('id'));
  if (!parsed.success) return { status: 'error', message: 'No encontramos este suscriptor.' };
  const { affectedRows } = await execute('DELETE FROM suscriptores WHERE id = ?', [parsed.data]);
  if (affectedRows === 0)
    return { status: 'error', message: 'Ya fue eliminado. Recarga la página.' };
  revalidatePath('/admin/agenda');
  return { status: 'success', message: 'Suscriptor eliminado.' };
}
