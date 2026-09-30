/** Enlace «Cómo llegar» que abre Google Maps (app o web) buscando la dirección. */
export function mapsSearchUrl(address: string): string {
  const url = new URL('https://www.google.com/maps/search/');
  url.searchParams.set('api', '1');
  url.searchParams.set('query', address);
  return url.toString();
}

/**
 * Solo se incrustan mapas de Google Maps (Compartir → Insertar un mapa → copiar el src).
 * Evita que un valor mal pegado en /admin/config cargue cualquier página en un iframe.
 */
const MAPS_EMBED_HOSTS = new Set([
  'www.google.com',
  'google.com',
  'maps.google.com',
  'www.google.com.ec',
]);

export function safeMapsEmbedUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const src = value.match(/src="([^"]+)"/)?.[1] ?? value.trim(); // acepta el <iframe> completo
  try {
    const url = new URL(src);
    const ok =
      url.protocol === 'https:' &&
      MAPS_EMBED_HOSTS.has(url.hostname) &&
      url.pathname.startsWith('/maps/embed');
    return ok ? url.toString() : null;
  } catch {
    return null; // no es una URL: se muestra el aviso en vez del mapa
  }
}
