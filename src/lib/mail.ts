import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';
import { readEnv } from '@/lib/env';

let transporter: Transporter | null | undefined;

function getTransporter(): Transporter | null {
  if (transporter !== undefined) return transporter;
  const host = readEnv('SMTP_HOST');
  const user = readEnv('SMTP_USER');
  const pass = readEnv('SMTP_PASS');
  if (!host || !user || !pass) {
    transporter = null;
    return transporter;
  }
  const port = Number(readEnv('SMTP_PORT') ?? 465);
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporter;
}

export type MailResult =
  { sent: true } | { sent: false; reason: 'sin-smtp' | 'sin-destinatario' | 'error' };

/**
 * Envía un aviso por correo. Un aviso nunca debe hacer perder lo que la persona envió: el dato
 * ya se guardó en la BD antes de llamar aquí. Si falta configurar SMTP o falla el envío, se
 * registra en el log y se devuelve el motivo (el panel igual muestra el registro).
 */
export async function sendMail(message: {
  to: string | null | undefined;
  subject: string;
  text: string;
  replyTo?: string | null;
}): Promise<MailResult> {
  if (!message.to) {
    console.warn(
      `[correo] "${message.subject}": no hay destinatario configurado (config.email_avisos).`,
    );
    return { sent: false, reason: 'sin-destinatario' };
  }
  const smtp = getTransporter();
  if (!smtp) {
    console.warn(`[correo] "${message.subject}": falta configurar SMTP_HOST/SMTP_USER/SMTP_PASS.`);
    return { sent: false, reason: 'sin-smtp' };
  }
  try {
    await smtp.sendMail({
      from: readEnv('SMTP_FROM') ?? readEnv('SMTP_USER'),
      to: message.to,
      subject: message.subject,
      text: message.text,
      replyTo: message.replyTo ?? undefined,
    });
    return { sent: true };
  } catch (error) {
    console.error(`[correo] no se pudo enviar "${message.subject}":`, error);
    return { sent: false, reason: 'error' };
  }
}
