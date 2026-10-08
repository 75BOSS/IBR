'use client';

import { Children, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';

/**
 * Carrusel horizontal sin librerías: desplazamiento nativo con «snap» (en celular se desliza
 * con el dedo) y flechas que avanzan casi una pantalla. Se asoma la tarjeta siguiente para que
 * se note que hay más. `heading` va a la izquierda de las flechas.
 */
export function Carousel({
  label,
  heading,
  children,
  itemClassName = 'w-[min(82vw,26rem)]',
}: {
  /** Nombre del carrusel para lectores de pantalla (ej. «Próximos eventos»). */
  label: string;
  heading: ReactNode;
  children: ReactNode;
  itemClassName?: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  // Arranca «sin desborde» (sin flechas): sin JavaScript las flechas no servirían; al montar se
  // mide y aparecen solo si las tarjetas no caben en el ancho.
  const [edges, setEdges] = useState({ start: true, end: true });

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setEdges({ start: track.scrollLeft <= 4, end: track.scrollLeft >= max - 4 });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    update();
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const move = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  const items = Children.toArray(children);
  const arrow =
    'grid size-12 place-items-center rounded-full ring-1 ring-ink/20 text-ink transition ' +
    'hover:bg-ink hover:text-canvas disabled:pointer-events-none disabled:opacity-30';

  return (
    <section aria-roledescription="carrusel" aria-label={label} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        {heading}
        {!(edges.start && edges.end) && (
          <div className="flex gap-2">
            <button type="button" className={arrow} onClick={() => move(-1)} disabled={edges.start}>
              <Icon name="arrowLeft" />
              <span className="sr-only">Anteriores</span>
            </button>
            <button type="button" className={arrow} onClick={() => move(1)} disabled={edges.end}>
              <Icon name="arrowRight" />
              <span className="sr-only">Siguientes</span>
            </button>
          </div>
        )}
      </div>
      <ul
        ref={trackRef}
        className="-mx-[clamp(1rem,4vw,2.5rem)] flex snap-x snap-mandatory scroll-px-[clamp(1rem,4vw,2.5rem)] [scrollbar-width:none] gap-[clamp(0.75rem,2vw,1.5rem)] overflow-x-auto px-[clamp(1rem,4vw,2.5rem)] pb-4 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <li
            key={i}
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${items.length}`}
            className={`shrink-0 snap-start ${itemClassName}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
