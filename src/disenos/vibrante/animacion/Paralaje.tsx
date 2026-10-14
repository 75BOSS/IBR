'use client';

import { type PointerEvent, type ReactNode, useRef } from 'react';

/**
 * Contenedor que pasa la posición del cursor a sus fotos (--px / --py, de -1 a 1): las fotos con
 * `profundidad` (Foto) se desplazan un poco, cada una a su ritmo (`.vibrante-paralaje` en
 * tema.css). Solo con mouse; con el dedo o «reducir movimiento» las fotos no se mueven.
 */
export function Paralaje({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const cuadro = useRef(0);

  const alMover = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 2;
    const y = ((e.clientY - top) / height - 0.5) * 2;
    cancelAnimationFrame(cuadro.current);
    cuadro.current = requestAnimationFrame(() => {
      el.style.setProperty('--px', x.toFixed(3));
      el.style.setProperty('--py', y.toFixed(3));
    });
  };

  const alSalir = (e: PointerEvent<HTMLDivElement>) => {
    cancelAnimationFrame(cuadro.current);
    e.currentTarget.style.setProperty('--px', '0');
    e.currentTarget.style.setProperty('--py', '0');
  };

  return (
    <div className={className} onPointerMove={alMover} onPointerLeave={alSalir}>
      {children}
    </div>
  );
}
