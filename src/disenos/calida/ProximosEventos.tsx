import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { formatDateTime } from '@/lib/dates';
import { Contenedor } from './Contenedor';
import { EnlaceFlecha } from './EnlaceFlecha';
import { Etiqueta } from './Etiqueta';
import { Titulo } from './Titulo';

const mayuscula = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

/**
 * «Lo que viene» (no está en las imágenes; sigue su estilo): los próximos eventos reales como
 * una lista editorial con la fecha grande en serifa, no como tarjetas iguales en cuadrícula.
 */
export function ProximosEventos({
  eventos,
  verEventos,
}: {
  eventos: {
    id: number;
    slug: string;
    titulo: string;
    fecha_inicio: Date;
    todo_el_dia: boolean;
    ubicacion: string | null;
  }[];
  verEventos: boolean;
}) {
  if (eventos.length === 0) return null;
  return (
    <section
      aria-labelledby="calida-eventos"
      className="pt-[clamp(1.5rem,4vw,2rem)] pb-[clamp(3rem,7vw,6rem)]"
    >
      <Contenedor className="flex flex-col gap-[clamp(1.25rem,3vw,2.5rem)]">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div className="flex flex-col gap-3">
            <Etiqueta className="text-accent-strong">Agenda</Etiqueta>
            <Titulo id="calida-eventos" tamano="seccion" className="text-ink">
              Lo que <em>viene</em>
            </Titulo>
          </div>
          {verEventos && <EnlaceFlecha href="/eventos">Ver todos los eventos</EnlaceFlecha>}
        </div>
        <ol className="border-t border-line">
          {eventos.slice(0, 4).map((e) => {
            const cuando = mayuscula(
              formatDateTime(
                e.fecha_inicio,
                e.todo_el_dia
                  ? { weekday: 'long' }
                  : { weekday: 'long', hour: '2-digit', minute: '2-digit' },
              ),
            );
            return (
              <li key={e.id} className="border-b border-line">
                <Link
                  href={`/eventos/${e.slug}`}
                  className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[clamp(1rem,3vw,2.5rem)] py-[clamp(1rem,2vw,1.5rem)]"
                >
                  <span className="flex w-[clamp(3.25rem,2.6rem+2.6vw,5rem)] flex-col items-center leading-none">
                    <span className="font-display text-[clamp(2.25rem,1.7rem+2.2vw,3.5rem)] text-ink">
                      {formatDateTime(e.fecha_inicio, { day: 'numeric' })}
                    </span>
                    <span className="caps text-accent-strong">
                      {formatDateTime(e.fecha_inicio, { month: 'short' }).replace('.', '')}
                    </span>
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-display text-[clamp(1.25rem,1rem+1vw,1.875rem)] leading-tight text-ink transition-colors group-hover:text-accent-strong">
                      {e.titulo}
                    </span>
                    <span className="text-ink-soft">
                      {cuando}
                      {e.ubicacion ? ` · ${e.ubicacion}` : ''}
                    </span>
                  </span>
                  <span className="grid size-11 place-items-center rounded-full ring-1 ring-line transition-colors group-hover:bg-accent group-hover:text-cream group-hover:ring-accent">
                    <Icon name="arrowRight" className="size-5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </Contenedor>
    </section>
  );
}
