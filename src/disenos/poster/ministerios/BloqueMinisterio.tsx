import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { toneVar } from '@/lib/css-vars';
import type { Horario } from '../horarios';
import { SigueCursor } from '../movimiento/SigueCursor';
import { Lema, Numero, Titulo } from '../piezas';

export type MinisterioBloque = {
  slug: string;
  nombre: string;
  edad: string | null;
  descripcion: string | null;
  imagen: string | null;
  color: string | null;
  horarios: Horario[];
  grupos: { id: number; nombre: string; cuando: string | null }[];
};

/**
 * Un ministerio real como página de periódico: la foto a un lado (alterna izquierda y derecha),
 * el número y el nombre enormes, las edades, una raya de su color (rangos_edad.color, como
 * variable --tone), la descripción, cuándo se reúne y sus grupos. La foto y «Conocer más» llevan
 * a su página; la sección tiene el id del slug para las anclas del menú (#kids, #jovenes…).
 */
export function BloqueMinisterio({ m, indice }: { m: MinisterioBloque; indice: number }) {
  const invertido = indice % 2 === 1;
  return (
    <section
      id={m.slug}
      aria-labelledby={`${m.slug}-titulo`}
      style={toneVar(m.color, 'var(--color-accent)')}
      className="grid reveal gap-1 border-t-4 border-(--tone) pt-1 @4xl/pagina:grid-cols-2"
    >
      <Link
        href={`/ministerios/${m.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className={`group relative block min-h-[clamp(15rem,55vw,26rem)] ${invertido ? '@4xl/pagina:order-last' : ''}`}
      >
        <SigueCursor
          etiqueta="Ver"
          className="absolute inset-0 overflow-hidden border-2 border-ink"
        >
          {m.imagen ? (
            <Image
              src={m.imagen}
              alt=""
              fill
              sizes="(min-width: 64rem) 40vw, 100vw"
              className="d-foto object-cover"
            />
          ) : (
            <span className="absolute inset-0 bg-(--tone)" />
          )}
        </SigueCursor>
      </Link>
      <div className="@container flex flex-col gap-[clamp(0.875rem,3cqi,1.5rem)] border-2 border-ink p-[clamp(1.125rem,5cqi,2.5rem)]">
        <div className="flex items-start justify-between gap-4">
          <Numero className="text-[clamp(3rem,16cqi,6rem)] text-(--tone)">
            {String(indice + 1).padStart(2, '0')}
          </Numero>
          {m.edad && (
            <span className="border-2 border-ink px-3 py-1.5 font-display text-[clamp(0.875rem,3.4cqi,1.0625rem)] font-bold whitespace-nowrap">
              {m.edad}
            </span>
          )}
        </div>
        <Titulo
          as="h2"
          id={`${m.slug}-titulo`}
          estilo="negro"
          className="pt-[0.1em] text-[clamp(2.25rem,13cqi,5rem)] hyphens-auto font-stretch-[78%]"
        >
          {m.nombre}
        </Titulo>
        {m.descripcion && (
          <p className="max-w-[56ch] text-[clamp(1rem,0.95rem+0.3vw,1.1875rem)] leading-relaxed">
            {m.descripcion}
          </p>
        )}
        {(m.horarios.length > 0 || m.grupos.length > 0) && (
          <dl className="grid gap-x-6 gap-y-4 border-t-2 border-ink pt-[clamp(0.875rem,3cqi,1.25rem)] @lg:grid-cols-2">
            {m.horarios.length > 0 && (
              <div className="flex flex-col gap-1">
                <dt>
                  <Lema as="span" tamano="text-[0.75rem]" className="text-accent">
                    Cuándo
                  </Lema>
                </dt>
                {m.horarios.map((h) => (
                  <dd
                    key={`${h.dia}-${h.hora}`}
                    className="font-display text-[1.25rem] leading-tight font-extrabold font-stretch-[85%]"
                  >
                    {h.dia} {h.hora}
                    <span className="block font-sans text-sm font-normal text-ink-soft">
                      {h.nombres.join(' · ')}
                    </span>
                  </dd>
                ))}
              </div>
            )}
            {m.grupos.length > 0 && (
              <div className="flex flex-col gap-1">
                <dt>
                  <Lema as="span" tamano="text-[0.75rem]" className="text-accent">
                    Grupos
                  </Lema>
                </dt>
                {m.grupos.slice(0, 4).map((g) => (
                  <dd key={g.id}>
                    <Link href={`/grupos/${g.id}`} className="link-quiet font-semibold">
                      {g.nombre}
                    </Link>
                    {g.cuando && <span className="block text-sm text-ink-soft">{g.cuando}</span>}
                  </dd>
                ))}
              </div>
            )}
          </dl>
        )}
        <Link
          href={`/ministerios/${m.slug}`}
          className="group mt-auto inline-flex min-h-11 w-fit items-center gap-2 font-display text-[clamp(1.0625rem,1rem+0.4vw,1.375rem)] font-bold text-accent font-stretch-[92%]"
        >
          Conocer más<span className="sr-only"> sobre {m.nombre}</span>
          <Icon name="arrowRight" className="d-flecha size-[1.1em]" />
        </Link>
      </div>
    </section>
  );
}
