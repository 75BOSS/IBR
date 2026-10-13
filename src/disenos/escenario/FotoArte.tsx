'use client';

import { getImageProps } from 'next/image';

type Fuente = { src: string; width: number; height: number };

/**
 * Foto de fondo con dirección de arte: una toma ancha para escritorio y otra para celular y
 * tablet (la portada de la imagen 10 y la de la imagen 12 no son la misma foto). Es el patrón
 * `<picture>` + `getImageProps` de la documentación de next/image: el navegador baja solo la que
 * corresponde. Cliente porque el cargador de imágenes del proyecto (`images.loaderFile`) es un
 * módulo de cliente. Las fotos son decorativas (`alt=""`) salvo que se indique lo contrario.
 */
export function FotoArte({
  ancha,
  angosta,
  alt = '',
  prioridad = false,
  className,
}: {
  ancha: Fuente;
  angosta: Fuente;
  alt?: string;
  prioridad?: boolean;
  className: string;
}) {
  const comun = { alt, sizes: '100vw', priority: prioridad };
  const {
    props: { srcSet: srcAncha },
  } = getImageProps({ ...comun, ...ancha });
  const {
    props: { srcSet: srcAngosta, ...img },
  } = getImageProps({ ...comun, ...angosta });
  return (
    <picture>
      <source media="(min-width: 64rem)" srcSet={srcAncha} />
      <source srcSet={srcAngosta} />
      <img {...img} alt={alt} className={className} />
    </picture>
  );
}
