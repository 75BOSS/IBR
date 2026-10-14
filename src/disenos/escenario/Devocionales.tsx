import type { Devocional } from '@/disenos/contenido';

/**
 * Plan de lectura de la semana (devocionales de ejemplo), como una cartelera: angosto, una fila
 * por día; ancho, cinco columnas. El día de hoy (hora de Ecuador) va en azul marino con la
 * etiqueta «Hoy»; el fin de semana no se marca ninguno.
 */
export function Devocionales({ devocionales, hoy }: { devocionales: Devocional[]; hoy: string }) {
  return (
    <div className="@container">
      <ol className="grid gap-[clamp(0.75rem,2cqi,1rem)] @4xl:grid-cols-5">
        {devocionales.map((d) => {
          const esHoy = d.dia === hoy;
          return (
            <li
              key={d.dia}
              aria-current={esHoy ? 'date' : undefined}
              className={`d-tarjeta grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-1 rounded-2xl p-[clamp(1rem,3.5cqi,1.5rem)] @4xl:flex @4xl:flex-col @4xl:gap-2 ${
                esHoy ? 'bg-(--d-marino) text-cream on-dark' : 'bg-surface ring-1 ring-line'
              }`}
            >
              <p
                className={`row-span-3 flex flex-col gap-1 caps ${esHoy ? 'text-peach' : 'text-accent'}`}
              >
                {d.dia}
                {esHoy && (
                  <span className="w-fit rounded-full bg-accent px-2 py-0.5 text-cream">Hoy</span>
                )}
              </p>
              <p
                className={`font-serif text-[1.0625rem] italic ${esHoy ? 'text-cream/85' : 'text-ink-soft'}`}
              >
                {d.pasaje}
              </p>
              <h3
                className={`font-headline text-[clamp(1.1875rem,1.05rem+0.6cqi,1.375rem)] leading-tight font-extrabold tracking-[-0.03em] ${
                  esHoy ? 'text-cream' : 'text-ink'
                }`}
              >
                {d.titulo}
              </h3>
              <p className={esHoy ? 'text-cream/85' : 'text-ink-soft'}>{d.texto}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
