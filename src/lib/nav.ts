import type { IconName } from '@/components/Icon';
import type { SiteConfig } from '@/lib/config';

export type PublicNavItem = {
  href: string;
  label: string;
  /** Una línea que explica la página (menú desplegable y menú del celular). */
  description?: string;
  /** Página personal: no va al sitemap (no se indexa). */
  private?: boolean;
};

/**
 * Navegación pública agrupada como la recorre un visitante: conocer la iglesia, dar el
 * siguiente paso y los recursos de cada semana. Un solo lugar para el menú, el menú del celular,
 * el pie de página y el sitemap.
 */
export const PUBLIC_MENU: { title: string; items: PublicNavItem[] }[] = [
  {
    title: 'Conócenos',
    items: [
      { href: '/nosotros', label: 'Nosotros', description: 'Historia, visión y en qué creemos' },
      { href: '/ministerios', label: 'Ministerios', description: 'Un lugar para cada edad' },
      { href: '/reuniones', label: 'Reuniones', description: 'Horarios y cómo llegar' },
      { href: '/contacto', label: 'Contacto', description: 'Escríbenos o llámanos' },
    ],
  },
  {
    title: 'Conéctate',
    items: [
      { href: '/soy-nuevo', label: 'Soy nuevo', description: 'Qué esperar en tu primera visita' },
      { href: '/grupos', label: 'Grupos', description: 'Grupos en casas por toda la ciudad' },
      { href: '/eventos', label: 'Eventos', description: 'Lo que viene en la iglesia' },
      { href: '/servir', label: 'Servir', description: 'Sirve con tus dones en un equipo' },
    ],
  },
  {
    title: 'Recursos',
    items: [
      { href: '/predicas', label: 'Prédicas', description: 'Los mensajes de cada domingo' },
      { href: '/agenda', label: 'Agenda semanal', description: 'Lo que viene, en tu correo' },
      { href: '/oracion', label: 'Pedir oración', description: 'Los pastores oran por ti' },
    ],
  },
];

/** Enlaces sueltos del menú (sin desplegable). */
export const MENU_LINKS: PublicNavItem[] = [{ href: '/dar', label: 'Dar' }];

/** Enlaces del pie que no van en el menú principal. */
export const LEGAL_NAV: PublicNavItem[] = [
  { href: '/mi-cuenta', label: 'Mi cuenta', private: true },
  { href: '/privacidad', label: 'Privacidad' },
];

/** Todas las páginas públicas fijas (sitemap, página 404). */
export const PUBLIC_PAGES: PublicNavItem[] = [
  { href: '/', label: 'Inicio' },
  ...PUBLIC_MENU.flatMap((group) => group.items),
  ...MENU_LINKS,
  ...LEGAL_NAV,
];

export type AdminNavItem = {
  href: string;
  label: string;
  icon: IconName;
  ready: boolean;
  /** Solo lo ve el rol admin (la página también lo exige con requireAdmin({ role: 'admin' })). */
  adminOnly?: boolean;
};

/**
 * Menú del panel, agrupado por tema para encontrar cada módulo sin leer toda la lista.
 * `ready: false` se muestra deshabilitado con la etiqueta «Pronto» hasta que el módulo exista.
 */
export const ADMIN_NAV: { title: string | null; items: AdminNavItem[] }[] = [
  {
    title: null,
    items: [{ href: '/admin', label: 'Resumen', icon: 'dashboard', ready: true }],
  },
  {
    title: 'Personas',
    items: [
      { href: '/admin/registros', label: 'Registros', icon: 'userPlus', ready: true },
      { href: '/admin/grupos', label: 'Grupos', icon: 'users', ready: true },
      { href: '/admin/peticiones', label: 'Peticiones', icon: 'handHeart', ready: true },
      { href: '/admin/mensajes', label: 'Mensajes', icon: 'mail', ready: true },
      { href: '/admin/servir', label: 'Servir', icon: 'heartHandshake', ready: true },
    ],
  },
  {
    title: 'Contenido del sitio',
    items: [
      { href: '/admin/eventos', label: 'Eventos', icon: 'calendar', ready: true },
      { href: '/admin/predicas', label: 'Prédicas', icon: 'play', ready: true },
      { href: '/admin/reuniones', label: 'Reuniones', icon: 'clock', ready: true },
      { href: '/admin/ministerios', label: 'Ministerios', icon: 'church', ready: true },
      { href: '/admin/ubicaciones', label: 'Lugares', icon: 'mapPin', ready: true },
      { href: '/admin/equipo', label: 'Equipo', icon: 'idCard', ready: true },
    ],
  },
  {
    title: 'Comunicación',
    items: [{ href: '/admin/agenda', label: 'Agenda semanal', icon: 'mailOpen', ready: true }],
  },
  {
    title: 'Administración',
    items: [
      { href: '/admin/usuarios', label: 'Usuarios', icon: 'lock', ready: true, adminOnly: true },
      {
        href: '/admin/config',
        label: 'Configuración',
        icon: 'settings',
        ready: true,
        adminOnly: true,
      },
    ],
  },
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
