import 'server-only';
import { isIP } from 'node:net';
import { headers } from 'next/headers';

/**
 * IP del visitante detrás del proxy de Hostinger. Toma la primera IP válida de
 * X-Forwarded-For (cliente original) o X-Real-IP. Solo se usa para límites de envío,
 * nunca para autorizar. Pendiente verificar en el primer deploy qué cabeceras pone
 * el proxy (ver ESTADO.md).
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const candidates = [h.get('x-forwarded-for')?.split(',')[0], h.get('x-real-ip')];
  for (const candidate of candidates) {
    const ip = candidate?.trim();
    if (ip && isIP(ip)) return ip;
  }
  return '0.0.0.0';
}
