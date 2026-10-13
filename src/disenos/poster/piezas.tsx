import type { ReactNode } from 'react';

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
