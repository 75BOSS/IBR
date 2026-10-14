import type { Valor } from '@/disenos/contenido';

/** Una vuelta de la marquesina; la copia que la hace continua va oculta a lectores de pantalla. */
function Vuelta({ valores, copia }: { valores: Valor[]; copia: boolean }) {
  return (
    <ul
      aria-hidden={copia || undefined}
      className="flex shrink-0 items-center gap-[clamp(1.25rem,3.5vw,2.75rem)] pr-[clamp(1.25rem,3.5vw,2.75rem)]"
    >
      {valores.map((v, i) => (
        <li
          key={v.titulo}
          className="flex items-center gap-[clamp(1.25rem,3.5vw,2.75rem)] whitespace-nowrap"
        >
          <span
            className={
              i % 2 === 0
                ? 'font-headline font-extrabold tracking-[-0.04em]'
                : 'font-serif font-semibold tracking-[-0.01em] text-(--d-rojo) italic'
            }
          >
            {v.titulo}
          </span>
          <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-(--d-rojo)" />
        </li>
      ))}
    </ul>
  );
}

/**
 * Marquesina de teatro con lo que nos define (ADN): los valores pasan despacio de derecha a
 * izquierda, alternando la sans gruesa y la serifa roja cursiva, y se detienen bajo el cursor.
 * Con «reducir movimiento» queda quieta. Se sale de su caja a propósito (`data-marquesina`).
 */
export function Marquesina({ valores }: { valores: Valor[] }) {
  return (
    <div
      data-marquesina
      className="overflow-hidden py-[clamp(1rem,2.5vw,1.5rem)] text-[clamp(1.75rem,1.2rem+2.4vw,3.25rem)] leading-tight"
    >
      <div className="d-marquesina flex w-max motion-safe:animate-[marquee_55s_linear_infinite]">
        <Vuelta valores={valores} copia={false} />
        <Vuelta valores={valores} copia />
      </div>
    </div>
  );
}
