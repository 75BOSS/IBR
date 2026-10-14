/**
 * Botones de la propuesta Póster: rectángulos de esquina casi recta, letra del titular
 * condensada y flecha. Una sola definición para las páginas (sirve en servidor y en cliente).
 * - `rojo`: la acción principal («Planifica tu visita»); al pasar, azul marino.
 * - `tinta`: azul marino sobre papel; al pasar, rojo.
 * - `contorno`: borde azul marino («Empieza aquí»); al pasar se rellena.
 * - `crema`: papel sobre un bloque oscuro o rojo («Cómo llegar»).
 * Lleva `group` para que su `.d-flecha` avance al pasar.
 */
const BASE =
  'group inline-flex min-h-12 w-fit items-center justify-center gap-[0.55em] rounded-[0.2rem] px-[1.1em] py-[0.6em] text-center font-display text-[clamp(1rem,0.92rem+0.35vw,1.25rem)] leading-tight font-bold font-stretch-[90%] transition-colors';

const TONOS = {
  rojo: 'bg-accent text-canvas on-dark hover:bg-ink',
  tinta: 'bg-ink text-canvas on-dark hover:bg-accent',
  contorno: 'border-2 border-ink text-ink hover:bg-ink hover:text-canvas',
  crema: 'bg-canvas text-ink hover:bg-(--d-durazno)',
} as const;

export type TonoBoton = keyof typeof TONOS;

export function botonPoster(tono: TonoBoton = 'rojo', extra = ''): string {
  return `${BASE} ${TONOS[tono]} ${extra}`;
}
