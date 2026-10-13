import Image from 'next/image';
import type { ReactNode } from 'react';

/**
 * Foto que llena su marco (`fill` + `object-cover`). El marco (tamaño, esquinas, posición) lo da
 * `className`. `zoom`: se acerca al pasar el mouse por la tarjeta (`group`), solo con movimiento
 * permitido. `children`: velo o degradado encima de la foto.
 */
export function Foto({
  src,
  alt,
  sizes,
  className = '',
  encuadre = 'object-center',
  prioridad = false,
  zoom = false,
  children,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  /** Clase object-position para encuadrar a las personas. */
  encuadre?: string;
  prioridad?: boolean;
  zoom?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={prioridad}
        className={`object-cover ${encuadre} ${
          zoom
            ? 'transition-transform duration-700 ease-(--ease-out-soft) motion-safe:group-hover:scale-105'
            : ''
        }`}
      />
      {children}
    </div>
  );
}
