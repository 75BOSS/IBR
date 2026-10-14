import type { ReactNode } from 'react';
import { Inclinable } from '@/disenos/vibrante/animacion/Inclinable';
import type { Valor } from '@/disenos/contenido';

/**
 * «Nuestro ADN» (contenido.ts): la cabecera ocupa la primera columna a dos filas y los valores
 * se reparten alrededor con número grande; el primero va en rojo. `cierre` llena la última celda
 * (un enlace o una invitación). Sirve en Conócenos (los seis, sobre negro) y como adelanto en el
 * inicio (tres, sobre crema).
 */
export function ValoresAdn({
  valores,
  cabecera,
  cierre,
  oscuro = false,
}: {
  valores: Valor[];
  cabecera: ReactNode;
  cierre?: ReactNode;
  oscuro?: boolean;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      <div className="pb-[clamp(1rem,3vw,1.5rem)] md:col-span-2 lg:col-span-1 lg:row-span-2 lg:pr-[clamp(1rem,2vw,2rem)] lg:pb-0">
        {cabecera}
      </div>
      {valores.map((v, i) => {
        const primero = i === 0;
        return (
          <Inclinable
            key={v.titulo}
            cursor={null}
            grados={5}
            className={`@container flex flex-col gap-3 rounded-[0.5rem] p-[clamp(1.25rem,7cqi,2rem)] ${
              primero
                ? 'bg-accent text-canvas on-dark'
                : oscuro
                  ? 'bg-(--d-negro-hondo) text-canvas ring-1 ring-canvas/10'
                  : 'bg-surface ring-1 ring-line'
            }`}
          >
            <span
              aria-hidden="true"
              className={`font-display text-[clamp(2.75rem,20cqi,4.5rem)] leading-none font-black tracking-[-0.05em] ${
                primero ? 'text-canvas' : oscuro ? 'text-(--d-rojo-vivo)' : 'text-accent'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-display text-[clamp(1.375rem,9cqi,1.875rem)] leading-[1.02] font-black tracking-[-0.03em] text-balance">
              {v.titulo}
            </h3>
            <p
              className={`text-[clamp(0.9375rem,5cqi,1.0625rem)] leading-snug ${
                primero ? '' : oscuro ? 'text-(--d-crema-tenue)' : 'text-ink-soft'
              }`}
            >
              {v.texto}
            </p>
          </Inclinable>
        );
      })}
      {cierre}
    </div>
  );
}
