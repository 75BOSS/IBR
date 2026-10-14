import type { SiteContent } from '@/lib/nav';
import { RUTAS } from './rutas';

/*
 * Menú de la propuesta Nocturna (encabezado con mega menú, menú del celular y pie). Una sola
 * lista para los tres, armada en el servidor con lo que existe: un enlace solo aparece si a
 * donde lleva tiene contenido (la página del sitio original o el ancla de esta propuesta).
 * Sin imports de servidor: lo usa también el encabezado, que es un componente cliente.
 */

export type EnlaceMenu = { href: string; label: string; descripcion: string };

/** Tarjeta con foto a la derecha del mega menú (escritorio ancho). */
export type DestacadoMenu = {
  href: string;
  foto: string;
  titulo: string;
  texto: string;
  accion: string;
};

export type GrupoMenu = {
  titulo: string;
  /** Frase grande del panel: [texto, palabra en itálica]. */
  lema: [string, string];
  items: EnlaceMenu[];
  destacado: DestacadoMenu;
};

export type MenuNocturna = { grupos: GrupoMenu[]; sueltos: EnlaceMenu[] };

/** Lo que decide qué enlaces aparecen (claves de `getSiteContent`). */
export type ContenidoMenu = Pick<
  SiteContent,
  'creencias' | 'equipo' | 'servir' | 'eventos' | 'dar'
>;

const CONTACTO = '/contacto#mensaje';

const si = <T>(condicion: boolean, item: T): T[] => (condicion ? [item] : []);

/**
 * Menú completo. `slugsMinisterios`: los ministerios reales que se muestran (las anclas
 * #kids y #jovenes de la página Ministerios solo existen si existen esos ministerios).
 */
export function armarMenu(content: ContenidoMenu, slugsMinisterios: string[]): MenuNocturna {
  const ministerios = new Set(slugsMinisterios);
  return {
    grupos: [
      {
        titulo: 'Conócenos',
        lema: ['Una familia con', 'historia.'],
        items: [
          {
            href: RUTAS.conocenos,
            label: 'Nosotros',
            descripcion: 'Quiénes somos y cómo empezamos',
          },
          {
            href: `${RUTAS.conocenos}#adn`,
            label: 'Nuestro ADN',
            descripcion: 'Lo que nos define como iglesia',
          },
          ...si(content.creencias, {
            href: `${RUTAS.conocenos}#creemos`,
            label: 'En qué creemos',
            descripcion: 'Lo esencial de nuestra fe',
          }),
          ...si(content.equipo, {
            href: `${RUTAS.conocenos}#equipo`,
            label: 'Liderazgo',
            descripcion: 'Pastores y líderes que te acompañan',
          }),
        ],
        destacado: {
          href: RUTAS.conocenos,
          foto: 'abrazo-ancho.webp',
          titulo: 'Somos familia',
          texto: 'Nuestra historia, lo que creemos y quienes nos guían.',
          accion: 'Conócenos',
        },
      },
      {
        titulo: 'Siguiente paso',
        lema: ['Tu camino', 'empieza aquí.'],
        items: [
          {
            href: RUTAS.primeraVisita,
            label: 'Primera visita',
            descripcion: 'Qué esperar el domingo',
          },
          { href: RUTAS.crecer, label: 'Crecer', descripcion: 'Una ruta de cinco pasos' },
          {
            href: `${RUTAS.crecer}#bautismo`,
            label: 'Bautismo',
            descripcion: 'Da testimonio de tu fe',
          },
          {
            href: `${RUTAS.crecer}#salvacion`,
            label: 'Salvación',
            descripcion: 'Un nuevo comienzo con Jesús',
          },
          {
            href: `${RUTAS.crecer}#formacion`,
            label: 'Formación',
            descripcion: 'Escuela de Discipulado',
          },
        ],
        destacado: {
          href: RUTAS.primeraVisita,
          foto: 'auditorio.webp',
          titulo: 'Tu primera visita',
          texto: 'Horarios, niños y todo lo que necesitas saber.',
          accion: 'Planifica tu visita',
        },
      },
      {
        titulo: 'Comunidad',
        lema: ['La vida', 'se comparte.'],
        items: [
          {
            href: RUTAS.comunidad,
            label: 'Grupos en casa',
            descripcion: 'Familia durante la semana',
          },
          {
            href: RUTAS.ministerios,
            label: 'Ministerios',
            descripcion: 'Un lugar para cada edad',
          },
          ...si(ministerios.has('kids'), {
            href: `${RUTAS.ministerios}#kids`,
            label: 'Kids',
            descripcion: 'Los más pequeños conocen a Jesús',
          }),
          ...si(ministerios.has('jovenes'), {
            href: `${RUTAS.ministerios}#jovenes`,
            label: 'Jóvenes',
            descripcion: 'Fe, amistad y propósito',
          }),
          {
            href: `${RUTAS.ministerios}#mujeres`,
            label: 'Mujeres',
            descripcion: 'Crecer juntas en la fe',
          },
          ...si(content.servir, {
            href: '/servir',
            label: 'Servir',
            descripcion: 'Usa tus dones en un equipo',
          }),
        ],
        destacado: {
          href: RUTAS.comunidad,
          foto: 'grupos.webp',
          titulo: 'Grupos en casa',
          texto: 'Encuentra un grupo cerca de ti en Riobamba.',
          accion: 'Ver la comunidad',
        },
      },
      {
        titulo: 'Recursos',
        lema: ['Para tu', 'semana.'],
        items: [
          {
            href: RUTAS.recursos,
            label: 'Prédicas',
            descripcion: 'Los mensajes de cada domingo',
          },
          {
            href: `${RUTAS.recursos}#devocionales`,
            label: 'Devocionales',
            descripcion: 'Una lectura para cada día',
          },
          {
            href: `${RUTAS.recursos}#testimonios`,
            label: 'Testimonios',
            descripcion: 'Lo que Dios hace en nosotros',
          },
          ...si(content.eventos, {
            href: '/eventos',
            label: 'Eventos',
            descripcion: 'Lo que viene en la iglesia',
          }),
        ],
        destacado: {
          href: `${RUTAS.recursos}#devocionales`,
          foto: 'predicador.webp',
          titulo: 'Devocional de la semana',
          texto: 'Cinco lecturas cortas para empezar cada día.',
          accion: 'Leer el plan',
        },
      },
    ],
    sueltos: [
      { href: '/oracion', label: 'Oración', descripcion: 'Los pastores oran por ti' },
      ...si(content.dar, { href: '/dar', label: 'Dar', descripcion: 'Ofrendas y diezmos' }),
    ],
  };
}

/** Ruta sin el ancla: «/disenos/nocturna/crecer#bautismo» → «/disenos/nocturna/crecer». */
export function sinAncla(href: string): string {
  return href.split('#')[0] ?? href;
}

/** ¿El enlace es la página actual? Las anclas nunca lo son (solo llevan a una parte). */
export function esPaginaActual(pathname: string, href: string): boolean {
  return !href.includes('#') && pathname.replace(/\/+$/, '') === href;
}

/** ¿El grupo contiene la página actual? (subraya su título en el encabezado). */
export function grupoActivo(pathname: string, grupo: GrupoMenu): boolean {
  const ruta = pathname.replace(/\/+$/, '');
  return grupo.items.some((item) => sinAncla(item.href) === ruta);
}

/**
 * A dónde lleva un paso de RUTA_CRECER: las anclas son de la página Crecer (en ella misma, solo
 * el ancla); /grupos y /servir solo si tienen contenido, si no, a escribir un mensaje.
 */
export function destinoPaso(
  href: string,
  content: Pick<SiteContent, 'grupos' | 'servir'>,
  enCrecer = false,
): string {
  if (href.startsWith('#')) return enCrecer ? href : `${RUTAS.crecer}${href}`;
  if (href === '/grupos') return content.grupos ? href : CONTACTO;
  if (href === '/servir') return content.servir ? href : CONTACTO;
  return href;
}
