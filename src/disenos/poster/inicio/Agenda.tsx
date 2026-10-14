import Link from 'next/link';
import { formatDateTime } from '@/lib/dates';
import type { Evento } from '@/lib/eventos';
import { CabeceraSeccion, Titulo } from '../piezas';

/**
 * Próximos eventos como avisos de periódico: cajas con la fecha grande en rojo y el titular
 * condensado. No está en las imágenes (terminan en la primera pantalla); sigue su grilla de
 * cajas con borde. Sin eventos, no se dibuja.
 */
export function Agenda({ eventos }: { eventos: Evento[] }) {
  if (eventos.length === 0) return null;
  return (
    <section aria-labelledby="agenda" className="mt-[clamp(2.5rem,6vw,4.5rem)] flex flex-col gap-1">
      <CabeceraSeccion
        id="agenda"
        lema="Lo que viene"
        titulo="Agenda"
        accion={{ href: '/eventos', texto: 'Todos los eventos' }}
      />
      <ul className="grid gap-1 @2xl/pagina:grid-cols-2 @5xl/pagina:grid-cols-3">
        {eventos.map((e) => (
          <li key={e.id} className="@container flex">
            <Link
              href={`/eventos/${e.slug}`}
              className="group d-invierte flex flex-1 items-stretch gap-[clamp(0.875rem,5cqi,1.5rem)] border-2 border-(--inv-borde) p-[clamp(0.875rem,5cqi,1.375rem)]"
            >
              <span className="flex w-[clamp(3.5rem,19cqi,5rem)] shrink-0 flex-col items-center justify-center border-r-2 border-(--inv-borde) pr-[clamp(0.875rem,5cqi,1.5rem)] text-(--inv-acento)">
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
                  className="text-[clamp(1.25rem,6.4cqi,1.75rem)]"
                >
                  {e.titulo}
                </Titulo>
                <span className="text-sm text-(--inv-suave) first-letter:uppercase">
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
