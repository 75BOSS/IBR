import type { ChurchStats } from '@/lib/stats';
import { Etiqueta } from './Etiqueta';

/**
 * Visión y misión (config): la visión como una cita grande en la itálica caligráfica sobre azul
 * noche (con la luz que sigue al mouse) y la misión sobre el panel durazno. Solo las que existen;
 * con una sola, ocupa todo el ancho.
 */
export function VisionMision({ vision, mision }: { vision: string | null; mision: string | null }) {
  if (!vision && !mision) return null;
  return (
    <div className="@container">
      <div
        className={`calida-escalonado grid gap-[clamp(1rem,2.5cqi,2rem)] ${
          vision && mision ? '@4xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]' : ''
        }`}
      >
        {vision && (
          <div
            data-luz=""
            className="calida-luz relative isolate flex flex-col justify-between gap-8 overflow-clip rounded-[0.875rem] bg-(--d-noche) p-[clamp(1.5rem,5cqi,3.5rem)] text-cream on-dark"
          >
            <Etiqueta como="h3" className="text-peach">
              Nuestra visión
            </Etiqueta>
            <p className="font-script text-[clamp(2rem,1.4rem+2.6vw,3.75rem)] leading-[1.08] text-peach italic">
              «{vision}»
            </p>
          </div>
        )}
        {mision && (
          <div className="flex flex-col justify-between gap-8 rounded-[0.875rem] bg-(--d-durazno-panel) p-[clamp(1.5rem,5cqi,3.5rem)]">
            <Etiqueta como="h3" className="text-accent-strong">
              Nuestra misión
            </Etiqueta>
            <p className="font-display text-[clamp(1.5rem,1.2rem+1.3vw,2.375rem)] leading-[1.15] text-ink">
              {mision}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * «En qué creemos» (config.nosotros_creencias): sobre azul noche, cada creencia con su número en
 * itálica durazno, el título en serifa y la explicación, en dos columnas desde tablet.
 */
export function Creencias({
  creencias,
}: {
  creencias: { titulo: string | null; texto: string }[];
}) {
  return (
    <ol className="calida-escalonado grid gap-x-[clamp(1.5rem,4vw,4rem)] md:grid-cols-2">
      {creencias.map((c, i) => (
        <li
          key={`${c.titulo ?? ''}-${i}`}
          className="grid grid-cols-[clamp(2.75rem,6vw,3.75rem)_minmax(0,1fr)] gap-x-3 border-t border-cream/15 py-[clamp(1.25rem,2.5vw,1.75rem)]"
        >
          <span className="font-script text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-none text-peach italic">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="flex min-w-0 flex-col gap-1.5">
            {c.titulo && (
              <span className="font-display text-[clamp(1.375rem,1.2rem+0.8vw,1.875rem)] leading-tight text-cream">
                {c.titulo}
              </span>
            )}
            <span className="text-[clamp(1rem,0.96rem+0.2vw,1.0625rem)] leading-normal text-cream/85">
              {c.texto}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}

const CIFRAS: { clave: keyof ChurchStats; uno: string; varios: string }[] = [
  { clave: 'grupos', uno: 'grupo en casa', varios: 'grupos en casa' },
  { clave: 'ministerios', uno: 'ministerio por edades', varios: 'ministerios por edades' },
  { clave: 'reuniones', uno: 'reunión cada semana', varios: 'reuniones cada semana' },
  { clave: 'areas', uno: 'área de servicio', varios: 'áreas de servicio' },
];

/** Cifras reales de la iglesia (solo las mayores que cero) en una franja durazno. */
export function Cifras({ cifras }: { cifras: ChurchStats }) {
  const visibles = CIFRAS.filter((c) => cifras[c.clave] > 0);
  if (visibles.length === 0) return null;
  return (
    <dl className="calida-escalonado grid grid-cols-2 gap-px overflow-clip rounded-[0.875rem] bg-(--d-raya)/40 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none">
      {visibles.map((c) => {
        const n = cifras[c.clave];
        return (
          <div
            key={c.clave}
            className="flex flex-col-reverse items-start justify-end gap-1 bg-accent-soft px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1.25rem,3vw,2.25rem)] last:odd:col-span-2 lg:last:odd:col-span-1"
          >
            <dt className="text-[clamp(0.6875rem,0.64rem+0.15vw,0.78rem)] font-bold tracking-[0.18em] text-accent-strong uppercase">
              {n === 1 ? c.uno : c.varios}
            </dt>
            <dd className="font-display text-[clamp(3rem,2.2rem+3.4vw,5.5rem)] leading-none text-ink">
              {n}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
