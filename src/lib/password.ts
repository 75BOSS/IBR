import { compare, hash } from 'bcryptjs';

/** Costo bcrypt fijado en CLAUDE.md. */
export const BCRYPT_COST = 12;
const MIN_LENGTH = 12;
const MAX_BYTES = 72; // bcrypt ignora lo que pase de 72 bytes

/**
 * Hash de relleno (de una clave aleatoria descartada): cuando el correo no existe se compara
 * contra él para que la respuesta tarde lo mismo y no revele qué correos están registrados.
 */
const DUMMY_HASH = '$2b$12$xucd3kQP3GoN4vJYRU1IGu/w3awmGn1vv2lLIBbPddu/Ra4PBqkRi';

export function hashPassword(plain: string): Promise<string> {
  return hash(plain, BCRYPT_COST);
}

export function verifyPassword(plain: string, passwordHash: string | null): Promise<boolean> {
  return compare(plain, passwordHash ?? DUMMY_HASH);
}

/** null si la contraseña sirve; si no, qué falta y cómo arreglarlo. */
export function passwordProblem(plain: string): string | null {
  if (plain.length < MIN_LENGTH) {
    return `La contraseña debe tener al menos ${MIN_LENGTH} caracteres. Una frase corta funciona bien.`;
  }
  if (Buffer.byteLength(plain, 'utf8') > MAX_BYTES) {
    return `La contraseña es demasiado larga (máximo ${MAX_BYTES} bytes). Usa una más corta.`;
  }
  return null;
}
