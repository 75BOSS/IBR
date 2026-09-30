import type { IconName } from '@/components/Icon';

/** Navegación pública (ROADMAP F0: 6 entradas). Un solo lugar para header, menú móvil y footer. */
export const PUBLIC_NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/soy-nuevo', label: 'Soy nuevo' },
  { href: '/reuniones', label: 'Reuniones' },
  { href: '/grupos', label: 'Grupos' },
  { href: '/predicas', label: 'Prédicas' },
  { href: '/dar', label: 'Dar' },
] as const;

/**
 * Menú del panel. `ready: false` se muestra deshabilitado con la etiqueta «Pronto» hasta que
 * el módulo exista (se cambia a true al terminar cada módulo de F1).
 */
export const ADMIN_NAV: { href: string; label: string; icon: IconName; ready: boolean }[] = [
  { href: '/admin', label: 'Resumen', icon: 'dashboard', ready: true },
  { href: '/admin/registros', label: 'Registros', icon: 'userPlus', ready: false },
  { href: '/admin/grupos', label: 'Grupos', icon: 'users', ready: false },
  { href: '/admin/reuniones', label: 'Reuniones', icon: 'clock', ready: false },
  { href: '/admin/predicas', label: 'Prédicas', icon: 'play', ready: false },
  { href: '/admin/eventos', label: 'Eventos', icon: 'calendar', ready: false },
  { href: '/admin/peticiones', label: 'Peticiones', icon: 'handHeart', ready: false },
  { href: '/admin/equipo', label: 'Equipo', icon: 'idCard', ready: false },
  { href: '/admin/config', label: 'Configuración', icon: 'settings', ready: true },
];

/** ¿El enlace corresponde a la ruta actual? (la raíz solo coincide exacto). */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === '/' || href === '/admin') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
