import type { SessionOptions } from 'iron-session';
import { requireEnv } from '@/lib/env';

/**
 * Cookies del panel. Sin dependencias de Node ni de la BD: las usa también el middleware.
 */
export type AdminSession = {
  userId: number;
  /** usuarios_admin.sesion_version al iniciar sesión; si cambió, la cookie deja de valer. */
  version: number;
};

/** Dispositivo donde ya se inició sesión con éxito (patrón «device cookie» de OWASP). */
export type TrustedDevice = {
  /** Id aleatorio del dispositivo: sus intentos fallidos tienen su propio límite. */
  id: string;
  /** Correos que entraron bien desde este navegador (máx. 5, el más reciente primero). */
  emails: string[];
};

/** Sesión de un miembro en /mi-cuenta (entró con su WhatsApp y un código). */
export type MemberSession = {
  /** WhatsApp verificado, en formato local (0991234567), igual que en las tablas. */
  telefono: string;
};

export const SESSION_COOKIE = 'ibr_admin';
/** 12 horas: un voluntario publica en una sentada; en compus compartidas la sesión caduca sola. */
export const SESSION_TTL_SECONDS = 12 * 60 * 60;
export const DEVICE_COOKIE = 'ibr_dispositivo';
export const DEVICE_TTL_SECONDS = 180 * 24 * 60 * 60;
export const MEMBER_COOKIE = 'ibr_miembro';
/** 30 días: la persona consulta de vez en cuando desde su propio celular. */
export const MEMBER_TTL_SECONDS = 30 * 24 * 60 * 60;

function secret(): string {
  const password = requireEnv('SESSION_SECRET');
  if (password.length < 32) {
    throw new Error(
      'SESSION_SECRET debe tener al menos 32 caracteres. Genera uno nuevo (ver .env.example) ' +
        'y cárgalo en hPanel → Web app → Variables de entorno.',
    );
  }
  return password;
}

function cookieOptions(cookieName: string, ttl: number): SessionOptions {
  return {
    cookieName,
    password: secret(),
    ttl,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    },
    onUnsealError: (reason) => {
      // "expired" es el fin normal de una cookie; lo demás puede ser una clave rotada o manipulación.
      if (reason !== 'expired') console.warn(`[sesión] cookie ${cookieName} rechazada: ${reason}`);
    },
  };
}

export function sessionOptions(): SessionOptions {
  return cookieOptions(SESSION_COOKIE, SESSION_TTL_SECONDS);
}

export function deviceOptions(): SessionOptions {
  return cookieOptions(DEVICE_COOKIE, DEVICE_TTL_SECONDS);
}

export function memberOptions(): SessionOptions {
  return cookieOptions(MEMBER_COOKIE, MEMBER_TTL_SECONDS);
}
