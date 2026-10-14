'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

/*
 * Interacciones con el cursor de la propuesta Nocturna, sin librerías. Cada pieza solo se
 * enciende con mouse (hover + pointer fine) y sin «reducir movimiento»; si no, no hace nada y la
 * página se ve igual de completa. La posición del puntero se escribe en variables CSS una vez por
 * cuadro (requestAnimationFrame) y las clases de tema.css la leen.
 */

const CON_MOUSE = '(hover: hover) and (pointer: fine)';
const QUIETO = '(prefers-reduced-motion: reduce)';

/** ¿Se permite animar? */
function conMovimiento(): boolean {
  return !matchMedia(QUIETO).matches;
}

/** ¿Hay un cursor de verdad y se permite animar? */
function conCursor(): boolean {
  return matchMedia(CON_MOUSE).matches && conMovimiento();
}

/**
 * Escucha el mouse sobre `zona`: `pintar` recibe la posición una vez por cuadro y `activar` dice
 * si el cursor está dentro. Devuelve la función que deja de escuchar.
 */
function seguirCursor(
  zona: HTMLElement,
  pintar: (x: number, y: number) => void,
  activar: (dentro: boolean) => void,
): () => void {
  let cuadro = 0;
  let x = 0;
  let y = 0;
  const mover = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX;
    y = e.clientY;
    if (cuadro) return;
    cuadro = requestAnimationFrame(() => {
      cuadro = 0;
      pintar(x, y);
    });
  };
  const entrar = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') activar(true);
  };
  const salir = () => activar(false);
  zona.addEventListener('pointermove', mover, { passive: true });
  zona.addEventListener('pointerenter', entrar);
  zona.addEventListener('pointerleave', salir);
  return () => {
    cancelAnimationFrame(cuadro);
    zona.removeEventListener('pointermove', mover);
    zona.removeEventListener('pointerenter', entrar);
    zona.removeEventListener('pointerleave', salir);
  };
}

/**
 * Foco de luz que sigue al cursor sobre la sección que lo contiene (su elemento padre, que lleva
 * `relative isolate`). Es una capa decorativa vacía: no cambia la estructura de la sección.
 */
export function FocoCursor() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const capa = ref.current;
    const zona = capa?.parentElement;
    if (!capa || !zona || !conCursor()) return;
    return seguirCursor(
      zona,
      (x, y) => {
        const caja = zona.getBoundingClientRect();
        capa.style.setProperty('--mx', `${x - caja.left}px`);
        capa.style.setProperty('--my', `${y - caja.top}px`);
      },
      (dentro) => capa.toggleAttribute('data-activo', dentro),
    );
  }, []);
  return <span ref={ref} aria-hidden="true" className="d-foco" />;
}

type EtiquetaZona = 'div' | 'ul' | 'ol';

/**
 * Contenedor de tarjetas `d-brillo`: con el cursor dentro, el borde de cada tarjeta brilla en
 * la parte más cercana al puntero (también las vecinas, como una luz que pasa).
 */
export function ZonaBrillo({
  as = 'div',
  className = '',
  children,
}: {
  as?: EtiquetaZona;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const zona = ref.current;
    if (!zona || !conCursor()) return;
    return seguirCursor(
      zona,
      (x, y) => {
        for (const tarjeta of zona.querySelectorAll<HTMLElement>('.d-brillo')) {
          const caja = tarjeta.getBoundingClientRect();
          tarjeta.style.setProperty('--gx', `${x - caja.left}px`);
          tarjeta.style.setProperty('--gy', `${y - caja.top}px`);
        }
      },
      (dentro) => zona.toggleAttribute('data-brillando', dentro),
    );
  }, []);
  const Etiqueta = as;
  return (
    <Etiqueta
      ref={(el: HTMLElement | null) => {
        ref.current = el;
      }}
      className={className}
    >
      {children}
    </Etiqueta>
  );
}

const DURACION_CIFRA = 1600;

/**
 * Cifra que cuenta desde cero cuando aparece en pantalla. El servidor la manda ya con su valor
 * (sin JavaScript o con «reducir movimiento» se ve quieta) y los lectores de pantalla leen
 * siempre el número final.
 */
export function Cifra({ valor, className = '' }: { valor: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [mostrado, setMostrado] = useState(valor);
  useEffect(() => {
    const el = ref.current;
    if (!el || !conMovimiento() || typeof IntersectionObserver === 'undefined') return;
    let cuadro = 0;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting) return;
        observador.disconnect();
        const inicio = performance.now();
        const paso = (ahora: number) => {
          const avance = Math.min(1, (ahora - inicio) / DURACION_CIFRA);
          // Rápido al principio y suave al llegar (ease-out cúbico).
          setMostrado(Math.round(valor * (1 - (1 - avance) ** 3)));
          if (avance < 1) cuadro = requestAnimationFrame(paso);
        };
        cuadro = requestAnimationFrame(paso);
      },
      { threshold: 0.6 },
    );
    observador.observe(el);
    return () => {
      observador.disconnect();
      cancelAnimationFrame(cuadro);
    };
  }, [valor]);
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      <span aria-hidden="true">{mostrado}</span>
      <span className="sr-only">{valor}</span>
    </span>
  );
}
