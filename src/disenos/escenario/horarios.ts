import { DAY_NAMES, formatTime } from '@/lib/dates';

type ReunionHora = { dia_semana: number; hora_inicio: string };

const lista = new Intl.ListFormat('es', { type: 'conjunction' });

/** «Domingo» → «Domingos»; los días que ya terminan en s (Lunes… Viernes) no cambian. */
export function diaEnPlural(dia: string): string {
  return dia.endsWith('s') ? dia : `${dia}s`;
}

/**
 * El día principal de reunión para la franja de la portada («Domingos · 10:00»): el primero de la
 * lista (llegan con el domingo primero) y sus horas sin repetir, unidas como se dice («10:00 y
 * 18:00»). null si no hay reuniones: la franja no inventa un horario.
 */
export function diaPrincipal(reuniones: ReunionHora[]): { dia: string; horas: string } | null {
  const [primera] = reuniones;
  if (!primera) return null;
  const horas = [
    ...new Set(
      reuniones
        .filter((r) => r.dia_semana === primera.dia_semana)
        .map((r) => formatTime(r.hora_inicio)),
    ),
  ];
  return { dia: diaEnPlural(DAY_NAMES[primera.dia_semana] ?? ''), horas: lista.format(horas) };
}

const diaSemana = new Intl.DateTimeFormat('es-EC', {
  weekday: 'long',
  timeZone: 'America/Guayaquil',
});

/** El día de la semana en Ecuador con mayúscula («Lunes»), para marcar el devocional de hoy. */
export function diaDeHoy(fecha: Date = new Date()): string {
  const dia = diaSemana.format(fecha);
  return dia.charAt(0).toUpperCase() + dia.slice(1);
}
