import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import { Etiqueta } from './Etiqueta';
import { Foto } from './Foto';
import { Titulo } from './Titulo';
import { botonCalida } from './botones';
import { Texto } from './Texto';

/**
 * Tarjeta oscura con foto (imagen 1): en su ancho grande la foto va a la derecha y se funde con
 * el azul noche hacia el texto; angosta (celular), la foto arriba y el texto debajo. `ancha` es
 * el ancho de la tarjeta (container query) desde el que la foto pasa al costado.
 */
function TarjetaOscura({
  foto,
  alt,
  sizes,
  encuadre,
  ancha,
  children,
}: {
  foto: string;
  alt: string;
  sizes: string;
  encuadre: string;
  ancha: 'sm' | '2xl';
  children: ReactNode;
}) {
  const lado =
    ancha === '2xl'
      ? {
          tarjeta: '@2xl:min-h-[clamp(21rem,24vw,23.5rem)] @2xl:justify-center',
          foto: '@2xl:absolute @2xl:inset-y-0 @2xl:right-0 @2xl:h-auto @2xl:w-[60%]',
          velo: '@2xl:bg-linear-to-r @2xl:from-(--d-noche) @2xl:from-0% @2xl:via-(--d-noche)/50 @2xl:via-25% @2xl:to-transparent @2xl:to-65%',
          texto: '@2xl:mt-0 @2xl:max-w-[60%]',
        }
      : {
          tarjeta: '@sm:min-h-[clamp(21rem,24vw,23.5rem)] @sm:justify-center',
          foto: '@sm:absolute @sm:inset-y-0 @sm:right-0 @sm:h-auto @sm:w-[46%]',
          velo: '@sm:bg-linear-to-r @sm:from-(--d-noche) @sm:from-0% @sm:via-(--d-noche)/40 @sm:via-20% @sm:to-transparent @sm:to-60%',
          texto: '@sm:mt-0 @sm:max-w-[64%]',
        };
  return (
    <article
      className={`group @container relative isolate flex flex-col overflow-hidden rounded-[0.875rem] bg-(--d-noche) text-cream on-dark ${lado.tarjeta}`}
    >
      <Foto
        src={foto}
        alt={alt}
        sizes={sizes}
        encuadre={encuadre}
        zoom
        className={`relative -z-10 h-[clamp(13rem,62cqi,19rem)] ${lado.foto}`}
      >
        <span
          aria-hidden="true"
          className={`absolute inset-0 bg-linear-to-t from-(--d-noche) from-0% to-transparent to-50% ${lado.velo}`}
        />
      </Foto>
      <div
        className={`-mt-10 flex flex-col items-start gap-[clamp(0.75rem,2.4cqi,1.125rem)] px-[clamp(1.25rem,6cqi,3.25rem)] pb-[clamp(1.5rem,6cqi,3rem)] @sm:pt-[clamp(1.5rem,6cqi,3rem)] ${lado.texto}`}
      >
        {children}
      </div>
    </article>
  );
}

/** «Una iglesia para la vida real.»: lleva a la página Comunidad de la propuesta. */
export function TarjetaVidaReal() {
  return (
    <TarjetaOscura
      foto="/disenos/calida/vida-real.webp"
      alt="Un joven levanta la mano mientras canta junto al guitarrista en la reunión"
      sizes="(min-width: 64rem) 38vw, 100vw"
      encuadre="object-[35%_center]"
      ancha="2xl"
    >
      <Etiqueta className="text-peach">Comunidad</Etiqueta>
      <Titulo tamano="libre" className="text-[clamp(2.25rem,6cqi,3.5rem)] leading-[0.98]">
        Una iglesia
        <br /> para la <em className="text-cream">vida real.</em>
      </Titulo>
      <Texto className="max-w-[24rem] text-cream/90">
        Personas de todas las edades, creciendo juntas en la fe, sirviendo y compartiendo la vida en
        Riobamba.
      </Texto>
      <Link
        href="/disenos/calida/comunidad"
        className="mt-1 inline-flex items-center gap-3 border-b border-peach/80 pb-1.5 text-[0.95rem] font-medium text-peach transition-colors hover:border-peach"
      >
        Conoce más sobre nuestra comunidad
        <Icon name="arrowRight" className="size-4" />
      </Link>
    </TarjetaOscura>
  );
}

/**
 * «Última prédica» con los datos reales (la del panel o el último culto del canal). El botón va a
 * Prédicas si esa página tiene contenido; si no, al video en YouTube.
 */
export function TarjetaPredica({
  predica,
  verPredicas,
}: {
  predica: { videoId: string; titulo: string; serie: string | null; meta: string };
  verPredicas: boolean;
}) {
  const largo = predica.titulo.length > 22;
  const boton = (
    <>
      <span className="grid size-8 place-items-center rounded-full bg-cream text-(--d-noche)">
        <Icon name="play" className="ml-0.5 size-3.5 fill-current" />
      </span>
      Ver la prédica más reciente
    </>
  );
  const clases = botonCalida('contornoClaro', 'conIcono', 'mt-2');
  return (
    <TarjetaOscura
      foto="/disenos/calida/predicador.webp"
      alt=""
      sizes="(min-width: 64rem) 16vw, 100vw"
      encuadre="object-[50%_20%]"
      ancha="sm"
    >
      <Etiqueta className="text-peach">Última prédica</Etiqueta>
      <Titulo
        tamano="libre"
        className={`${largo ? 'text-[clamp(1.625rem,6.4cqi,2.125rem)]' : 'text-[clamp(2.5rem,12cqi,3.875rem)]'} leading-[1.02] break-words`}
      >
        {predica.titulo}
      </Titulo>
      {predica.serie && (
        <p className="font-display text-[clamp(1.125rem,1rem+0.4vw,1.3125rem)] leading-tight">
          Serie {predica.serie}
        </p>
      )}
      {predica.meta && (
        <p className="text-[clamp(0.95rem,0.92rem+0.2vw,1.0625rem)] text-cream/85">
          {predica.meta}
        </p>
      )}
      {verPredicas ? (
        <Link href="/predicas" className={clases}>
          {boton}
        </Link>
      ) : (
        <a
          href={`https://www.youtube.com/watch?v=${predica.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className={clases}
        >
          {boton}
          <span className="sr-only"> (abre YouTube en una pestaña nueva)</span>
        </a>
      )}
    </TarjetaOscura>
  );
}
