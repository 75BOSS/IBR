import Link from 'next/link';
import { Contenedor } from '@/disenos/vibrante/Contenedor';
import { FlechaEnlace } from '@/disenos/vibrante/FlechaEnlace';
import { Titular } from '@/disenos/vibrante/Titular';
import { toneVar } from '@/lib/css-vars';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import type { GrupoPublico } from '@/lib/grupos-public';

const MAXIMO = 6;

/** «Miércoles · 19:30» o «Día por confirmar». */
function cuando(g: Pick<GrupoPublico, 'dia_semana' | 'hora'>): string {
  if (!g.dia_semana) return 'Día por confirmar';
  return `${DAY_NAMES[g.dia_semana]}${g.hora ? ` · ${formatTime(g.hora)}` : ''}`;
}

/**
 * «Encuentra tu grupo.»: los grupos en casa del directorio público (día, nombre, zona y edad,
 * con el color de su ministerio). Cada fila lleva a la ficha del grupo. Sin grupos, no existe.
 */
export function GruposSemana({ grupos }: { grupos: GrupoPublico[] }) {
  if (grupos.length === 0) return null;
  const visibles = grupos.slice(0, MAXIMO);
  return (
    <section aria-labelledby="grupos-titulo">
      <Contenedor className="grid gap-[clamp(1.5rem,4vw,4rem)] py-[clamp(3rem,8vw,6rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="@container flex flex-col gap-4 self-start">
          <p className="eyebrow text-accent">Grupos en casa</p>
          <Titular id="grupos-titulo" tamano="columna">
            Encuentra tu <em>grupo.</em>
          </Titular>
          <p className="max-w-[38ch] text-[clamp(1rem,0.95rem+0.2vw,1.125rem)] leading-snug">
            Grupos en casas por toda la ciudad: elige el día y el lugar que mejor te queden.
          </p>
          <FlechaEnlace href="/grupos">
            {grupos.length > MAXIMO ? `Ver los ${grupos.length} grupos` : 'Ver todos los grupos'}
          </FlechaEnlace>
        </div>
        <ul className="grid gap-x-[clamp(1rem,3vw,2.5rem)] md:grid-cols-2">
          {visibles.map((g) => (
            <li key={g.id} style={toneVar(g.rango_color, 'var(--color-accent)')}>
              <Link
                href={`/grupos/${g.id}`}
                className="group flex h-full flex-col gap-1 border-t-2 border-ink py-[clamp(0.875rem,2vw,1.25rem)]"
              >
                <span className="caps text-accent">{cuando(g)}</span>
                <span className="font-display text-[clamp(1.25rem,1.05rem+0.8vw,1.625rem)] leading-tight font-black tracking-[-0.03em] group-hover:underline">
                  {g.nombre}
                </span>
                <span className="flex flex-wrap items-center gap-x-2 text-ink-soft">
                  {g.rango_edad && (
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden="true" className="size-2.5 rounded-full bg-(--tone)" />
                      {g.rango_edad}
                    </span>
                  )}
                  {g.zona && <span>· {g.zona}</span>}
                  {!g.zona && g.ubicacion_tipo === 'en_linea' && <span>· En línea</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Contenedor>
    </section>
  );
}
