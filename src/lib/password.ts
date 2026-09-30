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

/**
 * bcrypt cuesta ~0,4 s de CPU. Se limita cuántas comparaciones corren a la vez para que una
 * ráfaga de intentos no deje sin respuesta al único proceso del sitio.
 */
const MAX_CONCURRENT_COMPARES = 3;
let runningCompares = 0;

export class PasswordCheckBusyError extends Error {
  constructor() {
    super('Hay demasiadas verificaciones de contraseña en curso.');
    this.name = 'PasswordCheckBusyError';
  }
}

/** Compara contra el hash (o contra el de relleno si el correo no existe). */
export async function verifyPassword(plain: string, passwordHash: string | null): Promise<boolean> {
  if (runningCompares >= MAX_CONCURRENT_COMPARES) throw new PasswordCheckBusyError();
  runningCompares += 1;
  try {
    return await compare(plain, passwordHash ?? DUMMY_HASH);
  } finally {
    runningCompares -= 1;
  }
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
