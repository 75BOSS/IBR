import type { ElementType, ReactNode } from 'react';

const ANCHOS = {
  /** Secciones: casi de borde a borde, como la propuesta (1416 px de contenido en 1536). */
  amplio: 'max-w-[100rem]',
  /** Encabezado y pie: un poco más recogido que las secciones (logo en x = 115 en 1536). */
  recogido: 'max-w-[89rem]',
};

/**
 * Ancho de contenido de la propuesta Vibrante: márgenes fluidos (16 px en 360 → 60 px en 1536)
 * y un tope más ancho que `container-page`, porque la propuesta llena casi toda la pantalla.
 */
export function Contenedor({
  as: Tag = 'div',
  ancho = 'amplio',
  className = '',
  children,
}: {
  as?: ElementType;
  ancho?: keyof typeof ANCHOS;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={`mx-auto w-full px-[clamp(1rem,3.9vw,3.75rem)] ${ANCHOS[ancho]} ${className}`}>
      {children}
    </Tag>
  );
}
