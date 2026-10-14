import { Fragment } from 'react';
import { Icon } from '@/components/Icon';

const TONOS = {
  negro: 'bg-(--d-negro) text-canvas on-dark',
  rojo: 'bg-accent text-canvas on-dark',
} as const;

/**
 * Marquesina de palabras grandes («SOMOS FAMILIA ✦ RIOBAMBA ✦ …») que se mueve sola (solo CSS,
 * `.vibrante-marquesina-pista` en tema.css), alternando palabras llenas y de contorno. Sale de su
 * caja a propósito: el contenedor lleva `data-marquesina` y la copia que cierra el bucle va con
 * aria-hidden. Con «reducir movimiento» queda quieta; si no, el interruptor de la esquina la
 * pausa (un checkbox: funciona con teclado y sin JavaScript).
 */
export function Marquesina({
  palabras,
  tono = 'negro',
  inverso = false,
  etiqueta,
}: {
  palabras: string[];
  tono?: keyof typeof TONOS;
  inverso?: boolean;
  /** Nombre de la franja para lectores de pantalla. */
  etiqueta: string;
}) {
  const fila = (copia: boolean) => (
    <p
      aria-hidden={copia ? 'true' : undefined}
      className="flex shrink-0 items-center gap-[clamp(1rem,2.5vw,2.25rem)] pr-[clamp(1rem,2.5vw,2.25rem)] font-display text-[clamp(2.5rem,1.6rem+4.2vw,6.25rem)] leading-none font-black tracking-[-0.04em] whitespace-nowrap uppercase"
    >
      {palabras.map((palabra, i) => (
        <Fragment key={`${palabra}-${i}`}>
          <span className={i % 2 === 1 ? 'vibrante-contorno' : ''}>{palabra}</span>
          <Icon
            name="sparkle"
            className={`size-[0.45em] shrink-0 ${tono === 'rojo' ? 'text-(--d-negro)' : 'text-(--d-rojo-vivo)'}`}
          />
        </Fragment>
      ))}
    </p>
  );
  return (
    <section aria-label={etiqueta} className={`vibrante-marquesina relative ${TONOS[tono]}`}>
      <div data-marquesina className="overflow-hidden py-[clamp(1.25rem,3vw,2.25rem)]">
        <div className="vibrante-marquesina-pista" data-sentido={inverso ? 'inverso' : undefined}>
          {fila(false)}
          {fila(true)}
        </div>
      </div>
      <label className="absolute right-[clamp(0.5rem,2vw,1.25rem)] bottom-1.5 grid size-11 cursor-pointer place-items-center motion-reduce:hidden">
        <input type="checkbox" className="vibrante-marquesina-pausa peer sr-only" />
        <span
          aria-hidden="true"
          className="flex size-7 items-center justify-center gap-1 rounded-full bg-canvas/15 transition-colors peer-checked:bg-canvas peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--focus-ring) hover:bg-canvas/30 peer-checked:[&>span]:bg-ink"
        >
          <span className="h-3 w-[0.1875rem] rounded-full bg-canvas" />
          <span className="h-3 w-[0.1875rem] rounded-full bg-canvas" />
        </span>
        <span className="sr-only">Pausar el movimiento de las palabras</span>
      </label>
    </section>
  );
}
