import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { formatDateTime } from '@/lib/dates';
import type { Evento } from '@/lib/eventos';
import { CONTENEDOR, CURSIVA, Etiqueta } from './ui';

type EventoBreve = Pick<
  Evento,
  'id' | 'slug' | 'titulo' | 'resumen' | 'fecha_inicio' | 'todo_el_dia' | 'ubicacion'
>;

function cuando(e: EventoBreve): string {
  return formatDateTime(
    e.fecha_inicio,
    e.todo_el_dia
      ? { weekday: 'long', day: 'numeric', month: 'long' }
      : { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' },
  );
}

/** Día grande en Poppins y el mes en la itálica durazno, como la portada. */
function Fecha({ fecha, grande = false }: { fecha: Date; grande?: boolean }) {
  return (
    <span aria-hidden="true" className="flex shrink-0 flex-col items-center leading-none">
      <span
        className={`font-display font-extrabold tracking-[-0.04em] ${
          grande ? 'text-[clamp(3.5rem,14cqi,5.5rem)]' : 'text-[clamp(2rem,1.7rem+1vw,2.5rem)]'
        }`}
      >
        {formatDateTime(fecha, { day: 'numeric' })}
      </span>
      <span
        className={`text-peach ${CURSIVA} ${grande ? 'text-[clamp(1.5rem,6cqi,2.25rem)]' : 'text-lg'}`}
      >
        {formatDateTime(fecha, { month: 'long' })}
      </span>
    </span>
  );
}

/**
 * «Lo que viene» (no está en las imágenes: completa el inicio con los eventos reales). El más
 * próximo va grande y los siguientes en filas, para no hacer una grilla de tarjetas iguales.
 */
export function Eventos({ eventos, verTodos }: { eventos: EventoBreve[]; verTodos: boolean }) {
  const [primero, ...resto] = eventos;
  if (!primero) return null;
  return (
    <section aria-labelledby="eventos-titulo" className="bg-(--d-marino) text-cream on-dark">
      <div
        className={`${CONTENEDOR} flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)] py-[clamp(3rem,8vw,5.5rem)]`}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <Etiqueta className="text-(--d-arena)">Agenda</Etiqueta>
            <h2
              id="eventos-titulo"
              className="font-display text-[clamp(2.125rem,1.3rem+3.3vw,3.875rem)] leading-[0.98] font-extrabold tracking-[-0.035em]"
            >
              Lo que <em>viene.</em>
            </h2>
          </div>
          {verTodos && (
            <Link
              href="/eventos"
              className="group inline-flex items-center gap-2 font-display font-semibold hover:text-peach"
            >
              Ver todos
              <Icon
                name="arrowRight"
                className="size-5 transition-transform motion-safe:group-hover:translate-x-1"
              />
            </Link>
          )}
        </div>
        <ul
          className={`grid gap-[clamp(0.75rem,1.5vw,1rem)] ${resto.length > 0 ? 'lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]' : ''}`}
        >
          <li className="@container">
            <Link
              href={`/eventos/${primero.slug}`}
              className="group flex h-full flex-col gap-5 rounded-xl bg-(--d-tinta) p-[clamp(1.25rem,5cqi,2.5rem)] ring-1 ring-cream/10 transition-colors hover:ring-peach/60 @md:flex-row @md:items-center @md:gap-[clamp(1.5rem,5cqi,3rem)]"
            >
              <Fecha fecha={primero.fecha_inicio} grande />
              <span className="flex flex-col gap-2">
                <span className="font-display text-[clamp(1.5rem,5.5cqi,2.25rem)] leading-tight font-bold">
                  {primero.titulo}
                </span>
                <span className="text-cream/80 first-letter:uppercase">{cuando(primero)}</span>
                {primero.resumen && (
                  <span className="line-clamp-3 text-cream/85">{primero.resumen}</span>
                )}
                <span className="mt-1 inline-flex items-center gap-2 font-display font-semibold text-peach">
                  Ver detalles
                  <Icon
                    name="arrowRight"
                    className="size-5 transition-transform motion-safe:group-hover:translate-x-1"
                  />
                </span>
              </span>
            </Link>
          </li>
          {resto.length > 0 && (
            <li>
              <ul className="flex h-full flex-col divide-y divide-cream/12 rounded-xl ring-1 ring-cream/10">
                {resto.slice(0, 3).map((e) => (
                  <li key={e.id} className="flex-1">
                    <Link
                      href={`/eventos/${e.slug}`}
                      className="group flex h-full items-center gap-[clamp(1rem,3vw,1.75rem)] px-[clamp(1rem,3vw,1.75rem)] py-4 transition-colors hover:bg-cream/5"
                    >
                      <Fecha fecha={e.fecha_inicio} />
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="font-display text-[clamp(1.0625rem,0.95rem+0.5vw,1.3125rem)] leading-snug font-semibold">
                          {e.titulo}
                        </span>
                        <span className="text-sm text-cream/75 first-letter:uppercase">
                          {cuando(e)}
                          {e.ubicacion ? ` · ${e.ubicacion}` : ''}
                        </span>
                      </span>
                      <Icon
                        name="arrowRight"
                        className="size-5 shrink-0 text-peach transition-transform motion-safe:group-hover:translate-x-1"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
