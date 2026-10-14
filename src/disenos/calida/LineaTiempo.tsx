import type { Hito } from '@/disenos/contenido';

/**
 * Historia como línea de tiempo vertical: el año grande en serifa naranja, el título y el texto.
 * La línea naranja se dibuja con el scroll hasta la mitad de la pantalla y cada punto se enciende
 * cuando la punta lo alcanza (tema.css: `calida-linea`, `calida-punto`). Sin soporte o con
 * «reducir movimiento», la línea está entera y los puntos encendidos.
 */
export function LineaTiempo({ hitos }: { hitos: Hito[] }) {
  return (
    <div className="relative [--riel:clamp(2.5rem,6vw,4rem)]">
      <span
        aria-hidden="true"
        className="absolute top-3 bottom-3 left-[calc(var(--riel)/2_-_1px)] w-0.5 rounded-full bg-line"
      />
      <span
        aria-hidden="true"
        className="calida-linea absolute top-3 bottom-3 left-[calc(var(--riel)/2_-_1px)] w-0.5 rounded-full bg-accent"
      />
      <ol className="relative flex flex-col gap-[clamp(2rem,4.5vw,3.25rem)] pl-(--riel)">
        {hitos.map((h) => (
          <li key={h.anio} className="calida-aparece relative flex flex-col gap-1.5">
            <span
              aria-hidden="true"
              className="calida-punto absolute top-[clamp(0.85rem,1.6vw,1.25rem)] left-[calc(var(--riel)/-2_-_0.5rem)] size-4 rounded-full border-2 border-accent bg-accent ring-4 ring-canvas"
            />
            <p className="font-display text-[clamp(2.25rem,1.8rem+2vw,3.5rem)] leading-none text-accent-strong">
              {h.anio}
            </p>
            <h3 className="font-display text-[clamp(1.375rem,1.2rem+0.8vw,1.875rem)] leading-tight text-ink">
              {h.titulo}
            </h3>
            <p className="max-w-[34rem] text-[clamp(1rem,0.96rem+0.25vw,1.125rem)] leading-normal text-ink-soft">
              {h.texto}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
