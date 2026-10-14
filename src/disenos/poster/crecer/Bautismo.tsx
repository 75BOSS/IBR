import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { BAUTISMO } from '@/disenos/contenido';
import { Acordeon } from '../Acordeon';
import { botonPoster } from '../botones';
import { Lema, Raya, Titulo } from '../piezas';

/**
 * El bautismo (#bautismo): foto con el aviso de la próxima fecha (de EJEMPLO, así lo dice) en
 * una etiqueta roja, la explicación y sus preguntas en acordeón; termina con «Quiero
 * bautizarme» (formulario de contacto).
 */
export function Bautismo() {
  return (
    <section
      id="bautismo"
      aria-labelledby="bautismo-titulo"
      className="grid gap-[clamp(1.5rem,4cqi,3rem)] @4xl/pagina:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] @4xl/pagina:items-start"
    >
      <div className="flex flex-col gap-4 @4xl/pagina:sticky @4xl/pagina:top-6">
        <Lema className="text-accent">Paso 02 · Bautízate</Lema>
        <Titulo
          id="bautismo-titulo"
          estilo="negro"
          className="pt-[0.1em] text-[clamp(2.5rem,13cqi,6rem)] font-stretch-[80%] @4xl/pagina:text-[7cqi]"
        >
          El <em>bautismo</em>
        </Titulo>
        <Raya />
        <div className="group relative aspect-[4/3] overflow-hidden border-2 border-ink">
          <Image
            src="/fotos-ejemplo/evento-bautismos.webp"
            alt="Dos hermanas se abrazan emocionadas después de un bautismo"
            fill
            sizes="(min-width: 64rem) 35vw, 100vw"
            className="d-foto object-cover"
          />
          <p className="absolute bottom-0 left-0 max-w-[90%] bg-accent px-4 py-2 font-display text-[clamp(0.9375rem,0.85rem+0.4vw,1.125rem)] leading-snug font-bold text-canvas">
            {BAUTISMO.proximo}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-[clamp(1.25rem,3cqi,2rem)]">
        <p className="font-display text-[clamp(1.375rem,1.1rem+1.1vw,2.25rem)] leading-[1.12] font-extrabold tracking-[-0.015em] text-balance font-stretch-[88%]">
          {BAUTISMO.texto}
        </p>
        <Acordeon preguntas={BAUTISMO.preguntas} />
        <Link href="/contacto#mensaje" className={botonPoster('tinta')}>
          Quiero bautizarme
          <Icon name="arrowRight" className="d-flecha size-[1.1em]" />
        </Link>
      </div>
    </section>
  );
}
