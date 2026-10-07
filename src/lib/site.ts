/** URL pública del sitio sin barra final (metadata, OG, sitemap, correos). */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000';
  return raw.replace(/\/+$/, '');
}

/**
 * Dominios de producción. Solo ahí el sitio se deja indexar: las copias de prueba
 * (dev.ibriglesia.com, un subdominio de Pixelia, localhost) tienen datos de ejemplo y no deben
 * aparecer en Google ni competir con el sitio real.
 */
export const PRODUCTION_HOSTS = ['ibriglesia.com', 'www.ibriglesia.com'] as const;

export function isIndexable(url: string = siteUrl()): boolean {
  return (PRODUCTION_HOSTS as readonly string[]).includes(new URL(url).hostname);
}

/** Zona horaria de la iglesia: la BD guarda UTC y se muestra en hora de Ecuador. */
export const TIME_ZONE = 'America/Guayaquil';
