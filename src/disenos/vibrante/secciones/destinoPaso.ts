import type { SiteContent } from '@/lib/nav';

/**
 * A dónde lleva cada paso de la ruta (RUTA_CRECER). Las anclas (#salvacion…) son secciones de
 * Crecer: en esa página se usan tal cual y desde otra se les antepone su ruta. Grupos y Servir
 * son páginas del sitio: solo si tienen contenido; si no, el paso lleva a escribirnos.
 */
export function destinoPaso(
  href: string,
  { pagina, content }: { pagina: string; content: Pick<SiteContent, 'grupos' | 'servir'> },
): string {
  if (href.startsWith('#')) return `${pagina}${href}`;
  if (href === '/grupos') return content.grupos ? href : '/contacto#mensaje';
  if (href === '/servir') return content.servir ? href : '/contacto#mensaje';
  return href;
}
