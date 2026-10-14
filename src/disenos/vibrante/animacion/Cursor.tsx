'use client';

import { useEffect, useRef } from 'react';

/** Qué hay bajo el puntero: una foto o tarjeta ([data-cursor]), un enlace o un campo, o nada. */
const INTERACTIVOS = 'a, button, summary, label, input, select, textarea';

/** Cuánto se acerca el círculo al puntero en cada cuadro (0–1): menos = más retraso. */
const SUAVIDAD = 0.2;

/**
 * Cursor propio de la propuesta: un círculo rojo que sigue al puntero con un poco de retraso
 * (requestAnimationFrame) y crece con la palabra del atributo `data-cursor` («Ver») sobre fotos y
 * tarjetas. El cursor del sistema sigue visible siempre. Solo existe con mouse o trackpad y sin
 * «reducir movimiento»: lo decide tema.css (`.vibrante-cursor`) y, aquí, matchMedia evita
 * escuchar el puntero donde no se ve. Decorativo: aria-hidden y sin eventos de puntero.
 */
export function Cursor() {
  const circulo = useRef<HTMLDivElement>(null);
  const texto = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = circulo.current;
    const etiqueta = texto.current;
    if (!el || !etiqueta) return;
    const consulta = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    if (!consulta.matches) return;

    const destino = { x: 0, y: 0 };
    const actual = { x: 0, y: 0 };
    let cuadro = 0;
    let primera = true;

    const pintar = () => {
      actual.x += (destino.x - actual.x) * SUAVIDAD;
      actual.y += (destino.y - actual.y) * SUAVIDAD;
      el.style.setProperty('--cx', `${actual.x.toFixed(1)}px`);
      el.style.setProperty('--cy', `${actual.y.toFixed(1)}px`);
      // Se detiene al alcanzar el puntero: no gasta cuadros con el mouse quieto.
      cuadro =
        Math.abs(destino.x - actual.x) + Math.abs(destino.y - actual.y) > 0.3
          ? requestAnimationFrame(pintar)
          : 0;
    };

    const alMover = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      destino.x = e.clientX;
      destino.y = e.clientY;
      if (primera) {
        // La primera vez aparece donde está el puntero, sin viajar desde la esquina.
        actual.x = destino.x;
        actual.y = destino.y;
        primera = false;
      }
      el.dataset.visible = '';
      if (!cuadro) cuadro = requestAnimationFrame(pintar);
    };

    const alPasar = (e: PointerEvent) => {
      const objetivo = e.target instanceof Element ? e.target : null;
      const foto = objetivo?.closest<HTMLElement>('[data-cursor]');
      const enlace = objetivo?.closest(INTERACTIVOS);
      if (foto) {
        el.dataset.estado = 'ver';
        etiqueta.textContent = foto.dataset.cursor || 'Ver';
      } else if (enlace) {
        el.dataset.estado = 'enlace';
      } else {
        delete el.dataset.estado;
      }
      // Sobre el rojo, el anillo pasa a crema para que se siga viendo.
      if (objetivo?.closest('[data-cursor-claro]')) el.dataset.claro = '';
      else delete el.dataset.claro;
    };

    const alSalir = (e: PointerEvent) => {
      if (!e.relatedTarget) delete el.dataset.visible;
    };

    window.addEventListener('pointermove', alMover, { passive: true });
    document.addEventListener('pointerover', alPasar, { passive: true });
    document.addEventListener('pointerout', alSalir, { passive: true });
    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener('pointermove', alMover);
      document.removeEventListener('pointerover', alPasar);
      document.removeEventListener('pointerout', alSalir);
    };
  }, []);

  return (
    <div ref={circulo} aria-hidden="true" className="vibrante-cursor">
      <span ref={texto}>Ver</span>
    </div>
  );
}
