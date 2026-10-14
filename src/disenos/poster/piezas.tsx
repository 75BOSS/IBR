import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';

/*
 * Piezas tipográficas de la propuesta Póster: un solo lugar para cada estilo de letra, así las
 * páginas no repiten cadenas largas de clases.
 */

const ESTILOS_TITULO = {
  /** «SOMOS FAMILIA», «ENCUENTRA TU LUGAR»: negra, mayúsculas, letras juntas. */
  negro: 'font-display font-black uppercase leading-[0.78] tracking-[-0.025em]',
  /** «Este domingo», «Prédicas», «Conecta», «¿Es tu primera vez?». */
  grueso: 'font-display font-extrabold leading-[0.95] tracking-[-0.03em]',
  /** «La fe también se vive…», «Grupos en casa»: gruesa y condensada. */
  condensado: 'font-display font-extrabold font-stretch-[72%] leading-[0.98] tracking-[-0.012em]',
};

export type EstiloTitulo = keyof typeof ESTILOS_TITULO;

/** Titular de la propuesta en cualquiera de sus tres estilos (el tamaño lo da `className`). */
export function Titulo({
  as: Etiqueta = 'h2',
  estilo,
  id,
  className = '',
  children,
}: {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  estilo: EstiloTitulo;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Etiqueta id={id} className={`${ESTILOS_TITULO[estilo]} ${className}`}>
      {children}
    </Etiqueta>
  );
}

/**
 * Línea de lema en versalitas muy espaciadas («IGLESIA BÍBLICA RIOBAMBA · …»). `tamano` cambia
 * el tamaño de letra (por defecto, fluido según la ventana).
 */
export function Lema({
  as: Etiqueta = 'p',
  tamano = 'text-[clamp(0.6875rem,0.6rem+0.3vw,0.9375rem)]',
  className = '',
  children,
}: {
  as?: 'p' | 'span' | 'h2' | 'h3';
  tamano?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Etiqueta
      className={`font-display leading-[1.6] font-bold tracking-[0.36em] uppercase ${tamano} ${className}`}
    >
      {children}
    </Etiqueta>
  );
}

/** Raya roja corta bajo un titular (adorno). */
export function Raya({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-[0.3rem] w-[clamp(2.25rem,3.6vw,3.25rem)] bg-accent ${className}`}
    />
  );
}

/** Aviso para lectores de pantalla en un enlace que abre otra pestaña. */
export function PestanaNueva({ que = 'se abre en una pestaña nueva' }: { que?: string }) {
  return <span className="sr-only"> ({que})</span>;
}

/**
 * Titular con «mal registro» de imprenta: el texto real y, detrás, una copia durazno corrida
 * (`.d-copia`, decorativa) que se mueve hacia el cursor si un `Desregistro` la envuelve. Las dos
 * capas ocupan la misma celda de la grilla, así cortan los renglones igual.
 */
export function TituloImpreso({
  as = 'h1',
  estilo,
  id,
  className = '',
  children,
}: {
  as?: 'h1' | 'h2' | 'p';
  estilo: EstiloTitulo;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative isolate grid">
      <span
        aria-hidden="true"
        className={`d-copia -z-10 select-none [grid-area:1/1] ${ESTILOS_TITULO[estilo]} ${className}`}
      >
        {children}
      </span>
      <Titulo as={as} id={id} estilo={estilo} className={`[grid-area:1/1] ${className}`}>
        {children}
      </Titulo>
    </div>
  );
}

/**
 * Cabecera de una sección como en un periódico: lema rojo, titular negro en mayúsculas y, a la
 * derecha, su enlace «ver más» con flecha; una raya azul marino gruesa la cierra por abajo.
 */
export function CabeceraSeccion({
  id,
  lema,
  titulo,
  accion,
  tono = 'claro',
  className = '',
}: {
  id: string;
  lema: string;
  titulo: ReactNode;
  accion?: { href: string; texto: string; externo?: boolean } | null;
  tono?: 'claro' | 'oscuro';
  className?: string;
}) {
  const oscuro = tono === 'oscuro';
  return (
    <div
      className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-2 pb-[clamp(0.5rem,1.5vw,0.875rem)] ${
        oscuro ? 'border-canvas' : 'border-ink'
      } ${className}`}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <Lema className={oscuro ? 'text-(--d-rojo-claro)' : 'text-accent'}>{lema}</Lema>
        <Titulo
          id={id}
          estilo="negro"
          className="pt-[0.1em] text-[clamp(2.25rem,1.4rem+4vw,5rem)] text-balance [overflow-wrap:anywhere] font-stretch-[85%]"
        >
          {titulo}
        </Titulo>
      </div>
      {accion && (
        <Link
          href={accion.href}
          {...(accion.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className={`group inline-flex min-h-11 items-center gap-2 font-display text-[clamp(1.0625rem,1rem+0.4vw,1.375rem)] font-bold font-stretch-[92%] ${
            oscuro ? 'text-(--d-rojo-claro)' : 'text-accent'
          }`}
        >
          {accion.texto}
          <Icon name="arrowRight" className="d-flecha size-[1.1em]" />
          {accion.externo && <PestanaNueva />}
        </Link>
      )}
    </div>
  );
}

/** Número de orden grande y hueco («01») de los pasos, cursos y valores. */
export function Numero({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`font-display leading-[0.8] font-black tracking-[-0.04em] font-stretch-[75%] ${className}`}
    >
      {children}
    </span>
  );
}
