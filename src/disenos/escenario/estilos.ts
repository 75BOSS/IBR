/**
 * Botones de la propuesta D · Escenario (una sola fuente para no repetir cadenas de clases).
 * - `rojo`: píldora roja con texto crema (llamadas a la acción; AA 4.5:1).
 * - `portada`: el de la portada. En celular, la píldora roja (imagen 12); en escritorio, el botón
 *   crema de esquinas suaves con texto azul marino (imagen 10).
 * - `cabecera`: «Visítanos» del encabezado claro (imagen 11).
 * Llevan `group` para que la flecha se mueva al pasar el mouse.
 */
const BASE =
  'group inline-flex items-center justify-center gap-2.5 font-display font-bold transition duration-200 ease-(--ease-out-soft)';

const ROJO = `${BASE} min-h-12 rounded-full bg-accent px-[clamp(1.5rem,4vw,2.25rem)] text-[clamp(1rem,0.95rem+0.2vw,1.125rem)] text-cream hover:bg-accent-strong`;

const ESTILOS = {
  rojo: ROJO,
  portada: `${ROJO} lg:min-h-[3.75rem] lg:rounded-2xl lg:bg-cream lg:px-12 lg:text-xl lg:text-ink lg:hover:bg-surface`,
  cabecera: `${BASE} min-h-10 rounded-[0.625rem] bg-accent px-5 text-[0.95rem] text-cream hover:bg-accent-strong`,
} as const;

export function claseBoton(tono: keyof typeof ESTILOS): string {
  return ESTILOS[tono];
}

/** Flecha que acompaña a un botón o enlace: avanza un poco al pasar el mouse. */
export const FLECHA = 'size-5 shrink-0 transition-transform motion-safe:group-hover:translate-x-1';

/** Enlace o botón del menú de escritorio (Conócenos, Conéctate… y «Visítanos» en la portada). */
export function claseEnlaceMenu(tono: 'oscuro' | 'claro'): string {
  return `inline-flex min-h-11 items-center gap-1.5 rounded-lg font-display text-[1.0625rem] font-semibold transition-colors ${
    tono === 'oscuro' ? 'text-cream hover:text-cream/75' : 'text-ink hover:text-accent'
  }`;
}
