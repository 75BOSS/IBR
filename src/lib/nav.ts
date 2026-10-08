import type { IconName } from '@/components/Icon';
import type { SiteConfig } from '@/lib/config';

/** Qué contenido existe en el sitio (lo calcula `getSiteContent` en el servidor). */
export type SiteContent = {
  reuniones: boolean;
  horarios: boolean;
  grupos: boolean;
  eventos: boolean;
  servir: boolean;
  predicas: boolean;
  ministerios: boolean;
  equipo: boolean;
  pastores: boolean;
  creencias: boolean;
  dar: boolean;
  agenda: boolean;
  cuenta: boolean;
};

export type PublicNavItem = {
  href: string;
  label: string;
  /** Una línea que explica la página (menú desplegable y menú del celular). */
  description?: string;
  /** Página personal: no va al sitemap (no se indexa). */
  private?: boolean;
  /** Solo se enlaza si existe este contenido: ningún enlace lleva a una página vacía. */
  needs?: keyof SiteContent;
};

export type PublicNavGroup = { title: string; items: PublicNavItem[] };

/**
 * Navegación pública agrupada como la recorre un visitante: conocer la iglesia, dar el
 * siguiente paso y los recursos de cada semana. Un solo lugar para el menú, el menú del celular,
 * el pie de página, la 404 y el sitemap (siempre filtrada con `visibleNav`).
 */
export const PUBLIC_MENU: PublicNavGroup[] = [
  {
    title: 'Conócenos',
    items: [
      { href: '/nosotros', label: 'Nosotros', description: 'Quiénes somos y nuestra historia' },
      {
        href: '/ministerios',
        label: 'Ministerios',
        description: 'Un lugar para cada edad',
        needs: 'ministerios',
      },
      {
        href: '/reuniones',
        label: 'Reuniones',
        description: 'Horarios y cómo llegar',
        needs: 'reuniones',
      },
      { href: '/contacto', label: 'Contacto', description: 'Escríbenos un mensaje' },
    ],
  },
  {
    title: 'Conéctate',
    items: [
      { href: '/soy-nuevo', label: 'Soy nuevo', description: 'Qué esperar en tu primera visita' },
      {
        href: '/grupos',
        label: 'Grupos',
        description: 'Grupos en casas por toda la ciudad',
        needs: 'grupos',
      },
      {
        href: '/eventos',
        label: 'Eventos',
        description: 'Lo que viene en la iglesia',
        needs: 'eventos',
      },
      {
        href: '/servir',
        label: 'Servir',
        description: 'Sirve con tus dones en un equipo',
        needs: 'servir',
      },
    ],
  },
  {
    title: 'Recursos',
    items: [
      {
        href: '/predicas',
        label: 'Prédicas',
        description: 'Los mensajes de cada domingo',
        needs: 'predicas',
      },
      {
        href: '/agenda',
        label: 'Agenda semanal',
        description: 'Lo que viene, en tu correo',
        needs: 'agenda',
      },
      { href: '/oracion', label: 'Pedir oración', description: 'Los pastores oran por ti' },
    ],
  },
];

/** Enlaces sueltos del menú (sin desplegable). */
export const MENU_LINKS: PublicNavItem[] = [{ href: '/dar', label: 'Dar', needs: 'dar' }];

/** Enlaces del pie que no van en el menú principal. */
export const LEGAL_NAV: PublicNavItem[] = [
  { href: '/mi-cuenta', label: 'Mi cuenta', private: true, needs: 'cuenta' },
  { href: '/privacidad', label: 'Privacidad' },
];

const shown = (content: SiteContent) => (item: PublicNavItem) => !item.needs || content[item.needs];

/**
 * La navegación que corresponde al contenido actual: sin enlaces a páginas vacías y sin grupos
 * del menú que se queden sin páginas.
 */
export function visibleNav(content: SiteContent) {
  const keep = shown(content);
  const menu = PUBLIC_MENU.map((group) => ({ ...group, items: group.items.filter(keep) })).filter(
    (group) => group.items.length > 0,
  );
  const links = MENU_LINKS.filter(keep);
  const legal = LEGAL_NAV.filter(keep);
  const pages: PublicNavItem[] = [
    { href: '/', label: 'Inicio' },
    ...menu.flatMap((group) => group.items),
    ...links,
    ...legal,
  ];
  return { menu, links, legal, pages };
}

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
