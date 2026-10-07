import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { type Ministerio, edadText, ministerioName } from '@/lib/ministerios';

/**
 * Ministerio como tarjeta de foto (inicio y /ministerios). Sin foto, su color con la inicial
 * grande. El velo oscuro de abajo garantiza el contraste del nombre sobre cualquier foto.
 */
export function MinisterioCard({
  ministerio: m,
  sizes,
  featured = false,
}: {
  ministerio: Ministerio;
  sizes: string;
  /** Más alta y con la descripción: rompe la grilla de tarjetas iguales. */
  featured?: boolean;
}) {
  const edad = edadText(m);
  const name = ministerioName(m);
  return (
    <Link
      href={`/ministerios/${m.slug}`}
      className={`group relative isolate flex h-full flex-col justify-end overflow-hidden rounded-(--radius-frame) text-surface on-dark ${
        featured ? 'min-h-[clamp(17rem,50vw,32rem)]' : 'min-h-[clamp(13rem,40vw,24rem)]'
      }`}
      style={{ backgroundColor: m.color ?? 'var(--color-brand-strong)' }}
    >
      {m.imagen_url ? (
        <Image
          src={m.imagen_url}
          alt=""
          fill
          sizes={sizes}
          className="-z-20 object-cover transition-transform duration-700 ease-(--ease-out-soft) motion-safe:group-hover:scale-105"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute -top-8 -right-4 -z-20 font-display text-[clamp(12rem,8rem+18vw,20rem)] leading-none text-surface/20 italic transition-transform duration-700 ease-(--ease-out-soft) motion-safe:group-hover:-translate-x-3"
        >
          {name.charAt(0)}
        </span>
      )}
      <span className="absolute inset-0 -z-10 bg-gradient-to-t from-night/90 via-night/35 to-transparent" />
      <span className="absolute top-[clamp(0.875rem,2vw,1.5rem)] right-[clamp(0.875rem,2vw,1.5rem)] grid size-10 place-items-center rounded-full bg-surface/15 ring-1 ring-surface/40 transition group-hover:bg-surface group-hover:text-ink md:size-11">
        <Icon name="arrowUpRight" className="size-5" />
      </span>
      <span className="flex flex-col gap-2 p-[clamp(1rem,3vw,2rem)]">
        <span className="text-[0.7rem] font-bold tracking-[0.18em] text-surface/85 uppercase md:text-xs">
          {[m.nombre_ministerio ? m.nombre : null, edad].filter(Boolean).join(' · ') ||
            'Ministerio'}
        </span>
        <span
          className={`font-headline leading-none ${
            featured
              ? 'text-[clamp(1.875rem,1.2rem+2.6vw,3.25rem)]'
              : 'text-[clamp(1.375rem,1rem+1.8vw,2.5rem)]'
          }`}
        >
          {name}
        </span>
        {(m.grupos > 0 || m.reuniones > 0) && (
          <span className="text-sm text-surface/80">
            {[
              m.reuniones > 0
                ? `${m.reuniones} ${m.reuniones === 1 ? 'reunión' : 'reuniones'}`
                : null,
              m.grupos > 0 ? `${m.grupos} ${m.grupos === 1 ? 'grupo' : 'grupos'}` : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </span>
        )}
        {featured && m.descripcion && (
          <span className="line-clamp-2 max-w-md text-surface/85">{m.descripcion}</span>
        )}
      </span>
    </Link>
  );
}

/**
 * Lugar de cada ministerio en la grilla (2 columnas en celular, 6 en escritorio): los dos
 * primeros grandes; si al final sobra uno solo, ocupa el ancho de la fila en celular y tablet.
 */
export function ministerioSpan(index: number, total: number): string {
  if (index < 2) return 'col-span-2 md:col-span-1 lg:col-span-3';
  const oddRest = (total - 2) % 2 === 1;
  if (oddRest && index === total - 1) return 'col-span-2 lg:col-span-2';
  return 'col-span-1 lg:col-span-2';
}
