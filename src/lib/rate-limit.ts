import 'server-only';
import { createHash } from 'node:crypto';
import { execute, queryOne } from '@/lib/db';

/**
 * Límite de envíos sobre la tabla rate_limits (por defecto 5 cada 10 minutos).
 *
 * Se RESERVA el intento antes de hacer el trabajo caro (insertar y después contar): así las
 * peticiones simultáneas no pueden pasar todas a la vez. La clave se guarda como 16 bytes de
 * SHA-256, sirve igual para IPs y cuentas y no deja IPs en claro en la BD.
 */
export type RateLimitForm =
  'soy_nuevo' | 'oracion' | 'contacto' | 'unirme_grupo' | 'login_ip' | 'login_cuenta';

export type RateLimitSubject = { ip: string } | { account: string };
export type RateLimitOptions = { max?: number; windowMinutes?: number };

export type RateLimitReservation = {
  blocked: boolean;
  /** Minutos hasta que se libere un cupo (0 si no está bloqueado). */
  retryAfterMinutes: number;
  /** Anula la reserva: el intento no cuenta (login correcto, o no se llegó a intentar). */
  release: () => Promise<void>;
};

const noop = async () => {};

function subjectKey(subject: RateLimitSubject): Buffer {
  const raw = 'ip' in subject ? `ip:${subject.ip}` : `cuenta:${subject.account.toLowerCase()}`;
  return createHash('sha256').update(raw).digest().subarray(0, 16);
}

export async function reserveAttempt(
  form: RateLimitForm,
  subject: RateLimitSubject,
  { max = 5, windowMinutes = 10 }: RateLimitOptions = {},
): Promise<RateLimitReservation> {
  const key = subjectKey(subject);
  const { insertId } = await execute('INSERT INTO rate_limits (ip, formulario) VALUES (?, ?)', [
    key,
    form,
  ]);
  const release = async () => {
    await execute('DELETE FROM rate_limits WHERE id = ?', [insertId]);
  };

  // Cuenta esta reserva y todas las anteriores dentro de la ventana.
  const row = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM rate_limits
      WHERE ip = ? AND formulario = ? AND creado_en > NOW() - INTERVAL ? MINUTE AND id <= ?`,
    [key, form, windowMinutes, insertId],
  );
  const total = Number(row?.total ?? 0);

  if (total <= max) {
    // Limpieza acotada (ESQUEMA.sql): nada de más de un día.
    await execute('DELETE FROM rate_limits WHERE creado_en < NOW() - INTERVAL 1 DAY LIMIT 500');
    return { blocked: false, retryAfterMinutes: 0, release };
  }

  // Bloqueado: la reserva se anula para que insistir no alargue la espera.
  await release();
  // Se libera un cupo cuando vence la fila en la posición (previas - max) por antigüedad.
  const previous = total - 1;
  const expiry = await queryOne<{ segundos: number }>(
    `SELECT TIMESTAMPDIFF(SECOND, NOW(), creado_en + INTERVAL ? MINUTE) AS segundos
       FROM rate_limits
      WHERE ip = ? AND formulario = ? AND creado_en > NOW() - INTERVAL ? MINUTE AND id < ?
      ORDER BY creado_en, id
      LIMIT 1 OFFSET ?`,
    [windowMinutes, key, form, windowMinutes, insertId, previous - max],
  );
  const seconds = Number(expiry?.segundos ?? windowMinutes * 60);
  return { blocked: true, retryAfterMinutes: Math.max(1, Math.ceil(seconds / 60)), release: noop };
}

/** Para formularios públicos: la reserva queda como registro del envío. */
export async function consumeRateLimit(
  form: RateLimitForm,
  subject: RateLimitSubject,
  options?: RateLimitOptions,
): Promise<{ blocked: boolean; retryAfterMinutes: number }> {
  const { blocked, retryAfterMinutes } = await reserveAttempt(form, subject, options);
  return { blocked, retryAfterMinutes };
}

export function minutesText(minutes: number): string {
  return minutes === 1 ? '1 minuto' : `${minutes} minutos`;
}
