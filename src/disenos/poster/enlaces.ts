import type { IconoPosterNombre } from './IconoPoster';

/** Rutas propias de la propuesta (el resto del sitio usa sus páginas de siempre). */
export const RUTA_INICIO = '/disenos/poster';
export const RUTA_COMUNIDAD = `${RUTA_INICIO}/comunidad`;
export const RUTA_PRIMERA_VISITA = `${RUTA_INICIO}/primera-visita`;
export const RUTA_CONOCENOS = `${RUTA_INICIO}/conocenos`;
export const RUTA_CRECER = `${RUTA_INICIO}/crecer`;
export const RUTA_MINISTERIOS = `${RUTA_INICIO}/ministerios`;
export const RUTA_RECURSOS = `${RUTA_INICIO}/recursos`;

export type EnlacePrincipal = { href: string; etiqueta: string; icono: IconoPosterNombre };

/**
 * Las pestañas de la barra fija del celular (imagen 15): Inicio · Comunidad · Prédicas ·
 * Visítanos. Todas llevan a páginas de la propuesta, que siempre tienen contenido (Prédicas abre
 * Recursos, que empieza por los mensajes; Visítanos abre la primera visita).
 */
export const PESTANAS: EnlacePrincipal[] = [
  { href: RUTA_INICIO, etiqueta: 'Inicio', icono: 'home' },
  { href: RUTA_COMUNIDAD, etiqueta: 'Comunidad', icono: 'corazon' },
  { href: RUTA_RECURSOS, etiqueta: 'Prédicas', icono: 'playCirculo' },
  { href: RUTA_PRIMERA_VISITA, etiqueta: 'Visítanos', icono: 'mapPin' },
];

/**
 * ¿El enlace es la página actual? Inicio solo coincide exacto y un enlace a un ancla
 * (`…/crecer#bautismo`) nunca es «la página»: lo es el enlace a la página sin ancla.
 */
export function esActual(pathname: string, href: string): boolean {
  if (href.includes('#')) return false;
  const ruta = pathname.replace(/\/+$/, '') || '/';
  if (href === RUTA_INICIO) return ruta === href;
  return ruta === href || ruta.startsWith(`${href}/`);
}
