'use client';

import { useEffect } from 'react';

/** Cuánto se acerca un botón magnético al cursor (fracción de la distancia, con tope en px). */
const IMAN = 0.25;
const IMAN_TOPE = 9;

const limitar = (valor: number, tope: number) => Math.max(-tope, Math.min(tope, valor));

/** Margen alrededor del botón (px) dentro del cual el imán sigue activo. */
const IMAN_MARGEN = 14;

/** Rectángulo del elemento en reposo: el actual menos el `translate` que lleva en este momento. */
function reposo(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const [dx = 0, dy = 0] = getComputedStyle(el)
    .translate.split(' ')
    .map((v) => parseFloat(v) || 0);
  return { left: r.left - dx, top: r.top - dy, width: r.width, height: r.height };
}

function dentroDeReposo(el: HTMLElement, x: number, y: number): boolean {
  const r = reposo(el);
  return (
    x >= r.left - IMAN_MARGEN &&
    x <= r.left + r.width + IMAN_MARGEN &&
    y >= r.top - IMAN_MARGEN &&
    y <= r.top + r.height + IMAN_MARGEN
  );
}

/**
 * Efectos que siguen al cursor en toda la propuesta, con un solo oyente y un cuadro de animación
 * por movimiento (`requestAnimationFrame`): las piezas del servidor solo llevan una clase o un
 * atributo y el estilo vive en tema.css, que lee las variables que aquí se ponen.
 * - `.calida-magnetico` (botones): --mx/--my, unos píxeles hacia el cursor.
 * - `[data-luz]` (tarjetas oscuras): --lx/--ly, la posición del cursor para la luz cálida.
 * - `[data-profundidad]` (fotos grandes): --px/--py de -1 a 1 para moverlas al revés del cursor.
 * Solo con un mouse de verdad (hover + pointer fine) y sin «reducir movimiento»: en el celular no
 * escucha nada. Al salir de un elemento sus variables se borran y vuelve a su sitio.
 */
export function EfectosCursor() {
  useEffect(() => {
    const conMouse = window.matchMedia('(hover: hover) and (pointer: fine)');
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)');
    const activos = new Map<string, HTMLElement>();
    let ultimo: PointerEvent | null = null;
    let cuadro = 0;

    const soltar = (tipo: string, vars: string[]) => {
      const el = activos.get(tipo);
      if (!el) return;
      for (const v of vars) el.style.removeProperty(v);
      activos.delete(tipo);
    };
    const soltarTodo = () => {
      soltar('iman', ['--mx', '--my']);
      soltar('luz', ['--lx', '--ly']);
      soltar('profundidad', ['--px', '--py']);
    };

    /** El elemento de ese tipo bajo el cursor (o null); suelta el anterior si cambió. */
    const tomar = (tipo: string, selector: string, vars: string[], destino: Element) => {
      const el = destino.closest<HTMLElement>(selector);
      if (activos.get(tipo) !== el) soltar(tipo, vars);
      if (el) activos.set(tipo, el);
      return el;
    };

    const pintar = () => {
      cuadro = 0;
      const e = ultimo;
      if (!e || !(e.target instanceof Element)) return;
      const { clientX: x, clientY: y } = e;

      // Imán: se decide por su posición de reposo (el rectángulo sin el desplazamiento que lleva
      // ahora) más un margen; si se usara el elemento bajo el cursor, al acercarse al cursor
      // cerca de un borde «saldría» de debajo de él y volvería de golpe.
      let iman = activos.get('iman');
      if (iman && !dentroDeReposo(iman, x, y)) {
        soltar('iman', ['--mx', '--my']);
        iman = undefined;
      }
      if (!iman) {
        const nuevo = e.target.closest<HTMLElement>('.calida-magnetico');
        if (nuevo) activos.set('iman', nuevo);
        iman = nuevo ?? undefined;
      }
      if (iman) {
        const r = reposo(iman);
        iman.style.setProperty(
          '--mx',
          `${limitar((x - r.left - r.width / 2) * IMAN, IMAN_TOPE)}px`,
        );
        iman.style.setProperty(
          '--my',
          `${limitar((y - r.top - r.height / 2) * IMAN, IMAN_TOPE)}px`,
        );
      }

      const luz = tomar('luz', '[data-luz]', ['--lx', '--ly'], e.target);
      if (luz) {
        const r = luz.getBoundingClientRect();
        luz.style.setProperty('--lx', `${Math.round(x - r.left)}px`);
        luz.style.setProperty('--ly', `${Math.round(y - r.top)}px`);
      }

      const foto = tomar('profundidad', '[data-profundidad]', ['--px', '--py'], e.target);
      if (foto) {
        const r = foto.getBoundingClientRect();
        foto.style.setProperty('--px', (((x - r.left) / r.width) * 2 - 1).toFixed(3));
        foto.style.setProperty('--py', (((y - r.top) / r.height) * 2 - 1).toFixed(3));
      }
    };

    const alMover = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !conMouse.matches || quieto.matches) return;
      ultimo = e;
      if (!cuadro) cuadro = requestAnimationFrame(pintar);
    };
    // El cursor salió de la ventana: todo vuelve a su lugar.
    const alSalir = (e: PointerEvent) => {
      if (!e.relatedTarget) soltarTodo();
    };

    document.addEventListener('pointermove', alMover, { passive: true });
    document.addEventListener('pointerout', alSalir);
    return () => {
      document.removeEventListener('pointermove', alMover);
      document.removeEventListener('pointerout', alSalir);
      cancelAnimationFrame(cuadro);
      soltarTodo();
    };
  }, []);

  return null;
}
