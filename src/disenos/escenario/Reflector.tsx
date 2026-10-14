'use client';

import { useEffect, useRef } from 'react';

/** Cuánto se acerca la luz al cursor en cada cuadro: menos de 1 la hace seguirlo con retraso. */
const SUAVIDAD = 0.14;

/**
 * Reflector de teatro que sigue al cursor sobre la sección que lo contiene (la portada, las
 * bandas azul marino). Solo con mouse o trackpad y movimiento permitido: en el celular no se
 * monta el seguimiento y la capa queda invisible. La posición se pasa como variables CSS
 * (--mx/--my) en cada cuadro de animación; el dibujo vive en la clase `d-reflector`.
 * La sección debe ser `relative isolate`; la capa va detrás del texto (-z-10).
 */
export function Reflector() {
  const capa = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const luz = capa.current;
    const zona = luz?.parentElement;
    if (!luz || !zona) return;
    const conCursor = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    if (!conCursor.matches) return;

    let cuadro = 0;
    const destino = { x: 0, y: 0 };
    const actual = { x: 0, y: 0 };
    let primera = true;

    const pintar = () => {
      actual.x += (destino.x - actual.x) * SUAVIDAD;
      actual.y += (destino.y - actual.y) * SUAVIDAD;
      luz.style.setProperty('--mx', `${actual.x.toFixed(1)}px`);
      luz.style.setProperty('--my', `${actual.y.toFixed(1)}px`);
      const lejos = Math.abs(destino.x - actual.x) + Math.abs(destino.y - actual.y) > 0.5;
      cuadro = lejos ? requestAnimationFrame(pintar) : 0;
    };

    const mover = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const caja = zona.getBoundingClientRect();
      destino.x = e.clientX - caja.left;
      destino.y = e.clientY - caja.top;
      if (primera) {
        // La luz se enciende donde está el cursor, no viaja desde una esquina.
        actual.x = destino.x;
        actual.y = destino.y;
        primera = false;
      }
      luz.dataset.activo = '';
      if (!cuadro) cuadro = requestAnimationFrame(pintar);
    };
    const salir = () => {
      delete luz.dataset.activo;
      primera = true;
    };

    zona.addEventListener('pointermove', mover);
    zona.addEventListener('pointerleave', salir);
    return () => {
      zona.removeEventListener('pointermove', mover);
      zona.removeEventListener('pointerleave', salir);
      cancelAnimationFrame(cuadro);
    };
  }, []);

  return <span ref={capa} aria-hidden="true" className="d-reflector absolute inset-0 -z-10" />;
}
