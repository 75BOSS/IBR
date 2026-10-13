import type { PublicNavGroup, PublicNavItem } from '@/lib/nav';

/**
 * El encabezado de escritorio lleva el logo al centro y el menú partido (imagen 10): los dos
 * primeros grupos a la izquierda (Conócenos, Conéctate) y el resto a la derecha junto a
 * «Visítanos». Los enlaces sueltos (`nav.links`, ej. Dar) van dentro del último desplegable de la
 * derecha para no desbalancear los lados; si a la derecha no queda ningún grupo, forman uno.
 */
export function repartirMenu(
  menu: PublicNavGroup[],
  links: PublicNavItem[],
): { izquierda: PublicNavGroup[]; derecha: PublicNavGroup[] } {
  const izquierda = menu.slice(0, 2);
  const derecha = menu.slice(2);
  if (links.length === 0) return { izquierda, derecha };
  const ultimo = derecha.at(-1);
  if (!ultimo) return { izquierda, derecha: [{ title: 'Más', items: links }] };
  return {
    izquierda,
    derecha: [...derecha.slice(0, -1), { ...ultimo, items: [...ultimo.items, ...links] }],
  };
}
