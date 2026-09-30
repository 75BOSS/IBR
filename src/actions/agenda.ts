'use server';

import { revalidatePath } from 'next/cache';
import { after } from 'next/server';
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
import { isMailConfigured, sendMail } from '@/lib/mail';
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

  // Máximo 2 correos de confirmación por hora a la misma dirección (aunque cambie la IP):
  // nadie puede usar el formulario para llenar el buzón de otra persona.
  const perEmail = await consumeRateLimit(
    'agenda_correo',
    { account: d.email },
    { max: 2, windowMinutes: 60 },
  );
  // Alta atómica: dos envíos simultáneos del mismo correo no chocan con la clave única. Cada
  // «acepto» renueva la fecha del consentimiento junto con la IP.
  await execute(
    `INSERT INTO suscriptores (email, nombre, token, activo, acepta_datos, consentimiento_en, ip)
     VALUES (?, ?, ?, 0, 1, NOW(), INET6_ATON(?))
     ON DUPLICATE KEY UPDATE nombre = COALESCE(VALUES(nombre), nombre), acepta_datos = 1,
                             consentimiento_en = NOW(), ip = VALUES(ip)`,
    [d.email, d.nombre, newSubscriberToken(), guard.ip],
  );
  const row = await queryOne<{ token: string; activo: boolean }>(
    'SELECT token, activo FROM suscriptores WHERE email = ?',
    [d.email],
  );
  // El correo sale después de responder: la respuesta tarda lo mismo esté o no suscrito.
  if (row && !row.activo && !perEmail.blocked) {
    after(() => sendConfirmation(d.email, d.nombre, row.token));
  }
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
      ? 'UPDATE suscriptores SET activo = 1, confirmado_en = NOW(), consentimiento_en = NOW(), baja_en = NULL WHERE id = ?'
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
 * Envía un envío ya registrado a los destinatarios dados (de a 4 en paralelo para no saturar
 * el SMTP de Hostinger) y marca a quién le llegó, para poder reintentar solo con los demás.
 */
async function deliver(
  envio: { id: number; asunto: string; cuerpo: string },
  recipients: Awaited<ReturnType<typeof listActiveSuscriptores>>,
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;
  const queue = [...recipients];
  await Promise.all(
    Array.from({ length: SEND_CONCURRENCY }, async () => {
      for (let s = queue.shift(); s; s = queue.shift()) {
        const result = await sendMail({
          to: s.email,
          subject: envio.asunto,
          text: `${s.nombre ? `Hola ${s.nombre}:\n\n` : ''}${envio.cuerpo}\n\n—\nPara dejar de recibir la agenda: ${agendaUrl(s.token)}`,
          unsubscribeUrl: agendaUrl(s.token),
        });
        if (result.sent) {
          sent++;
          await execute('UPDATE suscriptores SET ultimo_envio_id = ? WHERE token = ?', [
            envio.id,
            s.token,
          ]);
        } else failed++;
      }
    }),
  );
  return { sent, failed };
}

const MISSING_SMTP: FormState = {
  status: 'error',
  message:
    'No se envió nada: falta configurar el correo del sitio (SMTP_HOST, SMTP_USER y SMTP_PASS en Hostinger). Avisa a Pixelia.',
};

function deliveryResult(sent: number, failed: number): FormState {
  const people = (n: number) => `${n} ${n === 1 ? 'persona' : 'personas'}`;
  return failed > 0
    ? {
        status: 'error',
        message: `Llegó a ${people(sent)}, pero falló con ${failed}. Usa «Reintentar con los que faltan» en Últimos envíos: no se repite a quienes ya lo recibieron.`,
      }
    : { status: 'success', message: `Agenda enviada a ${people(sent)}.` };
}

/** Envía la agenda a todos los suscriptores activos, cada uno con su enlace de baja. */
export async function enviarAgenda(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = envioSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    // El diálogo de confirmación muestra el mensaje general, así que va el problema concreto.
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Revisa el asunto.' };
  }
  if (!isMailConfigured()) return MISSING_SMTP;
  const recipients = await listActiveSuscriptores();
  if (recipients.length === 0)
    return { status: 'error', message: 'Todavía no hay suscriptores confirmados.' };
  const cuerpo = await buildAgendaText(parsed.data.intro);
  const { insertId } = await execute(
    'INSERT INTO envios_agenda (asunto, cuerpo, enviado_por) VALUES (?, ?, ?)',
    [parsed.data.asunto, cuerpo, admin.id],
  );
  const { sent, failed } = await deliver(
    { id: insertId, asunto: parsed.data.asunto, cuerpo },
    recipients,
  );
  await execute('UPDATE envios_agenda SET enviados = ?, fallidos = ? WHERE id = ?', [
    sent,
    failed,
    insertId,
  ]);
  revalidatePath('/admin/agenda');
  return deliveryResult(sent, failed);
}

/** Reenvía el mismo envío solo a los suscriptores activos que todavía no lo recibieron. */
export async function reintentarEnvio(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(formData.get('id'));
  if (!parsed.success) return { status: 'error', message: 'No encontramos este envío.' };
  if (!isMailConfigured()) return MISSING_SMTP;
  const envio = await queryOne<{
    id: number;
    asunto: string;
    cuerpo: string | null;
    enviados: number;
  }>('SELECT id, asunto, cuerpo, enviados FROM envios_agenda WHERE id = ?', [parsed.data]);
  if (!envio?.cuerpo) return { status: 'error', message: 'Este envío no se puede reintentar.' };
  const pending = await listActiveSuscriptores({ pendingForEnvio: envio.id });
  if (pending.length === 0)
    return { status: 'success', message: 'Ya les llegó a todos. No hay nada que reintentar.' };
  const { sent, failed } = await deliver({ ...envio, cuerpo: envio.cuerpo }, pending);
  await execute('UPDATE envios_agenda SET enviados = enviados + ?, fallidos = ? WHERE id = ?', [
    sent,
    failed,
    envio.id,
  ]);
  revalidatePath('/admin/agenda');
  return deliveryResult(sent, failed);
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
