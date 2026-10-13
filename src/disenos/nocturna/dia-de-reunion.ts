import { DAY_NAMES, formatTime } from '@/lib/dates';
import type { Reunion } from '@/lib/reuniones';

export type DiaDeReunion = {
  /** En plural, como lo dice la propuesta: «Domingos», «Miércoles». */
  dia: string;
  /** Horas de ese día sin repetir, en orden: ['10:00'] o ['09:00', '11:00']. */
  horas: string[];
  domingo: boolean;
};

const DOMINGO = 7;

/** «Sábado» → «Sábados»; los que ya terminan en s quedan igual («Lunes», «Miércoles»). */
function plural(dia: string): string {
  return dia.endsWith('s') ? dia : `${dia}s`;
}

/**
 * El día que la propuesta destaca («Te esperamos · Domingos»): el domingo si hay reunión ese
 * día; si no, el primero de la semana. null si no hay reuniones (la portada no inventa horarios).
 */
export function diaDeReunion(
  reuniones: Pick<Reunion, 'dia_semana' | 'hora_inicio'>[],
): DiaDeReunion | null {
  if (reuniones.length === 0) return null;
  const numero = reuniones.some((r) => r.dia_semana === DOMINGO)
    ? DOMINGO
    : Math.min(...reuniones.map((r) => r.dia_semana));
  const horas = [
    ...new Set(
      reuniones.filter((r) => r.dia_semana === numero).map((r) => formatTime(r.hora_inicio)),
    ),
  ].sort();
  return { dia: plural(DAY_NAMES[numero] ?? ''), horas, domingo: numero === DOMINGO };
}

/** ['09:00', '11:00'] → «09:00 y 11:00». */
export function unirHoras(horas: string[]): string {
  return horas.length > 1 ? `${horas.slice(0, -1).join(', ')} y ${horas.at(-1)}` : (horas[0] ?? '');
}
