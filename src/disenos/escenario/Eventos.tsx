import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { formatDateTime } from '@/lib/dates';
import type { Evento } from '@/lib/eventos';
import { FlechaEnlace } from './FlechaEnlace';
import { TituloSeccion } from './TituloSeccion';

type EventoFila = Pick<
  Evento,
  'id' | 'slug' | 'titulo' | 'fecha_inicio' | 'todo_el_dia' | 'ubicacion'
>;

function cuando(e: EventoFila): string {
  return formatDateTime(
    e.fecha_inicio,
    e.todo_el_dia ? { weekday: 'long' } : { weekday: 'long', hour: 'numeric', minute: '2-digit' },
  );
}

/**
 * Próximos eventos con el lenguaje de los pasos: la fecha en números rojos grandes, el título y
 * una flecha. Angosto, filas separadas por líneas; ancho, tres columnas con rayas entre ellas.
 * Sin eventos no se muestra (y «Ver todos» solo si /eventos tiene contenido).
 */
export function Eventos({ eventos, verTodos }: { eventos: EventoFila[]; verTodos: boolean }) {
  if (eventos.length === 0) return null;
  return (
    <section
      aria-labelledby="lo-que-viene"
      className="container-page flex flex-col gap-[clamp(1rem,2.5vw,1.75rem)] py-[clamp(3rem,7vw,5rem)]"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <TituloSeccion id="lo-que-viene">
          Lo que <em className="font-semibold italic">viene.</em>
        </TituloSeccion>
        {verTodos && <FlechaEnlace href="/eventos">Ver todos los eventos</FlechaEnlace>}
      </div>
      <div className="@container">
        <ul className="grid border-t border-line @3xl:grid-cols-3 @3xl:border-t-0">
          {eventos.slice(0, 3).map((e) => (
            <li
              key={e.id}
              className="border-b border-line @3xl:border-b-0 @3xl:px-[clamp(1rem,3cqi,2rem)] @3xl:not-first:border-l @3xl:first:pl-0"
            >
              <Link
                href={`/eventos/${e.slug}`}
                className="group grid grid-cols-[4rem_1fr_auto] items-center gap-x-4 py-5 @3xl:grid-cols-[4rem_1fr] @3xl:items-start"
              >
                <span className="flex flex-col items-center leading-none">
                  <span className="font-display text-[2.5rem] font-extrabold tracking-[-0.04em] text-(--d-rojo)">
                    {formatDateTime(e.fecha_inicio, { day: 'numeric' })}
                  </span>
                  <span className="caps text-accent">
                    {formatDateTime(e.fecha_inicio, { month: 'short' }).replace('.', '')}
                  </span>
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-display text-[1.1875rem] leading-snug font-bold text-ink transition-colors group-hover:text-accent">
                    {e.titulo}
                  </span>
                  <span className="text-[0.95rem] text-ink-soft first-letter:uppercase">
                    {cuando(e)}
                    {e.ubicacion ? ` · ${e.ubicacion}` : ''}
                  </span>
                </span>
                <Icon
                  name="arrowRight"
                  className="size-5 text-ink transition-transform motion-safe:group-hover:translate-x-1 @3xl:hidden"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
