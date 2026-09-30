/** URL pública del sitio sin barra final (metadata, OG, sitemap, correos). */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000';
  return raw.replace(/\/+$/, '');
}

/** Zona horaria de la iglesia: la BD guarda UTC y se muestra en hora de Ecuador. */
export const TIME_ZONE = 'America/Guayaquil';
