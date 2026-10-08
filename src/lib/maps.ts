/** Enlace «Cómo llegar» que abre Google Maps (app o web) buscando la dirección. */
export function mapsSearchUrl(address: string): string {
  const url = new URL('https://www.google.com/maps/search/');
  url.searchParams.set('api', '1');
  url.searchParams.set('query', address);
  return url.toString();
}

/** Dominios de Google Maps aceptados (mapas insertados y enlaces de «Compartir»). */
const MAPS_HOSTS = new Set([
  'www.google.com',
  'google.com',
  'maps.google.com',
  'www.google.com.ec',
]);
/** Enlaces cortos de «Compartir → Copiar enlace» (se expanden al guardar en /admin/config). */
const MAPS_SHORT_HOSTS = new Set(['maps.app.goo.gl', 'goo.gl']);

function parseHttps(value: string): URL | null {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' ? url : null;
  } catch {
    return null; // no es una URL: quien llama decide (aviso en el panel o se ignora)
  }
}

/**
 * Solo se incrustan mapas de Google Maps (/maps/embed: el `src` de «Insertar un mapa» o el que se
 * arma desde el enlace de la iglesia). Evita que un valor mal pegado en /admin/config cargue
 * cualquier página en un iframe.
 */
export function safeMapsEmbedUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const src = value.match(/src="([^"]+)"/)?.[1] ?? value; // acepta el <iframe> completo
  const url = parseHttps(src);
  if (!url || !MAPS_HOSTS.has(url.hostname)) return null;
  return url.pathname.startsWith('/maps/embed') ? url.toString() : null;
}

/** ¿Es un enlace de Google Maps (largo o corto)? Para el campo «Enlace de Google Maps». */
export function isGoogleMapsLink(value: string): boolean {
  const url = parseHttps(value);
  if (!url) return false;
  if (MAPS_SHORT_HOSTS.has(url.hostname)) return true;
  return MAPS_HOSTS.has(url.hostname) && url.pathname.startsWith('/maps');
}

export type MapsPin = { lat: number; lng: number; name: string | null };

/**
 * El punto exacto de un enlace de Google Maps: el pin (`!3d…!4d…`) o, si no está, el centro de
 * la vista (`@lat,lng`). Los enlaces cortos no traen coordenadas hasta expandirlos.
 */
export function mapsPinFromLink(value: string | null | undefined): MapsPin | null {
  if (!value) return null;
  const url = parseHttps(value);
  if (!url || !MAPS_HOSTS.has(url.hostname)) return null;
  const decoded = decodeURIComponent(url.pathname);
  const pin =
    decoded.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/) ??
    decoded.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (!pin) return null;
  const lat = Number(pin[1]);
  const lng = Number(pin[2]);
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  const name = decoded.match(/\/maps\/place\/([^/]+)/)?.[1]?.replace(/\+/g, ' ') ?? null;
  return { lat, lng, name };
}

/**
 * Mapa incrustable (sin clave de API) centrado en el pin de un enlace de Google Maps. Es el
 * mismo /maps/embed al que Google redirige `maps?q=…&output=embed`: se arma directo porque esa
 * redirección viene con X-Frame-Options y el iframe quedaría en blanco en algunos navegadores.
 */
export function mapsEmbedFromLink(value: string | null | undefined): string | null {
  const pin = mapsPinFromLink(value);
  if (!pin) return null;
  return `https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s${pin.lat},${pin.lng}!6i17!3m1!1ses!5m1!1ses`;
}

/**
 * Destino de «Cómo llegar»: el enlace de Google Maps de la iglesia (abre el lugar exacto) o, si
 * no hay, una búsqueda de la dirección escrita. Sin ninguno de los dos, no hay botón.
 */
export function directionsUrl(
  mapsUrl: string | null | undefined,
  address: string | null | undefined,
): string | null {
  if (mapsUrl && isGoogleMapsLink(mapsUrl)) return mapsUrl.trim();
  return address ? mapsSearchUrl(address) : null;
}

/**
 * Expande un enlace corto de Google Maps (maps.app.goo.gl) al enlace del lugar, que trae las
 * coordenadas para dibujar el mapa. Se llama al guardar en /admin/config (servidor). Si Google
 * no responde, se guarda el enlace corto: «Cómo llegar» igual funciona, solo falta el mapa.
 */
export async function expandMapsLink(value: string): Promise<string> {
  const url = parseHttps(value);
  if (!url || !MAPS_SHORT_HOSTS.has(url.hostname)) return value.trim();
  try {
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(6000) });
    const location = response.headers.get('location');
    const target = location ? parseHttps(location) : null;
    if (target && MAPS_HOSTS.has(target.hostname) && target.pathname.startsWith('/maps')) {
      return `${target.origin}${target.pathname}`; // sin parámetros de rastreo
    }
  } catch (error) {
    console.warn('[mapas] no se pudo expandir el enlace corto de Google Maps:', error);
  }
  return value.trim();
}
