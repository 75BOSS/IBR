import type { Metadata } from 'next';

export const SITE_NAME = 'Iglesia Bíblica Riobamba';

/** Imagen para compartir cuando la página no tiene una propia (public/og-default.png). */
export const DEFAULT_OG_IMAGE = { url: '/og-default.png', width: 1200, height: 630 };

/**
 * Metadata de una página pública. Next reemplaza (no mezcla) el `openGraph` del layout cuando
 * la página define el suyo, así que aquí se arma completo: nombre del sitio, idioma, descripción
 * e imagen. Así el enlace compartido por WhatsApp siempre muestra título, texto e imagen.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  /** Ruta canónica, ej. '/grupos'. */
  path: string;
  image?: string | null;
  type?: 'website' | 'article';
  /** El inicio usa el nombre de la iglesia sin el sufijo « · Iglesia Bíblica Riobamba». */
  absoluteTitle?: boolean;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: 'es_EC',
      siteName: SITE_NAME,
      title: absoluteTitle ? title : `${title} · ${SITE_NAME}`,
      description,
      url: path,
      images: [image ? { url: image } : DEFAULT_OG_IMAGE],
    },
    twitter: { card: 'summary_large_image' },
  };
}
