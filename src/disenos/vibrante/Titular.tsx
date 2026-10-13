import type { ReactNode } from 'react';

/*
 * Titulares de la propuesta: sans muy gruesa y apretada (Figtree 900). El tamaño se
 * mide en el ancho del contenedor más cercano (`cqi`), así el mismo titular se ajusta a una
 * columna angosta o ancha sin que la página le diga nada.
 */
const TAMANOS = {
  /** Título de sección a lo ancho («Lo que viene.»). */
  seccion: 'text-[clamp(2.125rem,9cqi,3.5rem)] leading-[0.95]',
  /** Título que ocupa su propia columna angosta («Personas que caminan juntas.»). */
  columna: 'text-[clamp(2.125rem,14.5cqi,3.5rem)] leading-[0.95]',
  /** Título de tarjeta («Grupos en casa»). */
  tarjeta: 'text-[clamp(1.5rem,7cqi,2.25rem)] leading-none',
  /** Franja o banda («Siempre hay un lugar para ti.»). */
  banda: 'text-[clamp(2.25rem,8.5cqi,4rem)] leading-[0.92]',
  /** Quien lo usa pone su propio tamaño en `className`. */
  libre: '',
};

export function Titular({
  as: Tag = 'h2',
  id,
  tamano = 'seccion',
  className = '',
  children,
}: {
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  tamano?: keyof typeof TAMANOS;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      id={id}
      className={`font-display font-black tracking-[-0.04em] text-balance ${TAMANOS[tamano]} ${className}`}
    >
      {children}
    </Tag>
  );
}
