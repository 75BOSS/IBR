'use client';

import { useEffect, useRef } from 'react';

/** Curva que frena al final (el número llega «despacio»). */
const frenar = (t: number) => 1 - (1 - t) ** 3;

/**
 * Número grande que cuenta desde 0 cuando entra en la pantalla. El servidor dibuja el número
 * final (sin JavaScript, con «reducir movimiento» o si ya está a la vista al cargar, se queda
 * así); el texto que lee el lector de pantalla es siempre el final. Escribe en el DOM en cada
 * cuadro de animación, sin re-render.
 */
export function Contador({ valor, className = '' }: { valor: number; className?: string }) {
  const numero = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = numero.current;
    if (!el || !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.textContent = '0';
    let cuadro = 0;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting) return;
        observador.disconnect();
        const inicio = performance.now();
        const paso = (ahora: number) => {
          const t = Math.min(1, (ahora - inicio) / 1400);
          el.textContent = String(Math.round(frenar(t) * valor));
          if (t < 1) cuadro = requestAnimationFrame(paso);
        };
        cuadro = requestAnimationFrame(paso);
      },
      { threshold: 0.6 },
    );
    observador.observe(el);
    return () => {
      observador.disconnect();
      cancelAnimationFrame(cuadro);
      el.textContent = String(valor);
    };
  }, [valor]);

  return (
    <span className={className}>
      <span ref={numero} aria-hidden="true">
        {valor}
      </span>
      <span className="sr-only">{valor}</span>
    </span>
  );
}
