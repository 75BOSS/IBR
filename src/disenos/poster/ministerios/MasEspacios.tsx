import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { MINISTERIOS_EXTRA } from '@/disenos/contenido';
import { CabeceraSeccion, Lema, Titulo } from '../piezas';

/** Foto de cada ministerio de ejemplo (fotos compartidas de las propuestas). */
const FOTOS: Record<string, { src: string; alt: string }> = {
  mujeres: {
    src: '/fotos-ejemplo/grupo-mujeres.webp',
    alt: 'Dos amigas conversan y ríen en un encuentro',
  },
  matrimonios: {
    src: '/fotos-ejemplo/grupo-matrimonios.webp',
    alt: 'Parejas conversan en un grupo de matrimonios',
  },
  hombres: {
    src: '/fotos-ejemplo/evento-retiro.webp',
    alt: 'Hombres de la iglesia comparten en un retiro',
  },
};

/**
 * Mujeres, Matrimonios y Hombres (contenido de EJEMPLO, aún no son rangos de edad en la BD):
 * tres columnas de periódico con foto (gris que pasa a color), para quién es, el nombre, la
 * explicación y «Quiero participar» (formulario de contacto). Cada una con su id (#mujeres…).
 * La del medio va en rojo para romper la grilla.
 */
export function MasEspacios() {
  return (
    <section aria-labelledby="mas-espacios" className="flex flex-col gap-1">
      <CabeceraSeccion
        id="mas-espacios"
        lema="Para cada etapa"
        titulo={
          <>
            Más <em>espacios</em>
          </>
        }
      />
      <div className="grid gap-1 @4xl/pagina:grid-cols-3">
        {MINISTERIOS_EXTRA.map((m, n) => {
          const foto = FOTOS[m.slug];
          const rojo = n === 1;
          return (
            <article
              key={m.slug}
              id={m.slug}
              aria-labelledby={`${m.slug}-titulo`}
              className={`group @container flex flex-col ${
                rojo ? 'bg-accent text-canvas on-dark' : 'd-invierte border-2 border-(--inv-borde)'
              }`}
            >
              {foto && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    sizes="(min-width: 64rem) 28vw, 100vw"
                    className="d-foto object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-3 p-[clamp(1.125rem,7cqi,2rem)]">
                <Lema
                  as="span"
                  tamano="text-[0.75rem]"
                  className={rojo ? '' : 'text-(--inv-acento)'}
                >
                  {m.para}
                </Lema>
                <Titulo
                  as="h3"
                  id={`${m.slug}-titulo`}
                  estilo="negro"
                  className="pt-[0.1em] text-[clamp(2rem,12cqi,3.5rem)] hyphens-auto font-stretch-[80%]"
                >
                  {m.nombre}
                </Titulo>
                <p
                  className={`flex-1 leading-snug ${rojo ? 'text-canvas/90' : 'text-(--inv-suave)'}`}
                >
                  {m.texto}
                </p>
                <Link
                  href="/contacto#mensaje"
                  className={`inline-flex min-h-11 w-fit items-center gap-2 font-display text-[1.125rem] font-bold font-stretch-[92%] ${
                    rojo ? '' : 'text-(--inv-acento)'
                  }`}
                >
                  Quiero participar<span className="sr-only"> en {m.nombre}</span>
                  <Icon name="arrowRight" className="d-flecha size-[1.1em]" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
