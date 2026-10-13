import type { SiteContent } from '@/lib/nav';
import type { IconoPosterNombre } from './IconoPoster';

/** Rutas propias de la propuesta (el resto del sitio usa sus páginas de siempre). */
export const RUTA_INICIO = '/disenos/poster';
export const RUTA_COMUNIDAD = '/disenos/poster/comunidad';

export type EnlacePrincipal = {
  href: string;
  etiqueta: string;
  icono: IconoPosterNombre;
  /** Solo en el menú lateral de escritorio (la barra del celular lleva cuatro). */
  soloLateral?: boolean;
};

/**
 * Los destinos principales del menú lateral (escritorio) y de la barra de pestañas (celular),
 * como en la propuesta: Inicio · Conócenos · Comunidad · Prédicas · Visítanos. Cada uno solo
 * aparece si a donde lleva tiene contenido (`content`), igual que el menú del sitio original.
 */
export function enlacesPrincipales(content: SiteContent): EnlacePrincipal[] {
  return [
    { href: RUTA_INICIO, etiqueta: 'Inicio', icono: 'home' as const },
    { href: '/nosotros', etiqueta: 'Conócenos', icono: 'users' as const, soloLateral: true },
    { href: RUTA_COMUNIDAD, etiqueta: 'Comunidad', icono: 'corazon' as const },
    ...(content.predicas
      ? [{ href: '/predicas', etiqueta: 'Prédicas', icono: 'playCirculo' as const }]
      : []),
    ...(content.reuniones
      ? [{ href: '/reuniones', etiqueta: 'Visítanos', icono: 'mapPin' as const }]
      : []),
  ];
}

/** ¿El enlace es la página actual? Inicio solo coincide exacto. */
export function esActual(pathname: string, href: string): boolean {
  const ruta = pathname.replace(/\/+$/, '') || '/';
  if (href === RUTA_INICIO) return ruta === href;
  return ruta === href || ruta.startsWith(`${href}/`);
}
