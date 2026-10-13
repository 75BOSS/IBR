'use client';

import { type ReactNode, useState } from 'react';

export type CategoriaComunidad = { clave: string; etiqueta: string; fila: ReactNode };

/**
 * Pestañas Todos · Grupos · Familias · Servicio de la imagen 14: botones con `aria-pressed` que
 * dejan ver solo la fila elegida (la activa en rojo). Las filas llegan dibujadas desde el
 * servidor; sin JavaScript se ven todas («Todos»). Con una sola categoría no hay qué filtrar y
 * las pestañas no se muestran.
 */
export function FiltroComunidad({ categorias }: { categorias: CategoriaComunidad[] }) {
  const [activa, setActiva] = useState<string | null>(null);
  const opciones: { clave: string | null; etiqueta: string }[] = [
    { clave: null, etiqueta: 'Todos' },
    ...categorias,
  ];
  const elegida = categorias.find((c) => c.clave === activa);

  return (
    <div className="flex flex-col gap-1">
      {categorias.length > 1 && (
        <div
          role="group"
          aria-label="Ver por tipo"
          className="grid auto-cols-fr grid-flow-col border-2 border-ink"
        >
          {opciones.map((o) => {
            const pulsada = activa === o.clave;
            return (
              <button
                key={o.etiqueta}
                type="button"
                aria-pressed={pulsada}
                onClick={() => setActiva(o.clave)}
                className={`min-h-[clamp(2.75rem,2.2rem+1.4vw,3.5rem)] border-l-2 border-ink px-1 font-display text-[clamp(0.875rem,0.75rem+0.5vw,1.25rem)] font-bold font-stretch-[92%] transition-colors first:border-l-0 ${
                  pulsada ? 'bg-accent text-canvas on-dark' : 'text-ink hover:bg-sunken'
                }`}
              >
                {o.etiqueta}
              </button>
            );
          })}
        </div>
      )}
      <p aria-live="polite" className="sr-only">
        {elegida ? `Mostrando solo ${elegida.etiqueta.toLowerCase()}` : ''}
      </p>
      <ul className="flex flex-col">
        {categorias.map((c) => (
          <li
            key={c.clave}
            hidden={activa !== null && activa !== c.clave}
            className="border-b border-ink"
          >
            {c.fila}
          </li>
        ))}
      </ul>
    </div>
  );
}
