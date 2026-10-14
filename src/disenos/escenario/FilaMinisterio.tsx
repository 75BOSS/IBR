import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { toneVar } from '@/lib/css-vars';
import { Foto } from './Foto';

export type DatoMinisterio = { texto: string; href?: string };

export type Ministerio = {
  /** Ancla de la fila (#kids, #mujeres…): el slug del ministerio. */
  id: string;
  nombre: string;
  /** Edades («3 a 11 años») o a quién está dirigido. */
  para: string | null;
  texto: string | null;
  foto: { src: string; alt: string } | null;
  /** Color propio del ministerio (BD); sin él, el azul de la marca. */
  tono: string | null;
  /** Cuándo se reúne: reuniones y grupos reales. */
  reuniones: DatoMinisterio[];
  grupos: DatoMinisterio[];
  enlace: React.ReactNode;
};

/** Lista de datos con ícono (reuniones o grupos) dentro de una fila. */
function Datos({
  titulo,
  icono,
  datos,
}: {
  titulo: string;
  icono: 'calendar' | 'users';
  datos: DatoMinisterio[];
}) {
  if (datos.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <p className="caps text-ink-soft">{titulo}</p>
      <ul className="flex flex-wrap gap-2">
        {datos.map((d) => {
          const contenido = (
            <>
              <Icon name={icono} className="size-4 shrink-0 text-accent" />
              <span className="min-w-0 [overflow-wrap:anywhere]">{d.texto}</span>
            </>
          );
          const clase =
            'inline-flex min-h-9 items-center gap-2 rounded-full bg-sunken px-3.5 py-1 text-sm font-semibold text-ink';
          return (
            <li key={d.texto} className="max-w-full">
              {d.href ? (
                <Link
                  href={d.href}
                  className={`${clase} ring-1 ring-line transition-colors hover:bg-accent-soft`}
                >
                  {contenido}
                </Link>
              ) : (
                <span className={clase}>{contenido}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Filas de Ministerios: foto con telón y texto lado a lado, alternando el lado en cada fila (en
 * angosto, la foto arriba). Un número grande en la serifa roja, el color del ministerio en la
 * raya del nombre, sus reuniones y grupos reales y el enlace a su página. Mide su contenedor.
 */
export function FilasMinisterio({ ministerios }: { ministerios: Ministerio[] }) {
  return (
    <div className="@container">
      <ol className="flex flex-col gap-[clamp(2.5rem,7cqi,4.5rem)]">
        {ministerios.map((m, i) => (
          <li
            key={m.id}
            id={m.id}
            className="group/fila grid items-center gap-[clamp(1.25rem,4cqi,3.5rem)] @3xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
          >
            <div className="relative @3xl:group-even/fila:order-last">
              {m.foto ? (
                <Foto
                  src={m.foto.src}
                  alt={m.foto.alt}
                  sizes="(min-width: 64rem) 34rem, 100vw"
                  marco="aspect-[16/10] rounded-[1.5rem] shadow-card"
                />
              ) : (
                <div className="aspect-[16/10] rounded-[1.5rem] bg-(--d-marino)" />
              )}
              <span
                aria-hidden="true"
                className="absolute -bottom-[0.32em] left-[0.18em] font-serif text-[clamp(4rem,12cqi,7rem)] leading-none font-black text-(--d-rojo) italic [text-shadow:0_0.04em_0_var(--color-canvas)] @3xl:group-even/fila:right-[0.18em] @3xl:group-even/fila:left-auto"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="flex flex-col items-start gap-[clamp(0.75rem,2cqi,1rem)] pt-6 @3xl:pt-0">
              {m.para && (
                <p className="inline-flex items-center gap-2 caps text-accent">
                  <span
                    aria-hidden="true"
                    style={toneVar(m.tono)}
                    className="size-2.5 rounded-full bg-(--tone)"
                  />
                  {m.para}
                </p>
              )}
              <h2 className="font-headline text-[clamp(2rem,1.4rem+3cqi,3.5rem)] leading-[1] font-extrabold tracking-[-0.045em] [overflow-wrap:anywhere] text-ink">
                {m.nombre}
              </h2>
              {m.texto && (
                <p className="max-w-[34rem] text-[clamp(1.0625rem,1rem+0.25vw,1.1875rem)] text-ink-soft">
                  {m.texto}
                </p>
              )}
              <Datos titulo="Cuándo nos reunimos" icono="calendar" datos={m.reuniones} />
              <Datos titulo="Grupos" icono="users" datos={m.grupos} />
              {m.enlace}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
