import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { formatDateTime } from '@/lib/dates';
import type { Evento } from '@/lib/eventos';
import { Lema, Titulo } from '../piezas';

/**
 * Próximos eventos como avisos de periódico: cajas con la fecha grande en rojo y el titular
 * condensado. No está en las imágenes (terminan en la primera pantalla); sigue su grilla de
 * cajas con borde. Sin eventos, no se dibuja.
 */
export function Agenda({ eventos }: { eventos: Evento[] }) {
  if (eventos.length === 0) return null;
  return (
    <section
      aria-labelledby="agenda"
      className="mt-[clamp(0.75rem,3vw,1.25rem)] flex flex-col gap-1"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-2 border-ink pt-[clamp(1rem,3vw,2rem)] pb-[clamp(0.5rem,1.5vw,0.875rem)]">
        <div className="flex flex-col gap-1">
          <Lema className="text-accent">Lo que viene</Lema>
          <Titulo id="agenda" estilo="negro" className="text-[clamp(2.5rem,1.6rem+4vw,5rem)]">
            Agenda
          </Titulo>
        </div>
        <Link
          href="/eventos"
          className="group inline-flex min-h-11 items-center gap-2 font-display text-[clamp(1.0625rem,1rem+0.4vw,1.375rem)] font-bold text-accent font-stretch-[92%]"
        >
          Todos los eventos
          <Icon
            name="arrowRight"
            className="size-[1.1em] motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
          />
        </Link>
      </div>
      <ul className="grid gap-1 @2xl/pagina:grid-cols-2 @5xl/pagina:grid-cols-3">
        {eventos.map((e) => (
          <li key={e.id} className="@container flex">
            <Link
              href={`/eventos/${e.slug}`}
              className="group flex flex-1 items-stretch gap-[clamp(0.875rem,5cqi,1.5rem)] border-2 border-ink p-[clamp(0.875rem,5cqi,1.375rem)] transition-colors hover:bg-sunken"
            >
              <span className="flex w-[clamp(3.5rem,19cqi,5rem)] shrink-0 flex-col items-center justify-center border-r-2 border-ink pr-[clamp(0.875rem,5cqi,1.5rem)] text-accent">
                <span className="font-display text-[clamp(2.25rem,13cqi,3.5rem)] leading-none font-black">
                  {formatDateTime(e.fecha_inicio, { day: 'numeric' })}
                </span>
                <span className="font-display text-[0.8125rem] font-bold tracking-[0.2em] uppercase">
                  {formatDateTime(e.fecha_inicio, { month: 'short' }).replace('.', '')}
                </span>
              </span>
              <span className="flex min-w-0 flex-col justify-center gap-1">
                <Titulo
                  as="span"
                  estilo="condensado"
                  className="text-[clamp(1.25rem,6.4cqi,1.75rem)] group-hover:text-accent"
                >
                  {e.titulo}
                </Titulo>
                <span className="text-sm text-ink-soft first-letter:uppercase">
                  {formatDateTime(e.fecha_inicio, { weekday: 'long' })}
                  {!e.todo_el_dia && ` · ${formatDateTime(e.fecha_inicio, { timeStyle: 'short' })}`}
                  {e.ubicacion && ` · ${e.ubicacion}`}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
