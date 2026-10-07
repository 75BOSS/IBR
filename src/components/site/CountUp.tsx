'use client';

import { useEffect, useRef } from 'react';

/**
 * Número que sube de 0 a su valor cuando aparece en pantalla. El servidor ya pinta el valor
 * final: sin JavaScript, con «reducir movimiento» o si ya está a la vista al cargar, se ve
 * quieto. Los lectores de pantalla leen solo el valor final.
 */
export function CountUp({ value, className = '' }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || value <= 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const format = (n: number) => n.toLocaleString('es-EC');
    el.textContent = format(0);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1400;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - t) ** 3;
          el.textContent = format(Math.round(value * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = format(value);
    };
  }, [value]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {value.toLocaleString('es-EC')}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
