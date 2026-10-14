import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { SALVACION } from '@/disenos/contenido';
import { botonPoster } from '../botones';
import { Lema, Titulo } from '../piezas';

/**
 * «Un nuevo comienzo» (#salvacion): bloque azul noche con la foto de adoración, el mensaje y la
 * oración destacada como un recorte de papel con comillas rojas enormes. Cierra con la
 * invitación a contarlo (formulario de contacto, siempre existe).
 */
export function Salvacion() {
  return (
    <section
      id="salvacion"
      aria-labelledby="salvacion-titulo"
      className="@container relative isolate overflow-hidden bg-(--d-noche) text-canvas on-dark"
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 -z-10 hidden w-[45%] @4xl:block"
      >
        <Image
          src="/disenos/poster/alabanza.webp"
          alt=""
          fill
          sizes="40vw"
          className="object-cover object-top opacity-45"
        />
        <span className="absolute inset-0 bg-linear-to-r from-(--d-noche) to-transparent" />
      </div>
      <div className="grid gap-[clamp(1.5rem,4cqi,3rem)] p-[clamp(1.25rem,5cqi,3.5rem)] @4xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] @4xl:items-center">
        <div className="flex flex-col gap-4">
          <Lema className="text-(--d-rojo-claro)">Paso 01 · Conoce a Jesús</Lema>
          <Titulo
            id="salvacion-titulo"
            estilo="negro"
            className="pt-[0.1em] text-[clamp(2.75rem,13cqi,6.5rem)] text-balance font-stretch-[78%] @4xl:text-[clamp(3rem,7.4cqi,6.5rem)]"
          >
            {SALVACION.titulo}
          </Titulo>
          <p className="max-w-[48ch] text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] leading-relaxed text-canvas/90">
            {SALVACION.texto}
          </p>
        </div>
        <figure className="flex flex-col gap-4 bg-canvas p-[clamp(1.25rem,5cqi,2.5rem)] text-ink shadow-[0.6rem_0.6rem_0_var(--color-accent)]">
          <figcaption>
            <Lema as="span" className="text-accent-strong">
              Una oración para empezar
            </Lema>
          </figcaption>
          <span
            aria-hidden="true"
            className="font-display text-[clamp(4.5rem,14cqi,7rem)] leading-[0.5] font-black text-accent"
          >
            “
          </span>
          <blockquote className="font-display text-[clamp(1.375rem,5.6cqi,2.25rem)] leading-[1.1] font-extrabold tracking-[-0.01em] font-stretch-[85%] @4xl:text-[clamp(1.375rem,2.8cqi,2.25rem)]">
            {SALVACION.oracion}
          </blockquote>
          <p className="border-t-2 border-ink pt-3 leading-snug text-ink-soft">
            {SALVACION.siguiente}
          </p>
          <Link href="/contacto#mensaje" className={botonPoster('rojo')}>
            Cuéntanos
            <Icon name="arrowRight" className="d-flecha size-[1.1em]" />
          </Link>
        </figure>
      </div>
    </section>
  );
}
