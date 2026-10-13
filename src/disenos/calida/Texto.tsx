import type { ReactNode } from 'react';

/**
 * Párrafo de la propuesta en Figtree. `entrada`: la frase bajo el titular de la portada (~24 px en
 * escritorio); `normal`: el texto de secciones y tarjetas (~18 px). El color se hereda (azul
 * marino en claro, crema en oscuro) o lo da `className`.
 */
const TAMANOS = {
  entrada: 'text-[clamp(1.0625rem,0.92rem+0.6vw,1.5rem)] leading-snug',
  normal: 'text-[clamp(1rem,0.96rem+0.25vw,1.125rem)] leading-normal',
};

export function Texto({
  children,
  tamano = 'normal',
  className = '',
}: {
  children: ReactNode;
  tamano?: keyof typeof TAMANOS;
  className?: string;
}) {
  return <p className={`${TAMANOS[tamano]} ${className}`}>{children}</p>;
}
