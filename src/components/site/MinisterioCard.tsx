import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { toneVar } from '@/lib/css-vars';
import { type Ministerio, edadText, ministerioName } from '@/lib/ministerios';

/** Fondo de los ministerios sin color propio: tonos de la marca, para que no salgan todos iguales. */
const FALLBACK_TONES = [
  'var(--color-brand-strong)',
  'var(--color-electric)',
  'var(--color-night)',
  'var(--color-electric-strong)',
  'var(--color-accent-strong)',
];

/**
 * Ministerio como tarjeta de foto (inicio y /ministerios). Sin foto, su color con la inicial
 * grande. El velo oscuro de abajo garantiza el contraste del nombre sobre cualquier foto.
 */
function MinisterioCard({
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
      className={`group relative isolate flex h-full flex-col justify-end overflow-hidden rounded-(--radius-frame) bg-(--tone) text-surface on-dark ${
        featured ? 'min-h-[clamp(13rem,30vw,20rem)]' : 'min-h-[clamp(11rem,22vw,15rem)]'
      }`}
      style={toneVar(m.color, FALLBACK_TONES[m.id % FALLBACK_TONES.length])}
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
          className="absolute -top-8 -right-4 -z-20 font-script text-[clamp(9rem,6rem+11vw,15rem)] leading-none text-surface/20 transition-transform duration-700 ease-(--ease-out-soft) motion-safe:group-hover:-translate-x-3"
        >
          {name.charAt(0)}
        </span>
      )}
      <span className="absolute inset-0 -z-10 bg-gradient-to-t from-night/90 via-night/35 to-transparent" />
      <span className="absolute top-[clamp(0.875rem,2vw,1.5rem)] right-[clamp(0.875rem,2vw,1.5rem)] grid size-10 place-items-center rounded-full bg-surface/15 ring-1 ring-surface/40 transition group-hover:bg-surface group-hover:text-ink md:size-11">
        <Icon name="arrowUpRight" className="size-5" />
      </span>
      <span className="flex flex-col gap-2 p-[clamp(1rem,3vw,2rem)]">
        <span className="caps text-surface/85">
          {[m.nombre_ministerio ? m.nombre : null, edad].filter(Boolean).join(' · ') ||
            'Ministerio'}
        </span>
        <span
          className={`font-headline leading-none ${
            featured
              ? 'text-[clamp(1.625rem,1.2rem+1.6vw,2.5rem)]'
              : 'text-[clamp(1.25rem,1rem+0.9vw,1.75rem)]'
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
 * Lugar de cada ministerio en la grilla: uno por fila en celulares chicos (< 360 px), de a dos en
 * celular y tablet, 6 columnas en escritorio. Los dos primeros grandes y el resto más chicos; la
 * última fila siempre llena el ancho, tengan contenido 3, 4 o 7 ministerios.
 */
function ministerioSpan(index: number, total: number): string {
  if (index < 2) return 'xs:col-span-2 md:col-span-1 lg:col-span-3';
  const rest = total - 2;
  const pos = index - 2;
  // De a dos: si quedan impares, el último ocupa la fila entera.
  const small = rest % 2 === 1 && pos === rest - 1 ? 'xs:col-span-2' : '';
  // Escritorio: de a tres; la última fila se reparte el ancho entre los que quedan, sin huecos.
  const lastRowCount = rest % 3 || 3;
  const large =
    pos < rest - lastRowCount
      ? 'lg:col-span-2'
      : lastRowCount === 1
        ? 'lg:col-span-6'
        : lastRowCount === 2
          ? 'lg:col-span-3'
          : 'lg:col-span-2';
  return `${small} ${large}`;
}

/** Grilla de ministerios (inicio, /ministerios y Soy nuevo): la misma en todo el sitio. */
export function MinisteriosGrid({ ministerios }: { ministerios: Ministerio[] }) {
  return (
    <ul className="grid gap-3 xs:grid-cols-2 lg:grid-cols-6">
      {ministerios.map((m, i) => (
        <li key={m.id} className={`reveal ${ministerioSpan(i, ministerios.length)}`}>
          <MinisterioCard
            ministerio={m}
            featured={i < 2}
            sizes={i < 2 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 1024px) 33vw, 50vw'}
          />
        </li>
      ))}
    </ul>
  );
}
