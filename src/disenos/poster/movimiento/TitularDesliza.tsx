/**
 * Titular gigante que se desplaza en horizontal mientras se hace scroll (solo CSS:
 * `animation-timeline: view()`, clase `.d-desliza`). Decorativo: repite en grande palabras que
 * la página ya dice. Sin soporte o con «reducir movimiento» queda quieto. Se sale de su caja a
 * propósito (`data-marquesina`).
 */
export function TitularDesliza({
  texto,
  alReves = false,
  hueco = false,
  className = '',
}: {
  texto: string;
  alReves?: boolean;
  /** Letras solo con contorno (para alternar con una fila rellena). */
  hueco?: boolean;
  className?: string;
}) {
  return (
    <div data-marquesina aria-hidden="true" className={`overflow-hidden ${className}`}>
      <p
        className={`d-desliza w-max font-display text-[clamp(4rem,2rem+9vw,11rem)] leading-[0.82] font-black whitespace-nowrap uppercase font-stretch-[68%] ${
          alReves ? 'd-al-reves' : ''
        } ${hueco ? 'text-transparent [-webkit-text-stroke:2px_var(--color-ink)]' : ''}`}
      >
        {texto}
      </p>
    </div>
  );
}
