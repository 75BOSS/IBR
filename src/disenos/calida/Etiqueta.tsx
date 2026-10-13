import type { ReactNode } from 'react';

/**
 * Etiqueta sobre los títulos: versalitas muy espaciadas con una raya delante («— COMUNIDAD»).
 * La raya se alinea con la primera línea aunque el texto baje a dos (celular). El color lo da
 * quien la usa (naranja en claro, durazno en oscuro). En el pie es el título de cada columna.
 */
export function Etiqueta({
  children,
  como: Tag = 'p',
  className = '',
}: {
  children: ReactNode;
  como?: 'p' | 'h2' | 'h3';
  className?: string;
}) {
  return (
    <Tag
      className={`flex items-start gap-3 font-sans text-[clamp(0.6875rem,0.64rem+0.15vw,0.78rem)] leading-[1.6] font-bold tracking-[0.24em] uppercase before:mt-[0.8em] before:h-px before:w-[clamp(1.5rem,1.2rem+0.8vw,2rem)] before:shrink-0 before:bg-current ${className}`}
    >
      {/* Un solo hijo: el texto y sus partes no se vuelven columnas del flex. */}
      <span>{children}</span>
    </Tag>
  );
}
