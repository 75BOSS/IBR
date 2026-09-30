import type { IconName } from '@/components/Icon';
import type { SiteConfig } from '@/lib/config';

/** Navegación pública (ROADMAP F0: 6 entradas). Un solo lugar para header, menú móvil y footer. */
export const PUBLIC_NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/soy-nuevo', label: 'Soy nuevo' },
  { href: '/reuniones', label: 'Reuniones' },
  { href: '/grupos', label: 'Grupos' },
  { href: '/predicas', label: 'Prédicas' },
  { href: '/dar', label: 'Dar' },
] as const;

/** Enlaces que no caben en el menú principal: van en el pie de página. */
export const FOOTER_EXTRA_NAV = [
  { href: '/eventos', label: 'Eventos' },
  { href: '/oracion', label: 'Pedir oración' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/privacidad', label: 'Privacidad' },
] as const;

/**
 * Menú del panel. `ready: false` se muestra deshabilitado con la etiqueta «Pronto» hasta que
 * el módulo exista (se cambia a true al terminar cada módulo de F1).
 */
export const ADMIN_NAV: { href: string; label: string; icon: IconName; ready: boolean }[] = [
  { href: '/admin', label: 'Resumen', icon: 'dashboard', ready: true },
  { href: '/admin/registros', label: 'Registros', icon: 'userPlus', ready: true },
  { href: '/admin/grupos', label: 'Grupos', icon: 'users', ready: true },
  { href: '/admin/reuniones', label: 'Reuniones', icon: 'clock', ready: true },
  { href: '/admin/ubicaciones', label: 'Lugares', icon: 'mapPin', ready: true },
  { href: '/admin/predicas', label: 'Prédicas', icon: 'play', ready: true },
  { href: '/admin/eventos', label: 'Eventos', icon: 'calendar', ready: true },
  { href: '/admin/peticiones', label: 'Peticiones', icon: 'handHeart', ready: true },
  { href: '/admin/mensajes', label: 'Mensajes', icon: 'mail', ready: true },
  { href: '/admin/equipo', label: 'Equipo', icon: 'idCard', ready: true },
  { href: '/admin/config', label: 'Configuración', icon: 'settings', ready: true },
];

const SOCIALS = [
  { key: 'instagram', label: 'Instagram', icon: 'instagram' },
  { key: 'youtube', label: 'YouTube', icon: 'youtube' },
  { key: 'tiktok', label: 'TikTok', icon: 'tiktok' },
  { key: 'facebook', label: 'Facebook', icon: 'facebook' },
] as const satisfies readonly { key: keyof SiteConfig; label: string; icon: IconName }[];

/** Redes configuradas en /admin/config (pie de página y Contacto). */
export function socialLinks(config: SiteConfig): { label: string; icon: IconName; href: string }[] {
  return SOCIALS.flatMap((s) => {
    const href = config[s.key];
    return href ? [{ label: s.label, icon: s.icon, href }] : [];
  });
}

/** ¿El enlace corresponde a la ruta actual? (la raíz solo coincide exacto). */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === '/' || href === '/admin') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
