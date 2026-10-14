'use client';

import { type ReactNode, useState } from 'react';
import { cssVars } from '@/lib/css-vars';

export type Pestana = {
  clave: string;
  etiqueta: string;
  /** Etiqueta para la barra angosta (celular), si la larga no cabe («Mié» por «Miércoles»). */
  corta?: string;
  contenido: ReactNode;
};

/**
 * Pestañas que filtran (Comunidad: Todos · Grupos · Familias · Servicio; Recursos: la semana de
 * devocionales). Son botones con `aria-pressed` y un bloque rojo que se desliza hasta la elegida
 * (`.d-indicador`, posición en --pestana). El contenido llega dibujado desde el servidor; la
 * primera opción («Todos») muestra todo, así sin JavaScript no se oculta nada. Con una sola
 * opción no hay qué filtrar y la barra no se muestra.
 */
export function Pestanas({
  opciones,
  todos = 'Todos',
  etiqueta,
  claseLista = 'flex flex-col',
  claseItem = 'border-b border-ink',
}: {
  opciones: Pestana[];
  todos?: string;
  /** Nombre del grupo de botones para el lector de pantalla («Ver por tipo»). */
  etiqueta: string;
  claseLista?: string;
  claseItem?: string;
}) {
  const [activa, setActiva] = useState<string | null>(null);
  const botones: { clave: string | null; etiqueta: string; corta?: string }[] = [
    { clave: null, etiqueta: todos },
    ...opciones,
  ];
  const indice = Math.max(
    0,
    botones.findIndex((b) => b.clave === activa),
  );
  const elegida = opciones.find((o) => o.clave === activa);

  return (
    <div className="flex flex-col gap-1">
      {opciones.length > 1 && (
        <div
          role="group"
          aria-label={etiqueta}
          style={cssVars({ '--pestana': String(indice), '--pestanas': String(botones.length) })}
          className="@container relative isolate grid auto-cols-fr grid-flow-col border-2 border-ink"
        >
          <span
            aria-hidden="true"
            className="d-indicador absolute inset-y-0 left-0 -z-10 bg-accent"
          />
          {botones.map((b) => {
            const pulsada = activa === b.clave;
            return (
              <button
                key={b.etiqueta}
                type="button"
                aria-pressed={pulsada}
                onClick={() => setActiva(b.clave)}
                className={`min-h-[clamp(2.75rem,2.2rem+1.4vw,3.5rem)] min-w-0 border-l-2 border-ink px-1 font-display text-[clamp(0.8125rem,0.7rem+0.5vw,1.25rem)] leading-tight font-bold font-stretch-[88%] transition-colors first:border-l-0 ${
                  pulsada ? 'text-canvas on-dark' : 'text-ink hover:bg-sunken'
                }`}
              >
                {b.corta ? (
                  <>
                    <span aria-hidden="true" className="@xl:hidden">
                      {b.corta}
                    </span>
                    <span className="sr-only @xl:not-sr-only">{b.etiqueta}</span>
                  </>
                ) : (
                  b.etiqueta
                )}
              </button>
            );
          })}
        </div>
      )}
      <p aria-live="polite" className="sr-only">
        {elegida ? `Mostrando solo ${elegida.etiqueta.toLowerCase()}` : ''}
      </p>
      <ul className={claseLista}>
        {opciones.map((o) => (
          <li key={o.clave} hidden={activa !== null && activa !== o.clave} className={claseItem}>
            {o.contenido}
          </li>
        ))}
      </ul>
    </div>
  );
}
