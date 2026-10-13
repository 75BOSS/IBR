/**
 * Propuestas de diseño del sitio público (2026-10-13). Cada una vive en su propia carpeta
 * (`src/disenos/<slug>/` + `src/app/(disenos)/disenos/<slug>/`) para que, cuando la iglesia elija
 * una, esa carpeta sea la referencia y las demás se borren sin tocar nada más. «Original» es el
 * sitio actual. Este archivo lo usan el selector flotante y el índice `/disenos`.
 */

/** Páginas que una propuesta puede tener; el selector salta a la misma página del otro diseño. */
export type PaginaDiseno = 'inicio' | 'comunidad' | 'primera-visita';

export type Diseno = {
  slug: string;
  nombre: string;
  resumen: string;
  /** Imágenes de referencia en IBRWEB/Propuesta (escritorio, interior, celular). */
  referencia: string;
  paginas: Partial<Record<PaginaDiseno, string>> & { inicio: string };
};

export const NOMBRE_PAGINA: Record<PaginaDiseno, string> = {
  inicio: 'Inicio',
  comunidad: 'Comunidad',
  'primera-visita': 'Primera visita',
};

const ORIGINAL: Diseno = {
  slug: 'original',
  nombre: 'Original',
  resumen: 'El sitio actual.',
  referencia: '—',
  paginas: { inicio: '/', comunidad: '/grupos', 'primera-visita': '/soy-nuevo' },
};

export const DISENOS: Diseno[] = [
  ORIGINAL,
  {
    slug: 'calida',
    nombre: 'A · Cálida',
    resumen: 'Crema, azul marino y naranja tostado; títulos con serifa y palabra manuscrita.',
    referencia: '1 · 2 · 3',
    paginas: { inicio: '/disenos/calida', comunidad: '/disenos/calida/comunidad' },
  },
  {
    slug: 'vibrante',
    nombre: 'B · Vibrante',
    resumen: 'Rojo coral, negro y crema; letra muy gruesa y mosaico de fotos.',
    referencia: '4 · 5 · 6',
    paginas: { inicio: '/disenos/vibrante', comunidad: '/disenos/vibrante/comunidad' },
  },
  {
    slug: 'nocturna',
    nombre: 'C · Nocturna',
    resumen: 'Azul marino de fondo y durazno; foto a pantalla completa.',
    referencia: '7 · 8 · 9',
    paginas: { inicio: '/disenos/nocturna', comunidad: '/disenos/nocturna/comunidad' },
  },
  {
    slug: 'escenario',
    nombre: 'D · Escenario',
    resumen: 'Logo al centro, el auditorio a todo lo ancho y la primera visita paso a paso.',
    referencia: '10 · 11 · 12',
    paginas: {
      inicio: '/disenos/escenario',
      'primera-visita': '/disenos/escenario/primera-visita',
    },
  },
  {
    slug: 'poster',
    nombre: 'E · Póster',
    resumen: 'Menú lateral, titulares enormes en mayúsculas y grilla tipo periódico.',
    referencia: '13 · 14 · 15',
    paginas: { inicio: '/disenos/poster', comunidad: '/disenos/poster/comunidad' },
  },
];

/** Diseño y página que corresponden a una ruta (null si la ruta no es de ninguna propuesta). */
export function ubicarDiseno(pathname: string): { diseno: Diseno; pagina: PaginaDiseno | null } {
  const ruta = pathname.replace(/\/+$/, '') || '/';
  for (const diseno of DISENOS) {
    for (const [pagina, href] of Object.entries(diseno.paginas)) {
      if (href === ruta) return { diseno, pagina: pagina as PaginaDiseno };
    }
  }
  const propio = DISENOS.find(
    (d) => d.slug !== 'original' && ruta.startsWith(`/disenos/${d.slug}`),
  );
  return { diseno: propio ?? ORIGINAL, pagina: null };
}

/** A dónde lleva elegir `diseno` estando en `pagina`: la misma página si la tiene, si no su inicio. */
export function destinoDiseno(diseno: Diseno, pagina: PaginaDiseno | null): string {
  return (pagina && diseno.paginas[pagina]) || diseno.paginas.inicio;
}
