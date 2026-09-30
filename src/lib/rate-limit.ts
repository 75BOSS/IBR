import 'server-only';
import { createHash } from 'node:crypto';
import { execute, queryOne } from '@/lib/db';

/**
 * Límite de envíos sobre la tabla rate_limits (por defecto 5 cada 10 minutos).
 * La clave se guarda como 16 bytes de SHA-256: sirve igual para IPs y para cuentas
 * (login) y no deja IPs en claro en la BD.
 */
export type RateLimitForm =
  'soy_nuevo' | 'oracion' | 'contacto' | 'unirme_grupo' | 'login_ip' | 'login_cuenta';

export type RateLimitSubject = { ip: string } | { account: string };
export type RateLimitOptions = { max?: number; windowMinutes?: number };
export type RateLimitStatus = { blocked: boolean; retryAfterMinutes: number };

function subjectKey(subject: RateLimitSubject): Buffer {
  const raw = 'ip' in subject ? `ip:${subject.ip}` : `cuenta:${subject.account.toLowerCase()}`;
  return createHash('sha256').update(raw).digest().subarray(0, 16);
}

export async function rateLimitStatus(
  form: RateLimitForm,
  subject: RateLimitSubject,
  { max = 5, windowMinutes = 10 }: RateLimitOptions = {},
): Promise<RateLimitStatus> {
  const row = await queryOne<{ total: number; minutosDesdePrimero: number | null }>(
    `SELECT COUNT(*) AS total, TIMESTAMPDIFF(SECOND, MIN(creado_en), NOW()) / 60 AS minutosDesdePrimero
       FROM rate_limits
      WHERE ip = ? AND formulario = ? AND creado_en > NOW() - INTERVAL ? MINUTE`,
    [subjectKey(subject), form, windowMinutes],
  );
  const total = Number(row?.total ?? 0);
  if (total < max) return { blocked: false, retryAfterMinutes: 0 };
  const elapsed = Number(row?.minutosDesdePrimero ?? 0);
  return { blocked: true, retryAfterMinutes: Math.max(1, Math.ceil(windowMinutes - elapsed)) };
}

export async function recordAttempt(form: RateLimitForm, subject: RateLimitSubject): Promise<void> {
  await execute('INSERT INTO rate_limits (ip, formulario) VALUES (?, ?)', [
    subjectKey(subject),
    form,
  ]);
  // Limpieza acotada al insertar (ESQUEMA.sql): nada de más de un día.
  await execute('DELETE FROM rate_limits WHERE creado_en < NOW() - INTERVAL 1 DAY LIMIT 500');
}

/** Para formularios públicos: si no está bloqueado, cuenta este envío. */
export async function consumeRateLimit(
  form: RateLimitForm,
  subject: RateLimitSubject,
  options?: RateLimitOptions,
): Promise<RateLimitStatus> {
  const status = await rateLimitStatus(form, subject, options);
  if (!status.blocked) await recordAttempt(form, subject);
  return status;
}

export function minutesText(minutes: number): string {
  return minutes === 1 ? '1 minuto' : `${minutes} minutos`;
}
