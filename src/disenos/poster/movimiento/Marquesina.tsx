import { Fragment } from 'react';

const TONOS = {
  rojo: 'bg-accent text-canvas',
  tinta: 'bg-ink text-canvas',
  durazno: 'bg-(--d-durazno) text-ink',
  papel: 'bg-canvas text-ink',
} as const;

/**
 * Cinta de palabras condensadas que corre de lado a lado (decorativa: lo que dice ya está en la
 * página). La pista lleva las palabras dos veces y corre la mitad de su ancho, así el giro no se
 * nota; se repiten hasta llenar una pantalla ancha. Con «reducir movimiento» queda quieta y al
 * pasar el cursor se detiene. Se sale de su caja a propósito (`data-marquesina`).
 */
export function Marquesina({
  palabras,
  tono = 'rojo',
  alReves = false,
  className = '',
}: {
  palabras: string[];
  tono?: keyof typeof TONOS;
  alReves?: boolean;
  className?: string;
}) {
  if (palabras.length === 0) return null;
  const vueltas = Math.max(1, Math.ceil(10 / palabras.length));
  const tira = Array.from({ length: vueltas }, () => palabras).flat();
  return (
    <div
      data-marquesina
      aria-hidden="true"
      className={`overflow-hidden border-y-2 border-ink py-[clamp(0.5rem,1.4vw,0.875rem)] ${TONOS[tono]} ${className}`}
    >
      <div className={`d-marquesina-pista ${alReves ? 'd-al-reves' : ''}`}>
        {[0, 1].map((copia) => (
          <p
            key={copia}
            className="flex shrink-0 items-center font-display text-[clamp(1.5rem,1rem+2.2vw,3rem)] leading-none font-black whitespace-nowrap uppercase font-stretch-[70%]"
          >
            {tira.map((p, n) => (
              <Fragment key={n}>
                <span className="px-[0.45em]">{p}</span>
                <span className="text-[0.6em] opacity-70">✶</span>
              </Fragment>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}
