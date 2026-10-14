import { DAY_NAMES, formatTime } from '@/lib/dates';

type ReunionBase = { dia_semana: number; hora_inicio: string; nombre: string };

export type Horario = { dia: string; hora: string; nombres: string[] };

/** Orden de la semana para quien visita: el domingo primero, luego de lunes a sábado. */
const ordenDia = (dia: number) => (dia === 7 ? 0 : dia);

/**
 * Reuniones agrupadas por día y hora («Domingo 10:00: Culto dominical · Kids»), con el domingo
 * primero. Así la cartelera no repite la misma hora para cada edad.
 */
export function agruparHorarios(reuniones: ReunionBase[]): Horario[] {
  const grupos = new Map<string, Horario & { orden: number }>();
  for (const r of reuniones) {
    const hora = formatTime(r.hora_inicio);
    const clave = `${r.dia_semana}-${hora}`;
    const grupo = grupos.get(clave);
    if (grupo) {
      if (!grupo.nombres.includes(r.nombre)) grupo.nombres.push(r.nombre);
    } else {
      grupos.set(clave, {
        dia: DAY_NAMES[r.dia_semana] ?? '',
        hora,
        nombres: [r.nombre],
        orden: ordenDia(r.dia_semana) * 10000 + Number(hora.replace(':', '')),
      });
    }
  }
  return [...grupos.values()]
    .sort((a, b) => a.orden - b.orden)
    .map(({ dia, hora, nombres }) => ({ dia, hora, nombres }));
}

/** «10:00», «10:00 y 18:00», «8:00, 10:00 y 18:00». */
export function unirHoras(horas: string[]): string {
  if (horas.length < 2) return horas.join('');
  return `${horas.slice(0, -1).join(', ')} y ${horas.at(-1)}`;
}
