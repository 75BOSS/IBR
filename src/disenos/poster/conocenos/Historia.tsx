import Image from 'next/image';
import { HISTORIA } from '@/disenos/contenido';
import { paragraphs } from '@/lib/text';
import { CabeceraSeccion, Lema } from '../piezas';

/**
 * «Nuestra historia» como una nota de periódico: la foto grande con su pie y el texto que la
 * iglesia escribió en el panel (config.nosotros_historia) con letra capital roja.
 * Sin texto en el panel, un párrafo breve de ejemplo.
 */
export function Historia({
  historia,
  imagen,
  nombre,
}: {
  historia: string | null;
  imagen: string | null;
  nombre: string;
}) {
  const parrafos = paragraphs(historia);
  const texto =
    parrafos.length > 0
      ? parrafos
      : [
          `${nombre} empezó como un grupo pequeño que se reunía en una casa. ${HISTORIA[0]?.texto ?? ''}`,
        ];
  return (
    <section id="historia" aria-labelledby="historia-titulo" className="flex flex-col gap-1">
      <CabeceraSeccion
        id="historia-titulo"
        lema="Nuestra historia"
        titulo={
          <>
            Cómo <em>empezó</em>
          </>
        }
      />
      <div className="grid gap-[clamp(1.25rem,3cqi,2.5rem)] pt-[clamp(0.5rem,1.5cqi,1rem)] @4xl/pagina:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <figure className="group flex flex-col gap-2">
          <div className="relative aspect-[16/10] overflow-hidden border-2 border-ink">
            <Image
              src={imagen ?? '/fotos-ejemplo/nosotros.webp'}
              alt="Hermanos de la iglesia celebran juntos durante un culto"
              fill
              sizes="(min-width: 64rem) 45vw, 100vw"
              className="d-foto object-cover"
            />
          </div>
          <figcaption>
            <Lema as="span" tamano="text-[0.75rem]" className="text-ink-soft">
              {nombre} · Riobamba
            </Lema>
          </figcaption>
        </figure>
        <div className="flex max-w-[62ch] flex-col gap-4 text-[clamp(1.0625rem,1rem+0.25vw,1.25rem)] leading-relaxed">
          {texto.map((p, n) => (
            <p
              key={n}
              className={
                n === 0
                  ? 'first-letter:float-left first-letter:mt-[0.06em] first-letter:mr-2 first-letter:font-display first-letter:text-[4.2em] first-letter:leading-[0.78] first-letter:font-black first-letter:text-accent'
                  : undefined
              }
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
