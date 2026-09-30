import { isIP } from 'node:net';

/**
 * Una conexión doméstica IPv6 recibe un bloque /64 entero: se limita por bloque para que
 * rotar direcciones dentro de él no dé intentos nuevos. IPv4 (y IPv4 mapeada) va tal cual.
 */
export function rateLimitIp(ip: string): string {
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(ip);
  if (mapped) return mapped[1]!;
  if (isIP(ip) !== 6) return ip;
  const [head = '', tail = ''] = ip.toLowerCase().split('::');
  const left = head ? head.split(':') : [];
  const right = tail ? tail.split(':') : [];
  const groups = ip.includes('::')
    ? [...left, ...Array<string>(8 - left.length - right.length).fill('0'), ...right]
    : left;
  return `${groups
    .slice(0, 4)
    .map((g) => g.padStart(4, '0'))
    .join(':')}::/64`;
}
