import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Tag } from '@/components/Tag';
import { formatDateTime } from '@/lib/dates';
import type { Evento } from '@/lib/eventos';
import { TIME_ZONE } from '@/lib/site';
import { EVENTO_CATEGORIAS } from '@/lib/validators/eventos';

const categoryLabel = new Map<string, string>(EVENTO_CATEGORIAS.map((c) => [c.value, c.label]));

function dateBadge(date: Date) {
  const f = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('es-EC', { ...options, timeZone: TIME_ZONE }).format(date);
  return { day: f({ day: 'numeric' }), month: f({ month: 'short' }).replace('.', '') };
}

export function eventWhen(e: Pick<Evento, 'fecha_inicio' | 'todo_el_dia'>): string {
  return formatDateTime(
    e.fecha_inicio,
    e.todo_el_dia
      ? { weekday: 'long', day: 'numeric', month: 'long' }
      : { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' },
  );
}

/**
 * Evento en listas (inicio y /eventos). `featured` ocupa más y muestra la imagen: la lista no
 * es una grilla de tarjetas iguales (Reglas Pixelia).
 */
export function EventCard({ event, featured = false }: { event: Evento; featured?: boolean }) {
  const badge = dateBadge(event.fecha_inicio);
  return (
    <article
      className={`group relative flex overflow-hidden rounded-2xl bg-surface ring-1 ring-line/70 transition-shadow hover:shadow-card ${
        featured ? 'flex-col' : 'items-stretch'
      }`}
    >
      {featured && event.imagen_url && (
        <div className="relative aspect-[1200/630] w-full bg-sunken">
          <Image
            src={event.imagen_url}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className={`flex gap-4 p-[clamp(1rem,3vw,1.5rem)] ${featured ? '' : 'w-full'}`}>
        <div className="flex w-14 shrink-0 flex-col items-center rounded-xl bg-accent-soft py-2 text-accent-strong md:w-16">
          <span className="font-display text-2xl leading-none font-semibold md:text-3xl">
            {badge.day}
          </span>
          <span className="text-xs font-bold tracking-wider uppercase">{badge.month}</span>
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <h3 className={`font-semibold text-ink ${featured ? 'text-h2' : 'text-h3'}`}>
            <Link
              href={`/eventos/${event.slug}`}
              className="group-hover:text-brand-strong group-hover:underline after:absolute after:inset-0"
            >
              {event.titulo}
            </Link>
          </h3>
          <p className="text-sm text-ink-soft first-letter:uppercase">{eventWhen(event)}</p>
          {event.resumen && (
            <p className={`text-ink-soft ${featured ? '' : 'line-clamp-2'}`}>{event.resumen}</p>
          )}
          <p className="flex flex-wrap gap-1.5 pt-1">
            {event.categoria !== 'evento' && (
              <Tag tone="accent">{categoryLabel.get(event.categoria)}</Tag>
            )}
            {event.ubicacion && (
              <Tag tone="brand">
                <Icon name="mapPin" className="size-3" /> {event.ubicacion}
              </Tag>
            )}
            {event.rango_edad && <Tag color={event.rango_color}>{event.rango_edad}</Tag>}
          </p>
        </div>
      </div>
    </article>
  );
}
