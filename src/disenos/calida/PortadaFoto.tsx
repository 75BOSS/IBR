'use client';

import { getImageProps } from 'next/image';

/**
 * Foto de la portada con dirección de arte (`<picture>`): en el celular la foto vertical de la
 * imagen 3 (se desvanece detrás del titular) y desde tablet la horizontal de la imagen 1. Un solo
 * `<img>`: el navegador baja solo la que corresponde. Es componente cliente porque el cargador de
 * imágenes del proyecto (`images.loaderFile`) es un módulo cliente.
 */
export function PortadaFoto({ className = '' }: { className?: string }) {
  const comun = {
    alt: 'Jóvenes de la iglesia en una reunión de domingo',
    sizes: '(min-width: 64rem) 58vw, 56vw',
    priority: true,
  };
  const {
    props: { srcSet: ancha },
  } = getImageProps({ ...comun, src: '/disenos/calida/hero.webp', width: 884, height: 420 });
  const {
    props: { srcSet: vertical, ...resto },
  } = getImageProps({ ...comun, src: '/disenos/calida/hero-movil.webp', width: 322, height: 624 });
  return (
    <picture>
      <source media="(min-width: 48rem)" srcSet={ancha} />
      <img {...resto} srcSet={vertical} alt={comun.alt} className={className} />
    </picture>
  );
}
