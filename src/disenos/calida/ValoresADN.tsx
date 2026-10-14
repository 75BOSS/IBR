import type { Valor } from '@/disenos/contenido';

/**
 * Valores del ADN (o lo que esperar el domingo): número en itálica caligráfica naranja, título
 * en serifa y texto, separados por rayas finas, no tarjetas iguales. Se acomodan por el ancho de
 * su contenedor (1, 2 o 3 columnas, o siempre una con `apilado`) y aparecen uno tras otro. Al pasar el mouse cada valor se
 * eleva sobre una superficie crema con sombra cálida.
 */
export function ValoresADN({
  valores,
  apilado = false,
}: {
  valores: Valor[];
  /** Siempre en una columna (adelanto del inicio, junto a una foto). */
  apilado?: boolean;
}) {
  return (
    <div className="@container">
      <ol
        className={`calida-escalonado grid gap-x-[clamp(1rem,3cqi,2rem)] gap-y-2 ${apilado ? '' : '@xl:grid-cols-2 @5xl:grid-cols-3'}`}
      >
        {valores.map((v, i) => (
          <li
            key={v.titulo}
            className="calida-elevar relative flex flex-col gap-2 rounded-[0.875rem] px-[clamp(0.25rem,2cqi,1.25rem)] pt-5 pb-6 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-line hover:bg-surface"
          >
            <span className="font-script text-[clamp(2rem,1.7rem+1.2vw,2.75rem)] leading-none text-accent-strong italic">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-display text-[clamp(1.375rem,1.2rem+0.8vw,1.75rem)] leading-tight text-ink">
              {v.titulo}
            </h3>
            <p className="text-[clamp(1rem,0.96rem+0.2vw,1.0625rem)] leading-normal text-ink-soft">
              {v.texto}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
