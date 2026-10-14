'use client';

import { type ElementType, type PointerEvent, type ReactNode, useRef } from 'react';

/**
 * Tarjeta que se inclina en 3D siguiendo el cursor, con un brillo donde está el puntero
 * (`.vibrante-tilt` en tema.css lee --rx, --ry, --gx y --gy). Solo con mouse: con el dedo o con
 * «reducir movimiento» la tarjeta se queda quieta (el CSS solo inclina con hover fino). Lleva
 * `data-cursor` para que el cursor propio crezca con «Ver».
 */
export function Inclinable({
  as: Tag = 'div',
  className = '',
  cursor = 'Ver',
  grados = 7,
  children,
}: {
  as?: ElementType;
  className?: string;
  /** Inclinación máxima hacia cada lado (las tarjetas anchas, menos). */
  grados?: number;
  /** Palabra del cursor propio al pasar por encima; null = sin palabra. */
  cursor?: string | null;
  children: ReactNode;
}) {
  const cuadro = useRef(0);

  const alMover = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    cancelAnimationFrame(cuadro.current);
    cuadro.current = requestAnimationFrame(() => {
      el.dataset.activo = '';
      el.style.setProperty('--ry', `${((x - 0.5) * 2 * grados).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${((0.5 - y) * 2 * grados).toFixed(2)}deg`);
      el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
      el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
    });
  };

  const alSalir = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    cancelAnimationFrame(cuadro.current);
    delete el.dataset.activo;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <Tag
      className={`vibrante-tilt ${className}`}
      data-cursor={cursor ?? undefined}
      onPointerMove={alMover}
      onPointerLeave={alSalir}
    >
      {children}
    </Tag>
  );
}
