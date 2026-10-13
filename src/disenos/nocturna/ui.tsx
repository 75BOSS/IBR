import Image from 'next/image';
import type { ReactNode } from 'react';

/*
 * Piezas visuales de la propuesta C · Nocturna. Todo lo que se repite (contenedor, botones
 * píldora, etiquetas, aros de íconos) sale de aquí para no copiar cadenas de clases.
 */

/** Páginas propias de la propuesta (el resto del menú lleva a las páginas del sitio). */
export const RUTAS = { inicio: '/disenos/nocturna', comunidad: '/disenos/nocturna/comunidad' };

/** Ancho de página: 16 px de margen en 360 y 56 px en 1536 (la barra y el collage de la imagen 7). */
export const CONTENEDOR = 'mx-auto w-full max-w-[96rem] px-[clamp(1rem,3.65vw,3.5rem)]';

/**
 * La itálica con serifa de la propuesta para frases cortas fuera de un título (la visión del pie,
 * la serie de una prédica). No es la utilidad `font-script` del tema: esa la deja derecha.
 */
export const CURSIVA = 'font-[family-name:var(--font-script)] font-medium italic';

type TonoPildora =
  'durazno' | 'naranja' | 'marino' | 'contornoClaro' | 'contornoOscuro' | 'contornoMixto';
type TamanoPildora = 'sm' | 'md' | 'lg';

const TONOS: Record<TonoPildora, string> = {
  durazno: 'bg-(--d-durazno) text-ink hover:bg-(--d-durazno-fuerte)',
  naranja: 'bg-accent text-cream hover:bg-accent-strong',
  marino: 'bg-brand text-cream hover:bg-brand-strong',
  contornoClaro: 'border-2 border-peach/80 text-cream hover:bg-cream/10',
  contornoOscuro: 'border-[1.5px] border-ink text-ink hover:bg-ink/5',
  /** Sección azul en celular y crema en escritorio («Personas como tú»). */
  contornoMixto:
    'border-2 border-peach/80 text-cream hover:bg-cream/10 lg:border-[1.5px] lg:border-ink lg:text-ink lg:hover:bg-ink/5',
};

// Alto mínimo de 44 px en táctil; texto y relleno crecen con la pantalla.
const TAMANOS: Record<TamanoPildora, string> = {
  sm: 'min-h-10 px-[clamp(1rem,0.6rem+1vw,1.875rem)] text-[0.9375rem]',
  md: 'min-h-12 px-[clamp(1.25rem,0.9rem+1vw,2.125rem)] text-[clamp(0.9375rem,0.88rem+0.2vw,1rem)]',
  lg: 'min-h-[clamp(3rem,2.5rem+1.1vw,3.625rem)] px-[clamp(1.375rem,0.9rem+1.3vw,2.375rem)] text-[clamp(1rem,0.92rem+0.32vw,1.1875rem)]',
};

/** Botón píldora de la propuesta (enlaces con forma de botón: todas las llamadas a la acción). */
export function pildora({
  tono,
  tamano = 'md',
  className = '',
}: {
  tono: TonoPildora;
  tamano?: TamanoPildora;
  className?: string;
}): string {
  return [
    'inline-flex items-center justify-center gap-3 rounded-full font-display font-semibold leading-none transition-colors motion-safe:duration-150',
    TONOS[tono],
    TAMANOS[tamano],
    className,
  ].join(' ');
}

/** Versalitas espaciadas con una raya delante («— UNA COMUNIDAD REAL»). El color lo da quien la usa. */
export function Etiqueta({
  children,
  raya = true,
  className = '',
}: {
  children: ReactNode;
  raya?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-[0.9rem] font-display text-[0.6875rem] font-semibold tracking-[0.24em] uppercase ${
        raya ? 'before:h-px before:w-[clamp(1.75rem,1.2rem+1.2vw,2.5rem)] before:bg-current' : ''
      } ${className}`}
    >
      {children}
    </p>
  );
}

/** Aro de contorno con un ícono dentro (barra de la portada, «Ver mensaje», redes del pie). */
export function Aro({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full border-[1.5px] border-current ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * Frase distinta en celular y en escritorio (la propuesta usa textos distintos en la imagen 9 y
 * en la 7). Solo se muestra —y se lee— una: la otra queda con display: none.
 */
export function Alterna({ movil, escritorio }: { movil: ReactNode; escritorio: ReactNode }) {
  return (
    <>
      <span className="lg:hidden">{movil}</span>
      <span className="hidden lg:inline">{escritorio}</span>
    </>
  );
}

/** Aviso para lectores de pantalla en los enlaces que abren otra pestaña. */
export function PestanaNueva({ que = 'se abre' }: { que?: string }) {
  return <span className="sr-only"> ({que} en una pestaña nueva)</span>;
}

/**
 * Foto provisional recortada de la propuesta (public/disenos/nocturna). Llena su caja: el tamaño
 * y la forma los da `className`; `sizes` dice qué ancho ocupa para no bajar una foto de más.
 */
export function Foto({
  src,
  alt = '',
  sizes,
  className = '',
  encuadre = 'object-center',
  prioridad = false,
  capa = false,
}: {
  src: string;
  alt?: string;
  sizes: string;
  className?: string;
  /** Qué parte de la foto se ve cuando se recorta (object-position). */
  encuadre?: string;
  prioridad?: boolean;
  /** Capa de fondo posicionada por quien la usa (absolute) en vez de una caja en el flujo. */
  capa?: boolean;
}) {
  return (
    <div className={`${capa ? 'absolute' : 'relative'} overflow-hidden ${className}`}>
      <Image
        src={`/disenos/nocturna/${src}`}
        alt={alt}
        fill
        sizes={sizes}
        priority={prioridad}
        className={`object-cover ${encuadre}`}
      />
    </div>
  );
}
