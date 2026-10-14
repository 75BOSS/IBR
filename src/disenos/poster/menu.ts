import type { SiteContent } from '@/lib/nav';
import {
  RUTA_COMUNIDAD,
  RUTA_CONOCENOS,
  RUTA_CRECER,
  RUTA_INICIO,
  RUTA_MINISTERIOS,
  RUTA_PRIMERA_VISITA,
  RUTA_RECURSOS,
} from './enlaces';
import type { IconoPosterNombre } from './IconoPoster';

export type ItemMenu = { href: string; etiqueta: string; descripcion?: string };
export type GrupoMenu = { titulo: string; icono: IconoPosterNombre; items: ItemMenu[] };
export type SueltoMenu = ItemMenu & { icono: IconoPosterNombre };

export type MenuPoster = {
  inicio: SueltoMenu;
  grupos: GrupoMenu[];
  sueltos: SueltoMenu[];
  visita: ItemMenu;
};

/**
 * Menú de la propuesta (como el de caminodevida.com): Conócenos · Siguiente paso · Comunidad ·
 * Recursos, más Oración y Dar sueltos y «Planifica tu visita». Lo usan el menú lateral, el menú
 * del celular y el pie. Las anclas apuntan a secciones que existen en las páginas de la
 * propuesta, y cada enlace a una página del sitio original solo aparece si esa página tiene
 * contenido (`content`); Kids y Jóvenes, solo si existen esos ministerios.
 */
export function menuPoster(content: SiteContent, ministerios: { slug: string }[]): MenuPoster {
  const hay = (slug: string) => ministerios.some((m) => m.slug === slug);
  const si = <T>(condicion: boolean, item: T): T[] => (condicion ? [item] : []);

  return {
    inicio: { href: RUTA_INICIO, etiqueta: 'Inicio', icono: 'home' },
    grupos: [
      {
        titulo: 'Conócenos',
        icono: 'users',
        items: [
          { href: RUTA_CONOCENOS, etiqueta: 'Nosotros', descripcion: 'Historia, visión y misión' },
          {
            href: `${RUTA_CONOCENOS}#adn`,
            etiqueta: 'Nuestro ADN',
            descripcion: 'Lo que nos define',
          },
          ...si(content.creencias, {
            href: `${RUTA_CONOCENOS}#creemos`,
            etiqueta: 'En qué creemos',
            descripcion: 'Nuestra fe en pocas palabras',
          }),
          ...si(content.equipo, {
            href: `${RUTA_CONOCENOS}#equipo`,
            etiqueta: 'Liderazgo',
            descripcion: 'Pastores y líderes',
          }),
        ],
      },
      {
        titulo: 'Siguiente paso',
        icono: 'sparkle',
        items: [
          {
            href: RUTA_PRIMERA_VISITA,
            etiqueta: 'Primera visita',
            descripcion: 'Qué esperar el domingo',
          },
          { href: RUTA_CRECER, etiqueta: 'Crecer', descripcion: 'Tu ruta en cinco pasos' },
          {
            href: `${RUTA_CRECER}#bautismo`,
            etiqueta: 'Bautismo',
            descripcion: 'Da el paso público',
          },
          {
            href: `${RUTA_CRECER}#salvacion`,
            etiqueta: 'Salvación',
            descripcion: 'Un nuevo comienzo',
          },
          {
            href: `${RUTA_CRECER}#formacion`,
            etiqueta: 'Formación',
            descripcion: 'Escuela de Discipulado',
          },
        ],
      },
      {
        titulo: 'Comunidad',
        icono: 'corazon',
        items: [
          { href: RUTA_COMUNIDAD, etiqueta: 'Grupos en casa', descripcion: 'Cerca de tu barrio' },
          {
            href: RUTA_MINISTERIOS,
            etiqueta: 'Ministerios',
            descripcion: 'Un lugar para cada edad',
          },
          ...si(hay('kids'), { href: `${RUTA_MINISTERIOS}#kids`, etiqueta: 'Kids' }),
          ...si(hay('jovenes'), { href: `${RUTA_MINISTERIOS}#jovenes`, etiqueta: 'Jóvenes' }),
          { href: `${RUTA_MINISTERIOS}#mujeres`, etiqueta: 'Mujeres' },
          ...si(content.servir, {
            href: '/servir',
            etiqueta: 'Servir',
            descripcion: 'Usa tus dones en un equipo',
          }),
        ],
      },
      {
        titulo: 'Recursos',
        icono: 'playCirculo',
        items: [
          { href: RUTA_RECURSOS, etiqueta: 'Prédicas', descripcion: 'Los mensajes del domingo' },
          {
            href: `${RUTA_RECURSOS}#devocionales`,
            etiqueta: 'Devocionales',
            descripcion: 'Un pasaje para cada día',
          },
          {
            href: `${RUTA_RECURSOS}#testimonios`,
            etiqueta: 'Testimonios',
            descripcion: 'Historias de la familia',
          },
          ...si(content.eventos, {
            href: '/eventos',
            etiqueta: 'Eventos',
            descripcion: 'Lo que viene en la iglesia',
          }),
        ],
      },
    ],
    sueltos: [
      { href: '/oracion', etiqueta: 'Oración', icono: 'handHeart' },
      ...si(content.dar, { href: '/dar', etiqueta: 'Dar', icono: 'heartHandshake' as const }),
    ],
    visita: { href: RUTA_PRIMERA_VISITA, etiqueta: 'Planifica tu visita' },
  };
}
