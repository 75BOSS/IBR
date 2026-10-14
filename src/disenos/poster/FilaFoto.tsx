import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import { Titulo } from './piezas';

/**
 * Fila con foto, titular condensado, una línea de texto y su acción. Se ajusta a su contenedor:
 * angosta (celular, «Conecta» de la imagen 15) es foto + texto + flecha; ancha (Comunidad,
 * imagen 14) suma la línea vertical y la acción escrita en rojo («Explorar →»). Toda la fila es
 * clic (la acción se estira encima); los enlaces de `detalle` quedan por encima de ella. Al pasar
 * el cursor la foto pasa de gris a color, el titular se pone rojo y la flecha avanza.
 */
export function FilaFoto({
  foto,
  alt = '',
  titulo,
  texto,
  href,
  accion,
  nivel = 'h3',
  detalle,
}: {
  foto: string;
  alt?: string;
  titulo: string;
  texto: string;
  href: string;
  /** Verbo de la acción («Explorar»); el lector de pantalla oye «Explorar grupos en casa». */
  accion: string;
  nivel?: 'h2' | 'h3';
  detalle?: ReactNode;
}) {
  // Ancha y con detalle: la foto y la acción ocupan los cuatro renglones; el texto y el detalle
  // van en los dos del medio, centrados entre dos renglones elásticos.
  const ancha = detalle
    ? {
        grilla: '@3xl:grid-rows-[1fr_auto_auto_1fr]',
        foto: '@3xl:row-span-4',
        texto: '@3xl:col-start-2 @3xl:row-start-2',
        accion: '@3xl:col-start-3 @3xl:row-span-4 @3xl:row-start-1',
      }
    : { grilla: '', foto: '', texto: '@3xl:self-center', accion: '' };
  return (
    <article className="group @container relative">
      <div
        className={`grid grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)_auto] items-center gap-x-[3.6cqi] gap-y-[3cqi] p-[2.2cqi] @3xl:grid-cols-[minmax(0,32fr)_minmax(0,49fr)_minmax(0,19fr)] @3xl:gap-x-[3.2cqi] @3xl:gap-y-[1cqi] @3xl:p-0 @3xl:pr-[2cqi] ${ancha.grilla}`}
      >
        {/* Sin proporción fija: la foto llena su celda (alta si la fila crece con el detalle). */}
        <div
          className={`relative min-h-[18cqi] self-stretch overflow-hidden rounded-[0.4rem] @3xl:min-h-[14.4cqi] @3xl:rounded-none ${ancha.foto}`}
        >
          <Image
            src={foto}
            alt={alt}
            fill
            sizes="(min-width: 64rem) 28vw, 45vw"
            className="d-foto object-cover"
          />
        </div>
        <div
          className={`flex flex-col gap-[0.6cqi] self-stretch border-l-2 border-ink py-[1cqi] pl-[3.6cqi] @3xl:border-l-0 @3xl:py-0 @3xl:pl-0 ${ancha.texto}`}
        >
          <Titulo
            as={nivel}
            estilo="condensado"
            className="text-[clamp(1.125rem,5.6cqi,2rem)] group-hover:text-accent @3xl:text-[clamp(1.75rem,4.7cqi,3.75rem)]"
          >
            {titulo}
          </Titulo>
          <p className="text-[clamp(0.8125rem,3.6cqi,1.0625rem)] leading-snug text-ink @3xl:text-[clamp(1rem,2.15cqi,1.75rem)]">
            {texto}
          </p>
        </div>
        <Link
          href={href}
          className={`flex items-center gap-[0.45em] self-stretch font-display text-[clamp(1.125rem,2.2cqi,1.75rem)] font-bold text-accent font-stretch-[92%] after:absolute after:inset-0 @3xl:my-[4.5cqi] @3xl:border-l-2 @3xl:border-ink @3xl:pl-[4cqi] ${ancha.accion}`}
        >
          <span className="sr-only @3xl:not-sr-only">{accion}</span>
          <span className="sr-only"> {titulo.toLowerCase()}</span>
          <Icon
            name="arrowRight"
            className="d-flecha size-[clamp(1.375rem,6cqi,1.75rem)] text-ink @3xl:size-[1.1em] @3xl:text-accent"
          />
        </Link>
        {detalle && (
          <div className="relative z-10 col-span-3 pb-[1cqi] @3xl:col-span-1 @3xl:col-start-2 @3xl:row-start-3 @3xl:pb-[2.4cqi]">
            {detalle}
          </div>
        )}
      </div>
    </article>
  );
}
