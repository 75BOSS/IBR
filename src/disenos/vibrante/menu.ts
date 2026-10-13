import type { PublicNavGroup } from '@/lib/nav';

/** Inicio y páginas propias de la propuesta (las demás son las del sitio). */
export const RUTA_INICIO = '/disenos/vibrante';
export const RUTA_COMUNIDAD = '/disenos/vibrante/comunidad';

/**
 * El menú del sitio (`nav.menu`, ya filtrado por contenido) con la página Comunidad de esta
 * propuesta al frente de «Conéctate». Si ese grupo no existiera, Comunidad va en su propio grupo.
 */
export function menuVibrante(menu: PublicNavGroup[]): PublicNavGroup[] {
  const comunidad = {
    href: RUTA_COMUNIDAD,
    label: 'Comunidad',
    description: 'Grupos, familias y servir juntos',
  };
  if (!menu.some((g) => g.title === 'Conéctate')) {
    return [...menu, { title: 'Conéctate', items: [comunidad] }];
  }
  return menu.map((g) => (g.title === 'Conéctate' ? { ...g, items: [comunidad, ...g.items] } : g));
}
