import type { ReactNode } from 'react';

/**
 * Titulares de la propuesta: DM Serif Display muy negra y apretada. El `<em>` sale en la itálica
 * caligráfica naranja (tema.css). Tamaños fluidos medidos en las imágenes (1536 px):
 * portada ~100 px, página ~95 px, sección ~60 px, tarjeta ~34 px, dato ~24 px.
 */
const TAMANOS = {
  portada:
    'text-[clamp(3rem,2.2rem+4.2vw,4.5rem)] leading-[0.92] xl:text-[min(6.9vw,6.75rem)] xl:leading-[0.9]',
  pagina: 'text-[clamp(2.75rem,1.9rem+4.2vw,6rem)] leading-[0.92]',
  seccion: 'text-[clamp(2.5rem,1.9rem+2.4vw,3.75rem)] leading-[0.98]',
  tarjeta: 'text-[clamp(1.75rem,1.35rem+1.1vw,2.25rem)] leading-[1.05]',
  dato: 'text-[clamp(1.25rem,1.1rem+0.4vw,1.5rem)] leading-tight',
  /** El tamaño lo pone quien lo usa (p. ej. en `cqi` dentro de una tarjeta con @container). */
  libre: '',
};

export function Titulo({
  children,
  como: Tag = 'h2',
  tamano,
  id,
  className = '',
}: {
  children: ReactNode;
  como?: 'h1' | 'h2' | 'h3' | 'p';
  tamano: keyof typeof TAMANOS;
  id?: string;
  className?: string;
}) {
  return (
    <Tag
      id={id}
      className={`font-display font-normal tracking-[-0.015em] text-balance ${TAMANOS[tamano]} ${className}`}
    >
      {children}
    </Tag>
  );
}
