import type { ReactNode } from 'react';
import { Paralaje } from '@/disenos/vibrante/animacion/Paralaje';
import { Foto } from '@/disenos/vibrante/Foto';
import type { FotoVibrante } from '@/disenos/vibrante/fotos';
import { Titular } from '@/disenos/vibrante/Titular';
import { cssVars } from '@/lib/css-vars';

const FONDOS = {
  crema: { seccion: '', raya: 'bg-accent', etiqueta: 'text-accent' },
  rojo: { seccion: 'bg-accent text-canvas on-dark', raya: 'bg-canvas', etiqueta: '' },
  negro: {
    seccion: 'bg-(--d-negro) text-canvas on-dark',
    raya: 'bg-(--d-rojo-vivo)',
    etiqueta: '',
  },
} as const;

const ANGOSTAS = /[iljíìIJ.,;:!¡'’]/;
const MEDIAS = /[tfr]/;
const ANCHAS = /[mwMW]/;
const REDONDAS = /[QOGCDÓ]/;

/**
 * Ancho aproximado de un texto en «em» del titular: Figtree 900 apretada (medida en «La vida se»
 * y «Quiénes») o, con `italica`, la Playfair de la palabra destacada (que va a 1.08em).
 */
function anchoEm(texto: string, italica: boolean): number {
  let ancho = 0;
  for (const letra of texto) {
    if (letra === ' ') ancho += italica ? 0.25 : 0.22;
    else if (ANGOSTAS.test(letra)) ancho += italica ? 0.27 : 0.28;
    else if (MEDIAS.test(letra)) ancho += italica ? 0.34 : 0.38;
    else if (ANCHAS.test(letra)) ancho += italica ? 0.74 : 0.86;
    else if (REDONDAS.test(letra)) ancho += 0.74;
    else if (letra !== letra.toLowerCase()) ancho += 0.66;
    else ancho += italica ? 0.48 : 0.52;
  }
  return ancho;
}

/**
 * La línea más ancha del titular, en em. El tamaño de letra se calcula con ella (variable
 * --ancho) para que llene la columna sin salirse, sea «La vida se» o «Quiénes».
 */
function anchoTitular(lineas: string[], enfasis: string): string {
  return Math.max(...lineas.map((l) => anchoEm(l, false)), anchoEm(enfasis, true)).toFixed(2);
}

/**
 * Portada de las páginas interiores (imagen 5): titular gigante con la última línea en itálica
 * roja (entra por líneas al abrir la página), una raya y la frase; a la derecha, el mosaico de
 * tres fotos de borde a borde, que se desplazan un poco con el cursor. En celular y tablet el
 * mosaico va debajo. Fondo crema (como Comunidad), rojo o negro para dar ritmo entre páginas.
 */
export function PortadaPagina({
  id,
  etiqueta,
  lineas,
  enfasis,
  texto,
  fotos,
  fondo = 'crema',
  acciones,
}: {
  /** id del h1 (aria-labelledby de la sección). */
  id: string;
  etiqueta?: string;
  /** Líneas en la sans gruesa («La vida se»). */
  lineas: string[];
  /** Última línea, en itálica («comparte.»). */
  enfasis: string;
  texto: ReactNode;
  fotos: readonly [FotoVibrante, FotoVibrante, FotoVibrante];
  fondo?: keyof typeof FONDOS;
  acciones?: ReactNode;
}) {
  const tono = FONDOS[fondo];
  return (
    <section
      aria-labelledby={id}
      data-cursor-claro={fondo === 'rojo' ? '' : undefined}
      className={`grid lg:min-h-[clamp(24rem,25.4vw,34rem)] lg:grid-cols-[minmax(0,39fr)_minmax(0,61fr)] ${tono.seccion}`}
    >
      <div
        style={cssVars({ '--ancho': anchoTitular(lineas, enfasis) })}
        className={`@container flex flex-col justify-center gap-[clamp(1.25rem,4cqi,1.75rem)] py-[clamp(2.5rem,8vw,3.5rem)] pr-[clamp(1rem,3.9vw,2rem)] pl-[clamp(1rem,3.9vw,3.75rem)] lg:py-10 ${
          fondo === 'negro' ? '[--title-em:var(--d-rojo-vivo)]' : ''
        }`}
      >
        {etiqueta && <p className={`eyebrow ${tono.etiqueta}`}>{etiqueta}</p>}
        <Titular
          as="h1"
          id={id}
          tamano="libre"
          entrada="carga"
          lineas={[...lineas, <em key="enfasis">{enfasis}</em>]}
          className="text-[length:clamp(2.5rem,calc(95cqi/var(--ancho)),7.5rem)] leading-[0.9] [--em-escala:1.08em] lg:text-[length:min(23cqi,calc(95cqi/var(--ancho)))]"
        />
        <span aria-hidden="true" className={`h-[3px] w-[clamp(2rem,8cqi,2.75rem)] ${tono.raya}`} />
        <p className="max-w-[44ch] text-[clamp(1.0625rem,0.95rem+0.4vw,1.25rem)] leading-snug">
          {texto}
        </p>
        {acciones && <div className="flex flex-wrap gap-3 pt-1">{acciones}</div>}
      </div>
      <Paralaje className="grid aspect-[16/10] grid-cols-[minmax(0,645fr)_minmax(0,284fr)] grid-rows-[225fr_156fr] gap-1.5 overflow-hidden lg:aspect-auto">
        <Foto
          foto={fotos[0]}
          prioridad
          profundidad={1}
          sizes="(min-width: 64rem) 42vw, 68vw"
          className="row-span-2"
        />
        <Foto foto={fotos[1]} prioridad profundidad={2} sizes="(min-width: 64rem) 19vw, 31vw" />
        <Foto foto={fotos[2]} profundidad={3} sizes="(min-width: 64rem) 19vw, 31vw" />
      </Paralaje>
    </section>
  );
}
