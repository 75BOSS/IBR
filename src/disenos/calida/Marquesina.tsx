'use client';

import { type ReactNode, useState } from 'react';
import { Icon } from '@/components/Icon';

/** «Pausa» (dos barras): no está en `@/components/Icon` y esta propuesta no lo modifica. */
function IconoPausa({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

/**
 * Cinta que se desliza muy despacio de derecha a izquierda (tema.css: `calida-marquesina`). Los
 * hijos son dos copias iguales del contenido, la segunda con aria-hidden: al llegar a la mitad
 * vuelve a empezar sin salto. Se detiene con el mouse encima, con el foco dentro o con el botón
 * (cumple «pausar, detener u ocultar»). Sale de su caja a propósito: `data-marquesina` (la
 * revisión de textos fuera de su caja la ignora); el recorte es `overflow: clip`, así la página no
 * se desliza de lado. Con «reducir movimiento» no se mueve: la pista pasa a una cuadrícula.
 */
export function Marquesina({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  const [pausa, setPausa] = useState(false);
  return (
    <div
      data-marquesina=""
      data-pausa={pausa ? '' : undefined}
      className="calida-marquesina flex flex-col gap-4"
    >
      <div className="overflow-clip motion-reduce:overflow-visible">
        <div className="calida-marquesina-pista flex w-max motion-reduce:grid motion-reduce:w-auto motion-reduce:grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] motion-reduce:gap-[clamp(0.875rem,1.5vw,1.25rem)]">
          {children}
        </div>
      </div>
      <button
        type="button"
        aria-pressed={pausa}
        onClick={() => setPausa((p) => !p)}
        className="calida-magnetico inline-flex min-h-11 items-center gap-2 self-center rounded-full px-4 text-[0.95rem] font-semibold text-ink ring-1 ring-line hover:bg-surface motion-reduce:hidden"
      >
        {pausa ? (
          <Icon name="play" className="size-4 fill-current text-accent-strong" />
        ) : (
          <IconoPausa className="size-4 shrink-0 text-accent-strong" />
        )}
        {pausa ? `Reanudar ${etiqueta}` : `Pausar ${etiqueta}`}
      </button>
    </div>
  );
}
