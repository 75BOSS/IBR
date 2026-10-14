import Image from 'next/image';
import type { FotoVibrante } from '@/disenos/vibrante/fotos';

const PROFUNDIDAD = {
  1: 'vibrante-paralaje',
  2: 'vibrante-paralaje vibrante-prof-2',
  3: 'vibrante-paralaje vibrante-prof-3',
} as const;

/**
 * Foto recortada que llena su caja (mosaicos, tarjetas). El tamaño y la forma los pone quien la
 * usa en `className`; con `zoom`, se acerca un poco al pasar el mouse por su tarjeta (`group`).
 * Con `profundidad`, se desplaza un poco con el cursor dentro de un `Paralaje`. Sobre ella, el
 * cursor propio crece con «Ver» (`cursor={null}` lo evita).
 */
export function Foto({
  foto,
  sizes,
  className = '',
  prioridad = false,
  zoom = false,
  decorativa = false,
  absoluta = false,
  profundidad,
  cursor = 'Ver',
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
  /** Cuánto se mueve con el cursor dentro de un `Paralaje` (1 = poco, 3 = más). */
  profundidad?: keyof typeof PROFUNDIDAD;
  cursor?: string | null;
}) {
  return (
    <div
      data-cursor={cursor ?? undefined}
      className={`${absoluta ? 'absolute' : 'relative'} overflow-hidden bg-(--d-negro) ${className}`}
    >
      <Image
        src={foto.src}
        alt={decorativa ? '' : foto.alt}
        fill
        sizes={sizes}
        priority={prioridad}
        className={`object-cover ${foto.encuadre ?? ''} ${profundidad ? PROFUNDIDAD[profundidad] : ''} ${
          zoom
            ? 'transition-transform duration-700 ease-out-soft motion-safe:group-hover:scale-105'
            : ''
        }`}
      />
    </div>
  );
}
