'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { execute, queryOne } from '@/lib/db';
import type { FormState } from '@/lib/form-state';
import {
  getMemberSession,
  hashAccessCode,
  isKnownPhone,
  newAccessCode,
  sameHash,
} from '@/lib/miembro';
import { guardPublicForm } from '@/lib/public-form';
import { consumeRateLimit, minutesText } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/request';
import { fieldErrorsOf, requiredPhone } from '@/lib/validators/common';
import { isWhatsAppConfigured, sendWhatsAppTemplate } from '@/lib/whatsapp-cloud';

const CODE_TTL_MINUTES = 10;
const MAX_TRIES = 5;

const SENT =
  'Si tu número está registrado en la iglesia, te llegó un código por WhatsApp. Escríbelo abajo.';

/**
 * Paso 1: pedir el código. La respuesta es la misma si el número no está registrado (no revela
 * quién es de la iglesia) y solo se envía a números conocidos (nadie usa el sitio para mandar
 * mensajes a números ajenos). Límites: por IP y 3 códigos por número cada 10 min.
 */
export async function solicitarCodigo(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = String(formData.get('telefono') ?? '');
  const parsed = z.object({ telefono: requiredPhone }).safeParse({ telefono: raw });
  if (!parsed.success) {
    return {
      status: 'error',
      fieldErrors: fieldErrorsOf(parsed.error),
      values: { telefono: raw },
    };
  }
  if (!isWhatsAppConfigured('WHATSAPP_TEMPLATE_CODIGO')) {
    return {
      status: 'error',
      message:
        'Todavía no podemos enviar códigos por WhatsApp. Mientras tanto, escríbenos y te ayudamos.',
      values: { telefono: raw },
    };
  }
  const guard = await guardPublicForm(formData, 'codigo_ip', SENT);
  if (!guard.ok) return { ...guard.state, values: { telefono: raw } };
  const { telefono } = parsed.data;
  const perPhone = await consumeRateLimit('codigo_telefono', { account: telefono }, { max: 3 });
  if (perPhone.blocked) {
    return {
      status: 'error',
      message: `Ya enviamos varios códigos a ese número. Espera ${minutesText(perPhone.retryAfterMinutes)} y vuelve a intentar.`,
      values: { telefono: raw },
    };
  }

  if (await isKnownPhone(telefono)) {
    const code = newAccessCode();
    // Un solo código vigente por número: el anterior deja de servir.
    await execute('UPDATE codigos_acceso SET usado = 1 WHERE telefono = ? AND usado = 0', [
      telefono,
    ]);
    await execute(
      `INSERT INTO codigos_acceso (telefono, codigo_hash, expira_en, ip)
       VALUES (?, ?, NOW() + INTERVAL ? MINUTE, INET6_ATON(?))`,
      [telefono, hashAccessCode(telefono, code), CODE_TTL_MINUTES, guard.ip],
    );
    const sent = await sendWhatsAppTemplate({
      to: telefono,
      template: 'WHATSAPP_TEMPLATE_CODIGO',
      params: [code],
      buttonCode: code,
    });
    if (!sent.sent) {
      return {
        status: 'error',
        message: 'No pudimos enviar el código por WhatsApp. Intenta de nuevo en unos minutos.',
        values: { telefono: raw },
      };
    }
  }
  return { status: 'success', message: SENT, values: { telefono } };
}

/** Paso 2: comprobar el código (5 intentos por código, vence a los 10 min) y abrir la sesión. */
export async function verificarCodigo(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = z
    .object({
      telefono: requiredPhone,
      codigo: z
        .string()
        .trim()
        .regex(/^\d{6}$/, { error: 'El código tiene 6 números, ej. 482913.' }),
    })
    .safeParse({ telefono: formData.get('telefono'), codigo: formData.get('codigo') });
  if (!parsed.success) return { status: 'error', fieldErrors: fieldErrorsOf(parsed.error) };
  const limit = await consumeRateLimit(
    'codigo_verificar',
    { ip: await getClientIp() },
    { max: 15 },
  );
  if (limit.blocked) {
    return {
      status: 'error',
      message: `Demasiados intentos. Espera ${minutesText(limit.retryAfterMinutes)} y pide un código nuevo.`,
    };
  }
  const { telefono, codigo } = parsed.data;
  const row = await queryOne<{ id: number; codigo_hash: string; intentos: number }>(
    `SELECT id, codigo_hash, intentos FROM codigos_acceso
      WHERE telefono = ? AND usado = 0 AND expira_en > NOW()
      ORDER BY id DESC LIMIT 1`,
    [telefono],
  );
  if (!row || row.intentos >= MAX_TRIES) {
    return {
      status: 'error',
      message: 'El código venció o ya no sirve. Pide uno nuevo.',
    };
  }
  if (!sameHash(row.codigo_hash, hashAccessCode(telefono, codigo))) {
    await execute('UPDATE codigos_acceso SET intentos = intentos + 1 WHERE id = ?', [row.id]);
    const left = MAX_TRIES - row.intentos - 1;
    return {
      status: 'error',
      fieldErrors: {
        codigo: [
          left > 0
            ? `Ese código no coincide. Te ${left === 1 ? 'queda 1 intento' : `quedan ${left} intentos`}.`
            : 'Ese código no coincide y ya no quedan intentos. Pide uno nuevo.',
        ],
      },
    };
  }
  const { affectedRows } = await execute(
    'UPDATE codigos_acceso SET usado = 1 WHERE id = ? AND usado = 0',
    [row.id],
  );
  if (affectedRows !== 1)
    return { status: 'error', message: 'Ese código ya se usó. Pide uno nuevo.' };
  const session = await getMemberSession();
  session.telefono = telefono;
  await session.save();
  redirect('/mi-cuenta');
}

export async function salirMiembro(): Promise<void> {
  const session = await getMemberSession();
  session.destroy();
  redirect('/mi-cuenta');
}
