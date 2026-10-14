'use client';

import { type PointerEvent, type ReactNode, useEffect, useRef } from 'react';

/**
 * Envuelve un bloque con un `TituloImpreso` y corre su copia durazno hacia el cursor (como un
 * póster mal registrado). Pone --dx/--dy (de -1 a 1, según dónde está el cursor en el bloque)
 * en un cuadro de animación; al salir vuelven a 0 y la copia regresa a su corrimiento leve. Solo
 * con mouse: en el celular no hay cursor y la copia queda fija.
 */
export function Desregistro({
  className = '',
  children,
}: {
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
      el.style.setProperty('--dx', (((clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      el.style.setProperty('--dy', (((clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
  };

  const salir = () => {
    cancelAnimationFrame(cuadro.current);
    caja.current?.style.setProperty('--dx', '0');
    caja.current?.style.setProperty('--dy', '0');
  };

  return (
    <div ref={caja} onPointerMove={mover} onPointerLeave={salir} className={className}>
      {children}
    </div>
  );
}
