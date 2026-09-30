import 'server-only';
import { createHash } from 'node:crypto';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { execute, getPool } from '@/lib/db';
import { rateLimitIp } from '@/lib/ip';

/**
 * Límite de envíos sobre la tabla rate_limits (por defecto 5 cada 10 minutos).
 *
 * Se RESERVA el intento antes de hacer el trabajo caro, con un candado por clave (GET_LOCK):
 * las peticiones simultáneas pasan exactamente hasta el tope. La clave se guarda como 16 bytes de
 * SHA-256, sirve igual para IPs y cuentas y no deja IPs en claro en la BD.
 */
export type RateLimitForm =
  | 'soy_nuevo'
  | 'oracion'
  | 'contacto'
  | 'unirme_grupo'
  | 'login_ip'
  | 'login_cuenta'
  | 'login_dispositivo'
  | 'cambio_clave'
  | 'inscripcion'
  | 'inscripcion_cancelar'
  | 'servir'
  | 'agenda'
  | 'agenda_baja';

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
  const raw =
    'ip' in subject ? `ip:${rateLimitIp(subject.ip)}` : `cuenta:${subject.account.toLowerCase()}`;
  return createHash('sha256').update(raw).digest().subarray(0, 16);
}

export async function reserveAttempt(
  form: RateLimitForm,
  subject: RateLimitSubject,
  { max = 5, windowMinutes = 10 }: RateLimitOptions = {},
): Promise<RateLimitReservation> {
  const key = subjectKey(subject);
  // Candado con nombre por (formulario, clave): contar e insertar pasa de a una petición, así el
  // tope es exacto aunque lleguen muchas a la vez (sin carreras y sin bloquear de más).
  const lockName = `ibr_rl:${form}:${key.toString('hex')}`;
  const connection = await getPool().getConnection();
  let insertId: number;
  try {
    const [[lock]] = await connection.query<RowDataPacket[]>('SELECT GET_LOCK(?, 5) AS ok', [
      lockName,
    ]);
    if (Number(lock?.ok) !== 1) throw new Error(`No se obtuvo el candado ${lockName} a tiempo.`);
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        `SELECT TIMESTAMPDIFF(SECOND, NOW(), creado_en + INTERVAL ? MINUTE) AS segundos
           FROM rate_limits
          WHERE ip = ? AND formulario = ? AND creado_en > NOW() - INTERVAL ? MINUTE
          ORDER BY creado_en, id`,
        [windowMinutes, key, form, windowMinutes],
      );
      if (rows.length >= max) {
        // Se libera un cupo cuando vence la fila en la posición (total - max) por antigüedad.
        const seconds = Number(rows[rows.length - max]?.segundos ?? windowMinutes * 60);
        return {
          blocked: true,
          retryAfterMinutes: Math.max(1, Math.ceil(seconds / 60)),
          release: noop,
        };
      }
      const [result] = await connection.query<ResultSetHeader>(
        'INSERT INTO rate_limits (ip, formulario) VALUES (?, ?)',
        [key, form],
      );
      insertId = result.insertId;
    } finally {
      await connection.query('SELECT RELEASE_LOCK(?)', [lockName]);
    }
  } finally {
    connection.release();
  }

  // Limpieza acotada (ESQUEMA.sql): nada de más de un día.
  await execute('DELETE FROM rate_limits WHERE creado_en < NOW() - INTERVAL 1 DAY LIMIT 500');
  return {
    blocked: false,
    retryAfterMinutes: 0,
    release: async () => {
      await execute('DELETE FROM rate_limits WHERE id = ?', [insertId]);
    },
  };
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
