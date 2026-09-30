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
 * ráfaga de intentos no deje sin respuesta al único proceso del sitio. Las demás esperan en
 * fila (hasta WAIT_MS); los dispositivos conocidos pasan adelante para que un ataque no deje
 * afuera al admin en su compu de siempre.
 */
const MAX_CONCURRENT_COMPARES = 3;
const MAX_WAITING = 50;
const WAIT_MS = 10_000;
let runningCompares = 0;
const waiting: Array<() => void> = [];

export class PasswordCheckBusyError extends Error {
  constructor() {
    super('Hay demasiadas verificaciones de contraseña en curso.');
    this.name = 'PasswordCheckBusyError';
  }
}

function acquireSlot(priority: boolean): Promise<boolean> {
  if (runningCompares < MAX_CONCURRENT_COMPARES) {
    runningCompares += 1;
    return Promise.resolve(true);
  }
  if (waiting.length >= MAX_WAITING) return Promise.resolve(false);
  return new Promise((resolve) => {
    const grant = () => {
      clearTimeout(timer);
      runningCompares += 1;
      resolve(true);
    };
    const timer = setTimeout(() => {
      const index = waiting.indexOf(grant);
      if (index >= 0) waiting.splice(index, 1);
      resolve(false);
    }, WAIT_MS);
    if (priority) waiting.unshift(grant);
    else waiting.push(grant);
  });
}

function releaseSlot(): void {
  runningCompares -= 1;
  waiting.shift()?.();
}

/**
 * Compara contra el hash (o contra el de relleno si el correo no existe). Lanza
 * PasswordCheckBusyError si no consigue turno a tiempo.
 */
export async function verifyPassword(
  plain: string,
  passwordHash: string | null,
  { priority = false }: { priority?: boolean } = {},
): Promise<boolean> {
  if (!(await acquireSlot(priority))) throw new PasswordCheckBusyError();
  try {
    return await compare(plain, passwordHash ?? DUMMY_HASH);
  } finally {
    releaseSlot();
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
