import Image from 'next/image';
import type { FotoVibrante } from '@/disenos/vibrante/fotos';

/**
 * Foto recortada que llena su caja (mosaicos, tarjetas). El tamaño y la forma los pone quien la
 * usa en `className`; con `zoom`, se acerca un poco al pasar el mouse por su tarjeta (`group`).
 */
export function Foto({
  foto,
  sizes,
  className = '',
  prioridad = false,
  zoom = false,
  decorativa = false,
  absoluta = false,
}: {
  foto: FotoVibrante;
  /** Ancho con que se muestra (atributo `sizes` de next/image). */
  sizes: string;
  className?: string;
  prioridad?: boolean;
  zoom?: boolean;
  /** Si ya hay texto que dice lo mismo, la foto no se anuncia. */
  decorativa?: boolean;
  /** Fondo de una tarjeta: se ubica con `absolute` (y `className` dice dónde). */
  absoluta?: boolean;
}) {
  return (
    <div
      className={`${absoluta ? 'absolute' : 'relative'} overflow-hidden bg-(--d-negro) ${className}`}
    >
      <Image
        src={foto.src}
        alt={decorativa ? '' : foto.alt}
        fill
        sizes={sizes}
        priority={prioridad}
        className={`object-cover ${foto.encuadre ?? ''} ${
          zoom
            ? 'transition-transform duration-700 ease-out-soft motion-safe:group-hover:scale-105'
            : ''
        }`}
      />
    </div>
  );
}
