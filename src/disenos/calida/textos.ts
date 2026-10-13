import { DAY_NAMES, formatTime } from '@/lib/dates';
import type { PublicNavGroup, PublicNavItem } from '@/lib/nav';

/**
 * Cálculos de texto de la propuesta (sin consultas: reciben lo que ya trae `@/disenos/datos`).
 */

/** «a», «a y b», «a, b y c». */
export function listaNatural(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

/**
 * El día principal de reunión para el titular «Domingos»: el domingo si hay culto ese día; si no,
 * el primer día con reunión. Devuelve el día en plural («Domingos», «Miércoles») y sus horas
 * («10:00» o «9:00 y 11:00»). null si aún no hay reuniones cargadas (nada se inventa).
 */
export function diaPrincipal(
  reuniones: { dia_semana: number; hora_inicio: string }[],
): { dia: string; horas: string } | null {
  const [primera] = reuniones;
  if (!primera) return null;
  const dia = reuniones.some((r) => r.dia_semana === 7) ? 7 : primera.dia_semana;
  const nombre = DAY_NAMES[dia] ?? '';
  if (!nombre) return null;
  const horas = [
    ...new Set(reuniones.filter((r) => r.dia_semana === dia).map((r) => formatTime(r.hora_inicio))),
  ].sort();
  return { dia: nombre.endsWith('s') ? nombre : `${nombre}s`, horas: listaNatural(horas) };
}

/** Página interior de la propuesta: va en el grupo «Conéctate» del menú y del pie. */
export const COMUNIDAD: PublicNavItem = {
  href: '/disenos/calida/comunidad',
  label: 'Comunidad',
  description: 'Grupos en casa, familias y servir juntos',
};

/** El menú del sitio (ya filtrado por contenido) con la página Comunidad de la propuesta. */
export function menuCalida(menu: PublicNavGroup[]): PublicNavGroup[] {
  return menu.map((grupo) =>
    grupo.title === 'Conéctate' ? { ...grupo, items: [COMUNIDAD, ...grupo.items] } : grupo,
  );
}
