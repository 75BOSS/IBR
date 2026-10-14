import { DAY_NAMES, formatTime } from '@/lib/dates';
import type { SiteContent } from '@/lib/nav';

/**
 * Cálculos de texto de la propuesta (sin consultas: reciben lo que ya trae `@/disenos/datos`).
 */

/** «a», «a y b», «a, b y c». */
export function listaNatural(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

/**
 * El día principal de reunión para el titular «Domingos»: el domingo si hay culto ese día; si no,
 * el primer día con reunión. Devuelve el día en plural («Domingos», «Miércoles») y sus horas
 * («10:00» o «9:00 y 11:00»). null si aún no hay reuniones cargadas (nada se inventa).
 */
export function diaPrincipal(
  reuniones: { dia_semana: number; hora_inicio: string }[],
): { dia: string; horas: string } | null {
  const [primera] = reuniones;
  if (!primera) return null;
  const dia = reuniones.some((r) => r.dia_semana === 7) ? 7 : primera.dia_semana;
  const nombre = DAY_NAMES[dia] ?? '';
  if (!nombre) return null;
  const horas = [
    ...new Set(reuniones.filter((r) => r.dia_semana === dia).map((r) => formatTime(r.hora_inicio))),
  ].sort();
  return { dia: nombre.endsWith('s') ? nombre : `${nombre}s`, horas: listaNatural(horas) };
}

/** Raíz de la propuesta: sus páginas viven en /disenos/calida/<página>. */
export const BASE_CALIDA = '/disenos/calida';

/** Ruta de una página de la propuesta (con su ancla si la hay). */
export const rutaCalida = (pagina = '') => `${BASE_CALIDA}${pagina}`;

export type EnlaceMenu = { href: string; label: string; description?: string };
export type GrupoMenu = {
  titulo: string;
  /** Frase del panel destacado del menú desplegable. */
  resumen: string;
  foto: string;
  items: EnlaceMenu[];
};
export type MenuCalida = { grupos: GrupoMenu[]; sueltos: EnlaceMenu[]; visita: EnlaceMenu };

const si = <T>(condicion: boolean, item: T): T[] => (condicion ? [item] : []);

/**
 * Menú de la propuesta (encabezado, menú del celular y pie), como el de caminodevida.com:
 * Conócenos · Siguiente paso · Comunidad · Recursos, más Oración y Dar sueltos. Lleva a las
 * páginas de la propuesta y, del sitio original, solo a las que tienen contenido (`content`).
 * Las anclas existen solo si su sección se muestra: «En qué creemos» con creencias, «Liderazgo»
 * con equipo, Kids y Jóvenes si esos ministerios están publicados.
 */
export function menuCalida({
  content,
  ministerios,
}: {
  content: Pick<SiteContent, 'creencias' | 'equipo' | 'servir' | 'eventos' | 'dar'>;
  ministerios: { slug: string; nombre: string; nombre_ministerio: string | null }[];
}): MenuCalida {
  const ministerio = (slug: string) => ministerios.find((m) => m.slug === slug);
  const kids = ministerio('kids');
  const jovenes = ministerio('jovenes');
  return {
    grupos: [
      {
        titulo: 'Conócenos',
        resumen: 'Quiénes somos, lo que creemos y quiénes nos acompañan.',
        foto: '/fotos-ejemplo/nosotros.webp',
        items: [
          {
            href: rutaCalida('/conocenos'),
            label: 'Nosotros',
            description: 'Nuestra historia en Riobamba',
          },
          {
            href: rutaCalida('/conocenos#adn'),
            label: 'Nuestro ADN',
            description: 'Lo que nos define',
          },
          ...si(content.creencias, {
            href: rutaCalida('/conocenos#creemos'),
            label: 'En qué creemos',
            description: 'Lo esencial de nuestra fe',
          }),
          ...si(content.equipo, {
            href: rutaCalida('/conocenos#equipo'),
            label: 'Liderazgo',
            description: 'Pastores y líderes',
          }),
        ],
      },
      {
        titulo: 'Siguiente paso',
        resumen: 'Desde tu primera visita hasta servir con tus dones: caminamos contigo.',
        foto: '/disenos/calida/siguiente-paso.webp',
        items: [
          {
            href: rutaCalida('/primera-visita'),
            label: 'Primera visita',
            description: 'Qué esperar el domingo',
          },
          { href: rutaCalida('/crecer'), label: 'Crecer', description: 'Tu ruta en cinco pasos' },
          {
            href: rutaCalida('/crecer#salvacion'),
            label: 'Salvación',
            description: 'Un nuevo comienzo con Jesús',
          },
          {
            href: rutaCalida('/crecer#bautismo'),
            label: 'Bautismo',
            description: 'Da testimonio de tu fe',
          },
          {
            href: rutaCalida('/crecer#formacion'),
            label: 'Formación',
            description: 'Escuela de Discipulado',
          },
        ],
      },
      {
        titulo: 'Comunidad',
        resumen: 'Grupos en casa por todo Riobamba y un lugar para cada edad.',
        foto: '/disenos/calida/comunidad.webp',
        items: [
          {
            href: rutaCalida('/comunidad'),
            label: 'Grupos en casa',
            description: 'La vida se comparte',
          },
          {
            href: rutaCalida('/ministerios'),
            label: 'Ministerios',
            description: 'Un lugar para cada edad',
          },
          ...(kids
            ? [
                {
                  href: rutaCalida('/ministerios#kids'),
                  label: kids.nombre_ministerio ?? kids.nombre,
                  description: 'Clases bíblicas para niños',
                },
              ]
            : []),
          ...(jovenes
            ? [
                {
                  href: rutaCalida('/ministerios#jovenes'),
                  label: jovenes.nombre_ministerio ?? jovenes.nombre,
                  description: 'Una generación con propósito',
                },
              ]
            : []),
          {
            href: rutaCalida('/ministerios#mujeres'),
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
        resumen: 'Prédicas, devocionales y testimonios para acompañar tu semana.',
        foto: '/disenos/calida/predicador.webp',
        items: [
          {
            href: rutaCalida('/recursos'),
            label: 'Prédicas',
            description: 'Los mensajes de cada domingo',
          },
          {
            href: rutaCalida('/recursos#devocionales'),
            label: 'Devocionales',
            description: 'Un plan para esta semana',
          },
          {
            href: rutaCalida('/recursos#testimonios'),
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
      { href: '/oracion', label: 'Oración' },
      ...si(content.dar, { href: '/dar', label: 'Dar' }),
    ],
    visita: { href: rutaCalida('/primera-visita'), label: 'Planifica tu visita' },
  };
}

/** Destino de un paso de la ruta: las anclas son de Crecer; /grupos y /servir solo si existen. */
export function destinoPaso(
  href: string,
  content: Pick<SiteContent, 'grupos' | 'servir'>,
  enCrecer: boolean,
): string {
  if (href.startsWith('#')) return enCrecer ? href : rutaCalida(`/crecer${href}`);
  if (href === '/grupos') return content.grupos ? href : '/contacto#mensaje';
  if (href === '/servir') return content.servir ? href : '/contacto#mensaje';
  return href;
}
