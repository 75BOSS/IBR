'use client';

/**
 * Cargador de next/image (images.loaderFile). Las fotos de Cloudinary se piden ya
 * redimensionadas a Cloudinary (f_auto,q_auto,w_N) en vez de optimizarlas en el servidor de
 * Hostinger; el resto (miniaturas de YouTube) se sirve tal cual. Así /_next/image no existe
 * y no puede usarse como proxy de imágenes ajenas.
 */
export default function imageLoader({ src, width }: { src: string; width: number }): string {
  const marker = '/image/upload/';
  if (src.startsWith('https://res.cloudinary.com/') && src.includes(marker)) {
    const [head, tail] = src.split(marker) as [string, string];
    return `${head}${marker}f_auto,q_auto,c_limit,w_${width}/${tail}`;
  }
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}w=${width}`;
}
