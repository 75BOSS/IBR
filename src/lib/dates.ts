import { TIME_ZONE } from '@/lib/site';

/**
 * Fechas del proyecto:
 * - DATETIME (UTC en la BD) llega como Date → se muestra en hora de Ecuador con formatDateTime().
 * - DATE (sin hora) llega como 'YYYY-MM-DD' → se muestra tal cual con formatDateOnly().
 */

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Texto para una fecha vacía o imposible (ej. '0000-00-00' del sistema PHP heredado). */
export const NO_DATE = '—';

/**
 * '2026-09-27' → «27 de septiembre de 2026». Sin conversión de zona horaria. Fechas cero o
 * imposibles (mes 13, 30 de febrero, año < 1000) devuelven NO_DATE en vez de otra fecha.
 */
export function formatDateOnly(
  value: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'long' },
): string {
  const match = DATE_ONLY.exec(value);
  if (!match) return value;
  const [year, month, day] = match.slice(1).map(Number) as [number, number, number];
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day); // setUTCFullYear no reinterpreta años 0–99
  const valid =
    year >= 1000 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
  if (!valid) return NO_DATE;
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

/** 1 = lunes … 7 = domingo (como en la BD). */
export const DAY_NAMES = [
  '',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
] as const;

export const DAY_OPTIONS = DAY_NAMES.slice(1).map((label, index) => ({
  value: String(index + 1),
  label,
}));

/** TIME de MySQL ('19:30:00') → '19:30'. */
export function formatTime(value: string | null | undefined): string {
  return value ? value.slice(0, 5) : '';
}

/** Date UTC → valor para <input type="datetime-local"> en hora de Ecuador. */
export function toLocalInputValue(value: Date | null | undefined): string {
  if (!value) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(value);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

/**
 * Valor de <input type="datetime-local"> escrito en hora de Ecuador (UTC−5, sin horario de
 * verano) → Date UTC para guardar.
 */
export function fromLocalInputValue(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const [year, month, day, hour, minute] = match.slice(1).map(Number) as [
    number,
    number,
    number,
    number,
    number,
  ];
  return new Date(Date.UTC(year, month - 1, day, hour + 5, minute));
}
