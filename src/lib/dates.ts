import { TIME_ZONE } from '@/lib/site';

/**
 * Fechas del proyecto:
 * - DATETIME (UTC en la BD) llega como Date → se muestra en hora de Ecuador con formatDateTime().
 * - DATE (sin hora) llega como 'YYYY-MM-DD' → se muestra tal cual con formatDateOnly().
 */

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** '2026-09-27' → «27 de septiembre de 2026». Sin conversión de zona horaria. */
export function formatDateOnly(
  value: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'long' },
): string {
  const match = DATE_ONLY.exec(value);
  if (!match) return value;
  const [, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  return new Intl.DateTimeFormat('es-EC', { ...options, timeZone: 'UTC' }).format(date);
}

/** Instante UTC → fecha y hora en America/Guayaquil. */
export function formatDateTime(
  value: Date,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'long', timeStyle: 'short' },
): string {
  return new Intl.DateTimeFormat('es-EC', { ...options, timeZone: TIME_ZONE }).format(value);
}

/** Fecha de hoy en Ecuador como 'YYYY-MM-DD' (para columnas DATE). */
export function todayInChurchTz(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}
