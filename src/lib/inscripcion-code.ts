import { randomInt } from 'node:crypto';

/** Sin letras ni números que se confunden al dictarlos o leerlos (0/O, 1/I/L). */
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** Código de 8 caracteres (~40 bits) que identifica la inscripción ante la persona. */
export function newInscripcionCode(): string {
  return Array.from({ length: 8 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join('');
}

/** Normaliza lo que escribe la persona (minúsculas, espacios, guiones) antes de buscar. */
export function normalizeCode(raw: string): string | null {
  const code = raw.toUpperCase().replace(/[\s-]/g, '');
  return new RegExp(`^[${CODE_ALPHABET}]{8}$`).test(code) ? code : null;
}

/**
 * Código a partir de lo que lee el escáner: el QR trae el enlace …/inscripcion/CODIGO, pero
 * también se acepta el código escrito a mano.
 */
export function codeFromScan(raw: string): string | null {
  const text = raw.trim();
  const fromUrl = /\/inscripcion\/([^/?#\s]+)/.exec(text)?.[1];
  return normalizeCode(fromUrl ?? text);
}
