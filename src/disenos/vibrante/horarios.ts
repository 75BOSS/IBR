import { DAY_NAMES, formatTime } from '@/lib/dates';

/** Días en plural, como se dicen al invitar: «los domingos», «los sábados» (1 = lunes). */
const DIAS_PLURAL = [
  '',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábados',
  'Domingos',
] as const;

/**
 * La reunión principal para la franja «Te esperamos»: la primera de la lista (las reuniones ya
 * llegan con el domingo primero). null si aún no hay reuniones: la franja no inventa un horario.
 */
export function horarioPrincipal(
  reuniones: readonly { dia_semana: number; hora_inicio: string }[],
): { dias: string; hora: string } | null {
  const [primera] = reuniones;
  if (!primera) return null;
  return {
    dias: DIAS_PLURAL[primera.dia_semana] ?? DAY_NAMES[primera.dia_semana] ?? '',
    hora: formatTime(primera.hora_inicio),
  };
}
