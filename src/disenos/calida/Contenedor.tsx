import type { ReactNode } from 'react';

/**
 * Ancho de contenido de la propuesta (en la imagen de 1536 px los bloques van de 50 a 1487 px):
 * `pagina` para secciones, `amplio` para las bandas que casi tocan los bordes (sin margen en el
 * celular) y `encabezado` para el encabezado, un poco más angosto, como en la imagen.
 */
const ANCHOS = {
  pagina: 'max-w-[96rem] px-[clamp(1rem,3.25vw,3.25rem)]',
  amplio: 'max-w-[98rem] md:px-[clamp(1rem,1.75vw,1.75rem)]',
  encabezado: 'max-w-[84rem] px-[clamp(1rem,4vw,3.5rem)]',
};

export function Contenedor({
  children,
  ancho = 'pagina',
  className = '',
}: {
  children: ReactNode;
  ancho?: keyof typeof ANCHOS;
  className?: string;
}) {
  return <div className={`mx-auto w-full ${ANCHOS[ancho]} ${className}`}>{children}</div>;
}
