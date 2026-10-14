import Image from 'next/image';

/**
 * Foto que se revela con un telón al aparecer (se abre desde el centro y se acerca un poco),
 * solo con CSS (`d-telon`, tema.css): sin soporte o con «reducir movimiento» se ve completa.
 * `marco` da la forma y el tamaño (aspecto, esquinas, sombra); `sizes` el ancho que ocupa.
 * Si la foto vive en una tarjeta con `d-tarjeta`, se acerca al pasar el cursor (`d-zoom`).
 */
export function Foto({
  src,
  alt,
  sizes,
  marco,
  prioridad = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  marco: string;
  prioridad?: boolean;
}) {
  return (
    <div className={`d-telon relative overflow-hidden bg-(--d-marino) ${marco}`}>
      <div className="d-acercar absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={prioridad}
          className="d-zoom object-cover"
        />
      </div>
    </div>
  );
}
