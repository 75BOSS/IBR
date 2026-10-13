/**
 * Botones de la propuesta Vibrante: rectangulares, casi sin redondeo, letra gruesa. Módulo sin
 * 'use client' para usarlo en Server y Client Components (enlaces con forma de botón).
 */
export type VarianteBoton = 'rojo' | 'crema' | 'contorno';
export type TamanoBoton = 'md' | 'lg' | 'portada';

const BASE =
  'items-center gap-[0.6em] font-bold leading-none select-none ' +
  'transition-colors motion-safe:duration-150';

const VARIANTES: Record<VarianteBoton, string> = {
  /** Acción principal sobre crema (rojo hondo: crema encima 4.6:1). */
  rojo: 'bg-accent text-canvas hover:bg-accent-strong',
  /** Acción principal sobre el rojo o el negro. */
  crema: 'bg-canvas text-ink hover:bg-sunken',
  /** Acción secundaria sobre el rojo o el negro. */
  contorno: 'border-2 border-canvas/80 text-canvas hover:bg-canvas/10',
};

// Alto mínimo de 44 px; el texto y el relleno crecen con la pantalla. Cada tamaño trae su
// alineación y su redondeo: así `className` nunca repite una propiedad que ya está aquí.
const GRANDE =
  'min-h-12 text-[clamp(1.0625rem,0.98rem+0.3vw,1.1875rem)] lg:min-h-14 lg:rounded-[0.4rem]';
const TAMANOS: Record<TamanoBoton, string> = {
  md: 'min-h-11 justify-center rounded-[0.3rem] px-[clamp(1rem,1.6vw,1.375rem)] whitespace-nowrap text-[clamp(0.9375rem,0.9rem+0.15vw,1rem)]',
  lg: `${GRANDE} justify-center rounded-[0.4rem] px-[clamp(1.25rem,2.4vw,2.25rem)]`,
  /** Acción de la portada: en el celular ocupa su columna, más redondeada, con la flecha al
      borde (imagen 6); desde tablet, como `lg`. */
  portada: `${GRANDE} w-full justify-between rounded-xl px-3.5 whitespace-nowrap xs:px-5 md:w-auto md:justify-center md:px-[clamp(1.25rem,2.4vw,2.25rem)]`,
};

export function botonClases({
  variante = 'rojo',
  tamano = 'md',
  desdeTablet = false,
  className = '',
}: {
  variante?: VarianteBoton;
  tamano?: TamanoBoton;
  /** Solo desde tablet (en el celular la propuesta no lo muestra). */
  desdeTablet?: boolean;
  className?: string;
} = {}): string {
  // El `display` va aquí y no en `className`: dos clases de display chocarían.
  const display = desdeTablet ? 'hidden md:inline-flex' : 'inline-flex';
  return `${display} ${BASE} ${VARIANTES[variante]} ${TAMANOS[tamano]} ${className}`;
}
