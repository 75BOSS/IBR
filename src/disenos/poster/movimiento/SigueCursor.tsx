'use client';

import { type PointerEvent, type ReactNode, useEffect, useRef } from 'react';

/**
 * Foto con una insignia redonda («Ver», «Conocer») que sigue al cursor mientras está encima.
 * La posición va en --mx/--my (en px, relativas a la caja) y se actualiza en un cuadro de
 * animación; el CSS (`.d-insignia`) solo la muestra con cursor fino y sin «reducir movimiento».
 * La insignia es decorativa: el enlace de la tarjeta ya dice a dónde lleva.
 */
export function SigueCursor({
  etiqueta,
  className = '',
  children,
}: {
  etiqueta: string;
  className?: string;
  children: ReactNode;
}) {
  const caja = useRef<HTMLDivElement>(null);
  const cuadro = useRef(0);

  useEffect(() => () => cancelAnimationFrame(cuadro.current), []);

  const mover = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(cuadro.current);
    cuadro.current = requestAnimationFrame(() => {
      const el = caja.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${Math.round(clientX - r.left)}px`);
      el.style.setProperty('--my', `${Math.round(clientY - r.top)}px`);
    });
  };

  return (
    <div ref={caja} onPointerMove={mover} className={`d-sigue ${className}`}>
      {children}
      <span
        aria-hidden="true"
        className="d-insignia size-[clamp(4.5rem,5vw,5.75rem)] place-items-center rounded-full bg-accent font-display text-[0.9375rem] font-extrabold tracking-[0.12em] text-canvas uppercase"
      >
        {etiqueta}
      </span>
    </div>
  );
}
