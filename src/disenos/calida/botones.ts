/**
 * Botones píldora de la propuesta (módulo sin 'use client': sirve en Server y Client Components).
 * naranja: la acción principal («Planifica tu visita»); contorno: la secundaria sobre crema
 * («Ver prédicas»); contornoClaro: la secundaria sobre azul marino. Alto mínimo 44–52 px.
 */
const BASE =
  'inline-flex items-center justify-center gap-3 rounded-full leading-none whitespace-nowrap transition-colors motion-safe:duration-150';

const VARIANTES = {
  naranja: 'bg-accent font-sans font-semibold text-cream hover:bg-accent-strong',
  /** En serifa, como «Ver prédicas» en la imagen 1. */
  contorno: 'border-[1.5px] border-ink font-display text-ink hover:bg-ink/5',
  contornoClaro:
    'border-[1.5px] border-cream/75 font-sans font-semibold text-cream hover:bg-cream/10',
};

const TAMANOS = {
  grande:
    'min-h-[clamp(3rem,2.8rem+0.6vw,3.3rem)] px-[clamp(1.25rem,1rem+0.9vw,2.25rem)] text-[clamp(1rem,0.95rem+0.25vw,1.125rem)]',
  encabezado: 'min-h-12 px-[clamp(1.25rem,0.8rem+1vw,2rem)] text-base',
  /** Con un ícono redondo al inicio (▶ «Ver la prédica más reciente»): poco margen a la izquierda. */
  conIcono:
    'min-h-12 pr-[clamp(1.125rem,1rem+0.5vw,1.6rem)] pl-2 text-[clamp(0.95rem,0.92rem+0.15vw,1rem)]',
  normal:
    'min-h-11 px-[clamp(1.125rem,1rem+0.5vw,1.6rem)] text-[clamp(0.95rem,0.92rem+0.15vw,1rem)]',
};

export function botonCalida(
  variante: keyof typeof VARIANTES = 'naranja',
  tamano: keyof typeof TAMANOS = 'grande',
  className = '',
): string {
  return `${BASE} ${VARIANTES[variante]} ${TAMANOS[tamano]} ${className}`;
}
