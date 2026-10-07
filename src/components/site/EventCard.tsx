import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Tag } from '@/components/Tag';
import { EventCover } from '@/components/site/EventCover';
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

function Meta({ event }: { event: Evento }) {
  if (!event.ubicacion && !event.rango_edad && !event.requiere_inscripcion) return null;
  return (
    <p className="flex flex-wrap gap-1.5 pt-1">
      {event.requiere_inscripcion && <Tag tone="accent">Con inscripción</Tag>}
      {event.ubicacion && (
        <Tag tone="brand">
          <Icon name="mapPin" className="size-3" /> {event.ubicacion}
        </Tag>
      )}
      {event.rango_edad && <Tag color={event.rango_color}>{event.rango_edad}</Tag>}
    </p>
  );
}

/**
 * Evento en listas. Tres formas para que las listas no sean grillas de tarjetas iguales
 * (Reglas Pixelia):
 * - `featured`: el destacado, con portada grande y título grande.
 * - `tile`: portada + texto (carruseles y grillas).
 * - `row`: fila compacta con la fecha (columnas laterales y listas largas).
 * Toda la tarjeta es clicable (el enlace del título la cubre).
 */
export function EventCard({
  event,
  variant = 'row',
}: {
  event: Evento;
  variant?: 'featured' | 'tile' | 'row';
}) {
  const link = (
    <Link
      href={`/eventos/${event.slug}`}
      className="group-hover:text-brand-strong after:absolute after:inset-0"
    >
      {event.titulo}
    </Link>
  );

  if (variant === 'row') {
    const badge = dateBadge(event.fecha_inicio);
    return (
      <article className="group relative flex gap-4 rounded-2xl bg-surface p-[clamp(0.875rem,2.5vw,1.25rem)] ring-1 ring-line/70 transition hover:-translate-y-0.5 hover:shadow-lift motion-reduce:hover:translate-y-0">
        <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-accent-soft py-2 text-accent-strong">
          <span className="font-display text-3xl leading-none font-light">{badge.day}</span>
          <span className="text-xs font-bold tracking-wider uppercase">{badge.month}</span>
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          {event.categoria !== 'evento' && (
            <p className="text-xs font-bold tracking-wider text-accent-strong uppercase">
              {categoryLabel.get(event.categoria)}
            </p>
          )}
          <h3 className="font-display text-h3 font-medium text-ink">{link}</h3>
          <p className="text-sm text-ink-soft first-letter:uppercase">{eventWhen(event)}</p>
          {event.resumen && <p className="line-clamp-2 text-ink-soft">{event.resumen}</p>}
        </div>
      </article>
    );
  }

  const featured = variant === 'featured';
  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-(--radius-frame) bg-surface ring-1 ring-line/70 transition hover:shadow-lift`}
    >
      <EventCover
        event={event}
        sizes={featured ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 768px) 26rem, 82vw'}
        className={`rounded-none ${featured ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}
      />
      <div className="flex flex-1 flex-col gap-2 p-[clamp(1.125rem,3vw,1.75rem)]">
        <p className="text-sm font-semibold text-accent-strong first-letter:uppercase">
          {eventWhen(event)}
        </p>
        <h3
          className={`font-headline text-ink ${
            featured ? 'text-[clamp(1.75rem,1.2rem+2.4vw,3rem)]' : 'text-h2'
          }`}
        >
          {link}
        </h3>
        {event.resumen && (
          <p className={`text-ink-soft ${featured ? 'text-lead' : 'line-clamp-2'}`}>
            {event.resumen}
          </p>
        )}
        <Meta event={event} />
        <span className="mt-auto inline-flex items-center gap-2 pt-3 font-semibold text-brand-strong">
          {event.requiere_inscripcion ? 'Ver e inscribirme' : 'Ver detalles'}
          <Icon
            name="arrowRight"
            className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
          />
        </span>
      </div>
    </article>
  );
}
