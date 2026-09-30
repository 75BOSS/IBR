import 'server-only';
import { isIP } from 'node:net';
import { headers } from 'next/headers';

/**
 * Cuántos proxies de confianza hay delante de la app (Hostinger: 1). Cada proxy AGREGA al
 * final de X-Forwarded-For la IP que vio; lo de más a la izquierda lo puede escribir el
 * propio visitante. Verificar el valor con /admin/diagnostico (ver ESTADO.md).
 */
function trustedProxyHops(): number {
  const hops = Number.parseInt(process.env.TRUSTED_PROXY_HOPS ?? '1', 10);
  return Number.isInteger(hops) && hops >= 1 ? hops : 1;
}

/**
 * IP del visitante para límites de envío (nunca para autorizar). `next start` garantiza
 * X-Forwarded-For (si no llega, pone la IP del socket), así que se toma la IP que agregó
 * el proxy de confianza: la N-ésima contando desde la derecha.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const chain = (h.get('x-forwarded-for') ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  const candidate = chain[chain.length - trustedProxyHops()] ?? chain[0];
  return candidate && isIP(candidate) ? candidate : '0.0.0.0';
}
