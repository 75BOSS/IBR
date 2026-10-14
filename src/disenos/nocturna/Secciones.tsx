import type { ReactNode } from 'react';
import { FocoCursor } from './efectos';
import { CONTENEDOR, ENTRADA, Etiqueta, Foto } from './ui';

/**
 * Portada de las páginas interiores (imagen 8, «La vida se comparte.»): la foto ancha a la
 * derecha fundida en el azul de noche y, a la izquierda, las etiquetas, el titular con la palabra
 * en itálica y el texto. En celular y tablet la foto va arriba y se funde hacia el texto. La foto
 * se acerca lento (Ken Burns), el texto entra desenfocado y un foco de luz sigue al cursor.
 */
export function PortadaInterior({
  id,
  etiquetas,
  titulo,
  texto,
  foto,
  encuadre = 'object-center',
  children,
}: {
  id: string;
  etiquetas: string[];
  /** Contenido del h1 (una palabra en <em> sale en la itálica durazno). */
  titulo: ReactNode;
  texto: ReactNode;
  foto: string;
  encuadre?: string;
  /** Botones o accesos bajo el texto. */
  children?: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="relative isolate overflow-hidden bg-(--d-noche) text-cream on-dark"
    >
      <Foto
        src={foto}
        sizes="(min-width: 64rem) 64vw, 100vw"
        prioridad
        encuadre={encuadre}
        efecto="d-ken-burns"
        className="aspect-[16/11] w-full mask-b-from-55% md:aspect-[16/8] lg:absolute lg:inset-y-0 lg:right-0 lg:-z-10 lg:aspect-auto lg:w-[64%] lg:mask-b-from-100% lg:mask-l-from-60%"
      />
      <FocoCursor />
      <div
        className={`${CONTENEDOR} relative -mt-[clamp(4rem,16vw,7rem)] pb-[clamp(2.5rem,7vw,3.5rem)] lg:mt-0 lg:pt-[clamp(2.75rem,4.6vw,4rem)] lg:pb-[clamp(2.5rem,3.6vw,3.5rem)]`}
      >
        <div className="flex max-w-[40rem] flex-col items-start gap-[clamp(0.75rem,1.4vw,1rem)] lg:pl-[clamp(0rem,8vw_-_3.5rem,4.375rem)]">
          <div className="d-entrada flex flex-wrap gap-x-5 gap-y-2 text-(--d-arena)">
            {etiquetas.map((e) => (
              <Etiqueta key={e}>{e}</Etiqueta>
            ))}
          </div>
          <h1
            id={id}
            className="d-entrada font-display text-[clamp(2.75rem,1.9rem+4vw,5.9rem)] leading-[0.92] font-extrabold tracking-[-0.035em] break-words [--d-retraso:120ms]"
          >
            {titulo}
          </h1>
          <p
            className={`d-entrada mt-1 max-w-[30rem] tracking-[0.01em] text-cream/95 [--d-retraso:240ms] ${ENTRADA}`}
          >
            {texto}
          </p>
          {children && (
            <div className="d-entrada mt-[clamp(0.5rem,1.2vw,0.875rem)] flex flex-wrap items-center gap-x-5 gap-y-3 [--d-retraso:360ms]">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Franja final de una página (imagen 8, «Hay un lugar para ti aquí.»): azul marino con el
 * titular, un texto corto y las acciones, y una foto a la derecha.
 */
export function FranjaCierre({
  id,
  etiqueta,
  titulo,
  texto,
  foto,
  encuadre = 'object-[45%_center]',
  children,
}: {
  id: string;
  etiqueta: string;
  titulo: ReactNode;
  texto: ReactNode;
  foto: string;
  encuadre?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="relative isolate grid bg-(--d-marino) text-cream on-dark lg:grid-cols-[minmax(0,0.93fr)_minmax(0,1.07fr)]"
    >
      <FocoCursor />
      <div className="d-aparece flex flex-col items-start justify-center gap-[clamp(0.75rem,1.2vw,1rem)] py-[clamp(2.5rem,6vw,3.5rem)] pr-[clamp(1rem,4vw,2.5rem)] pl-[clamp(1rem,8.5vw,8.125rem)]">
        <Etiqueta className="text-(--d-arena)">{etiqueta}</Etiqueta>
        <h2
          id={id}
          className="font-display text-[clamp(2.125rem,1.45rem+2.5vw,3.25rem)] leading-[0.98] font-extrabold tracking-[-0.035em] break-words"
        >
          {titulo}
        </h2>
        <p className="max-w-[24rem] text-[clamp(0.9375rem,0.9rem+0.15vw,1rem)] leading-[1.4] tracking-[0.01em] text-cream/90">
          {texto}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-7 gap-y-3">{children}</div>
      </div>
      <Foto
        src={foto}
        sizes="(min-width: 64rem) 54vw, 100vw"
        encuadre={encuadre}
        className="min-h-[clamp(14rem,48vw,17.5rem)]"
      />
    </section>
  );
}
