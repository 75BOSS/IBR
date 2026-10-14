import { FOTOS, type FotoVibrante } from '@/disenos/vibrante/fotos';
import type { PublicNavItem, SiteContent } from '@/lib/nav';

const BASE = '/disenos/vibrante';

/** Las siete páginas de la propuesta (las mismas de `registro.ts`). */
export const RUTAS = {
  inicio: BASE,
  comunidad: `${BASE}/comunidad`,
  primeraVisita: `${BASE}/primera-visita`,
  conocenos: `${BASE}/conocenos`,
  crecer: `${BASE}/crecer`,
  ministerios: `${BASE}/ministerios`,
  recursos: `${BASE}/recursos`,
} as const;

export const RUTA_INICIO = RUTAS.inicio;

/** Un grupo del menú desplegable: sus enlaces, una frase y una foto para el panel. */
export type GrupoMenu = {
  titulo: string;
  frase: string;
  foto: FotoVibrante;
  items: PublicNavItem[];
};

export type MenuVibrante = {
  grupos: GrupoMenu[];
  /** Enlaces sueltos (sin desplegable): Oración y Dar. */
  sueltos: PublicNavItem[];
};

/**
 * Menú de la propuesta (como el de caminodevida): Conócenos, Siguiente paso, Comunidad y Recursos
 * llevan a las páginas de esta propuesta y a sus anclas; Servir, Eventos y Dar son páginas del
 * sitio y solo aparecen si tienen contenido (las mismas claves `content` que el menú original).
 * Kids y Jóvenes solo si esos ministerios existen en la BD; En qué creemos y Liderazgo, solo si
 * Conócenos tiene esas secciones.
 */
export function menuVibrante({
  content,
  ministerios,
}: {
  content: SiteContent;
  /** Ministerios con contenido (slug y nombre para mostrar). */
  ministerios: { slug: string; nombre: string }[];
}): MenuVibrante {
  const ministerio = (slug: string, description: string): PublicNavItem[] => {
    const m = ministerios.find((x) => x.slug === slug);
    return m ? [{ href: `${RUTAS.ministerios}#${slug}`, label: m.nombre, description }] : [];
  };
  const si = (condicion: boolean, item: PublicNavItem): PublicNavItem[] =>
    condicion ? [item] : [];

  return {
    grupos: [
      {
        titulo: 'Conócenos',
        frase: 'Quiénes somos, qué creemos y quiénes nos guían.',
        foto: FOTOS.nosotros,
        items: [
          {
            href: RUTAS.conocenos,
            label: 'Nosotros',
            description: 'Nuestra historia, visión y misión',
          },
          {
            href: `${RUTAS.conocenos}#adn`,
            label: 'Nuestro ADN',
            description: 'Lo que nos define como familia',
          },
          ...si(content.creencias, {
            href: `${RUTAS.conocenos}#creemos`,
            label: 'En qué creemos',
            description: 'Lo esencial de nuestra fe',
          }),
          ...si(content.equipo, {
            href: `${RUTAS.conocenos}#equipo`,
            label: 'Liderazgo',
            description: 'Pastores y líderes que te acompañan',
          }),
        ],
      },
      {
        titulo: 'Siguiente paso',
        frase: 'Desde tu primera visita hasta servir en un equipo.',
        foto: FOTOS.adoracionJuntos,
        items: [
          {
            href: RUTAS.primeraVisita,
            label: 'Primera visita',
            description: 'Qué esperar el domingo',
          },
          { href: RUTAS.crecer, label: 'Crecer', description: 'La ruta para crecer en la fe' },
          {
            href: `${RUTAS.crecer}#bautismo`,
            label: 'Bautismo',
            description: 'Declara tu fe en Jesús',
          },
          {
            href: `${RUTAS.crecer}#salvacion`,
            label: 'Salvación',
            description: 'Un nuevo comienzo',
          },
          {
            href: `${RUTAS.crecer}#formacion`,
            label: 'Formación',
            description: 'La Escuela de Discipulado',
          },
        ],
      },
      {
        titulo: 'Comunidad',
        frase: 'Nadie camina solo: grupos, ministerios y equipos.',
        foto: FOTOS.gruposCasa,
        items: [
          {
            href: RUTAS.comunidad,
            label: 'Grupos en casa',
            description: 'Por toda Riobamba, entre semana',
          },
          { href: RUTAS.ministerios, label: 'Ministerios', description: 'Un lugar para cada edad' },
          ...ministerio('kids', 'Para los más pequeños'),
          ...ministerio('jovenes', 'Fe, amistad y propósito'),
          {
            href: `${RUTAS.ministerios}#mujeres`,
            label: 'Mujeres',
            description: 'Crecer juntas en la fe',
          },
          ...si(content.servir, {
            href: '/servir',
            label: 'Servir',
            description: 'Sirve con tus dones en un equipo',
          }),
        ],
      },
      {
        titulo: 'Recursos',
        frase: 'Palabra para toda la semana.',
        foto: FOTOS.predicador,
        items: [
          { href: RUTAS.recursos, label: 'Prédicas', description: 'Los mensajes de cada domingo' },
          {
            href: `${RUTAS.recursos}#devocionales`,
            label: 'Devocionales',
            description: 'Un plan de lectura para la semana',
          },
          {
            href: `${RUTAS.recursos}#testimonios`,
            label: 'Testimonios',
            description: 'Historias de nuestra familia',
          },
          ...si(content.eventos, {
            href: '/eventos',
            label: 'Eventos',
            description: 'Lo que viene en la iglesia',
          }),
        ],
      },
    ],
    sueltos: [
      { href: '/oracion', label: 'Oración', description: 'Los pastores oran por ti' },
      ...si(content.dar, { href: '/dar', label: 'Dar', description: 'Ofrendas y diezmos' }),
    ],
  };
}

/** ¿El enlace es la página que se está viendo? Las anclas (#…) nunca lo son. */
export function esPaginaActual(pathname: string, href: string): boolean {
  return !href.includes('#') && pathname.replace(/\/+$/, '') === href;
}
