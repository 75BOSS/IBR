import type { SessionOptions } from 'iron-session';
import { requireEnv } from '@/lib/env';

/**
 * Configuración de la cookie de sesión del admin. Sin dependencias de Node ni de la BD:
 * la usan tanto el middleware como el servidor.
 */
export type AdminSession = {
  userId: number;
  /** Date.now() al iniciar sesión (iron-session v9 guarda timestamps, no Date). */
  issuedAt: number;
};

export const SESSION_COOKIE = 'ibr_admin';
/** 12 horas: un voluntario publica en una sentada; en compus compartidas la sesión caduca sola. */
export const SESSION_TTL_SECONDS = 12 * 60 * 60;

export function sessionOptions(): SessionOptions {
  const password = requireEnv('SESSION_SECRET');
  if (password.length < 32) {
    throw new Error(
      'SESSION_SECRET debe tener al menos 32 caracteres. Genera uno nuevo (ver .env.example) ' +
        'y cárgalo en hPanel → Web app → Variables de entorno.',
    );
  }
  return {
    cookieName: SESSION_COOKIE,
    password,
    ttl: SESSION_TTL_SECONDS,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    },
    onUnsealError: (reason) => {
      // "expired" es el fin normal de una sesión; lo demás puede ser una clave rotada o manipulación.
      if (reason !== 'expired') console.warn(`[sesión] cookie rechazada: ${reason}`);
    },
  };
}
