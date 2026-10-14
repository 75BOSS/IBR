import Image from 'next/image';
import type { ReactNode } from 'react';

/**
 * Foto que llena su marco (`fill` + `object-cover`). El marco (tamaño, esquinas, posición) lo da
 * `className` y debe ser `relative`. Efectos (todos respetan «reducir movimiento», tema.css):
 * - `zoom`: se acerca despacio al pasar el mouse por la tarjeta (`group`), solo con mouse.
 * - `paralaje`: al hacer scroll la foto baja más lento que la página (CSS con `view()`). La foto
 *   va en una capa 16 % más alta que el marco y el marco recorta con `overflow: clip` (con
 *   `hidden` la línea de tiempo del scroll se ataría al marco y no se movería).
 * - `profundidad`: se desplaza un poco al revés del cursor (EfectosCursor pone --px/--py).
 * `children`: velo o degradado encima de la foto.
 */
export function Foto({
  src,
  alt,
  sizes,
  className = '',
  encuadre = 'object-center',
  prioridad = false,
  zoom = false,
  paralaje = false,
  profundidad = false,
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
  paralaje?: boolean;
  profundidad?: boolean;
  children?: ReactNode;
}) {
  const imagen = (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={prioridad}
      className={`object-cover ${encuadre} ${profundidad ? 'calida-profundidad' : ''} ${
        zoom
          ? 'transition-[scale] duration-[1600ms] ease-(--ease-out-soft) motion-safe:pointer-fine:group-hover:scale-[1.06]'
          : ''
      }`}
    />
  );
  return (
    <div
      data-profundidad={profundidad || undefined}
      className={`${paralaje ? 'overflow-clip' : 'overflow-hidden'} ${className}`}
    >
      {paralaje ? (
        <div className="calida-paralaje absolute inset-x-0 -inset-y-[8%]">{imagen}</div>
      ) : (
        imagen
      )}
      {children}
    </div>
  );
}
