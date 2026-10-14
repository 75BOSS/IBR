import { RUTA_CRECER } from '@/disenos/contenido';
import type { SiteContent } from '@/lib/nav';
import { COMUNIDAD, CONOCENOS, CRECER, MINISTERIOS, PRIMERA_VISITA, RECURSOS } from './rutas';

export type EnlaceMenu = { href: string; label: string; description?: string };

/** Foto con una invitación al lado de los enlaces del panel (como el menú de caminodevida). */
export type Destacado = { href: string; titulo: string; texto: string; foto: string };

export type GrupoMenu = { titulo: string; items: EnlaceMenu[]; destacado: Destacado };

export type MenuEscenario = {
  /** A la izquierda del logo. */
  izquierda: GrupoMenu[];
  /** A la derecha del logo, junto a los enlaces sueltos y «Planifica tu visita». */
  derecha: GrupoMenu[];
  /** Enlaces sin desplegable (Oración, Dar). */
  sueltos: EnlaceMenu[];
};

type Contenido = Pick<SiteContent, 'creencias' | 'equipo' | 'servir' | 'eventos' | 'dar'>;

/** Agrega el enlace solo si a donde lleva tiene contenido. */
const si = (condicion: boolean, enlace: EnlaceMenu): EnlaceMenu[] => (condicion ? [enlace] : []);

/**
 * Menú desplegable de la propuesta: lleva a sus propias páginas (Conócenos, Crecer, Comunidad,
 * Ministerios, Recursos) y a las del sitio que tienen contenido. Las anclas existen en su página
 * solo si hay datos: «En qué creemos» con creencias, «Liderazgo» con equipo visible, Kids y
 * Jóvenes si existen esos ministerios (`slugs`), Servir, Eventos y Dar si el sitio los muestra.
 */
export function menuEscenario(content: Contenido, slugs: string[]): MenuEscenario {
  const conocenos: GrupoMenu = {
    titulo: 'Conócenos',
    items: [
      { href: CONOCENOS, label: 'Nosotros', description: 'Historia, visión y misión' },
      { href: `${CONOCENOS}#adn`, label: 'Nuestro ADN', description: 'Lo que nos define' },
      ...si(content.creencias, {
        href: `${CONOCENOS}#creemos`,
        label: 'En qué creemos',
        description: 'Lo que enseña la Biblia',
      }),
      ...si(content.equipo, {
        href: `${CONOCENOS}#equipo`,
        label: 'Liderazgo',
        description: 'Pastores y líderes',
      }),
    ],
    destacado: {
      href: `${CONOCENOS}#historia`,
      titulo: 'Nuestra historia',
      texto: 'Cómo empezó todo en Riobamba.',
      foto: '/fotos-ejemplo/nosotros.webp',
    },
  };

  const siguientePaso: GrupoMenu = {
    titulo: 'Siguiente paso',
    items: [
      { href: PRIMERA_VISITA, label: 'Primera visita', description: 'Qué esperar el domingo' },
      { href: CRECER, label: 'Crecer', description: 'Tu ruta en cinco pasos' },
      { href: `${CRECER}#bautismo`, label: 'Bautismo', description: 'Da el paso de fe' },
      { href: `${CRECER}#salvacion`, label: 'Salvación', description: 'Un nuevo comienzo' },
      { href: `${CRECER}#formacion`, label: 'Formación', description: 'Escuela de Discipulado' },
    ],
    destacado: {
      href: `${CRECER}#bautismo`,
      titulo: 'El bautismo',
      texto: 'Dile al mundo que ahora sigues a Jesús.',
      foto: '/fotos-ejemplo/evento-bautismos.webp',
    },
  };

  const comunidad: GrupoMenu = {
    titulo: 'Comunidad',
    items: [
      { href: COMUNIDAD, label: 'Grupos en casa', description: 'Un grupo cerca de ti' },
      { href: MINISTERIOS, label: 'Ministerios', description: 'Un lugar para cada edad' },
      ...si(slugs.includes('kids'), {
        href: `${MINISTERIOS}#kids`,
        label: 'Kids',
        description: 'Para los más pequeños',
      }),
      ...si(slugs.includes('jovenes'), {
        href: `${MINISTERIOS}#jovenes`,
        label: 'Jóvenes',
        description: 'Amistad y fe que se vive',
      }),
      { href: `${MINISTERIOS}#mujeres`, label: 'Mujeres', description: 'Crecer juntas en la fe' },
      ...si(content.servir, {
        href: '/servir',
        label: 'Servir',
        description: 'Sirve con tus dones',
      }),
    ],
    destacado: {
      href: `${COMUNIDAD}#grupos`,
      titulo: 'Grupos en casa',
      texto: 'La iglesia también sucede entre semana.',
      foto: '/fotos-ejemplo/grupo-familias.webp',
    },
  };

  const recursos: GrupoMenu = {
    titulo: 'Recursos',
    items: [
      { href: `${RECURSOS}#predicas`, label: 'Prédicas', description: 'Los mensajes del domingo' },
      {
        href: `${RECURSOS}#devocionales`,
        label: 'Devocionales',
        description: 'Un plan para tu semana',
      },
      {
        href: `${RECURSOS}#testimonios`,
        label: 'Testimonios',
        description: 'Historias de vidas cambiadas',
      },
      ...si(content.eventos, {
        href: '/eventos',
        label: 'Eventos',
        description: 'Lo que viene en la iglesia',
      }),
    ],
    destacado: {
      href: `${RECURSOS}#devocionales`,
      titulo: 'Devocional de la semana',
      texto: 'Cinco lecturas cortas, de lunes a viernes.',
      foto: '/disenos/escenario/escenario-luces.webp',
    },
  };

  return {
    izquierda: [conocenos, siguientePaso, comunidad],
    derecha: [recursos],
    sueltos: [
      { href: '/oracion', label: 'Oración' },
      ...si(content.dar, { href: '/dar', label: 'Dar' }),
    ],
  };
}

export type PasoCamino = (typeof RUTA_CRECER)[number];

/**
 * «Tu siguiente paso» (RUTA_CRECER) con sus destinos reales: las anclas (#salvacion…) son de la
 * página Crecer (desde otra página llevan a ella); Grupos y Servir solo si tienen contenido, si
 * no, a escribirnos.
 */
export function rutaCrecer(
  content: Pick<SiteContent, 'grupos' | 'servir'>,
  enCrecer: boolean,
): PasoCamino[] {
  const destino = (href: string): string => {
    if (href.startsWith('#')) return enCrecer ? href : `${CRECER}${href}`;
    if (href === '/grupos') return content.grupos ? href : '/contacto#mensaje';
    if (href === '/servir') return content.servir ? href : '/contacto#mensaje';
    return href;
  };
  return RUTA_CRECER.map((paso) => ({ ...paso, href: destino(paso.href) }));
}
