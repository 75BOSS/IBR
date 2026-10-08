import Image from 'next/image';
import type { Evento } from '@/lib/eventos';
import { TIME_ZONE } from '@/lib/site';
import { EVENTO_CATEGORIAS } from '@/lib/validators/eventos';

const categoryLabel = new Map<string, string>(EVENTO_CATEGORIAS.map((c) => [c.value, c.label]));

/** Color de la portada generada (eventos sin foto): uno por categoría, todos con texto claro. */
const COVER_TONE: Record<Evento['categoria'], string> = {
  evento: 'bg-brand-strong',
  noticia: 'bg-accent-strong',
  oracion: 'bg-electric',
  comunidad: 'bg-electric',
  musica: 'bg-peach-strong',
  capacitacion: 'bg-night',
};

function dateParts(date: Date) {
  const f = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('es-EC', { ...options, timeZone: TIME_ZONE }).format(date);
  return {
    day: f({ day: 'numeric' }),
    month: f({ month: 'long' }),
    weekday: f({ weekday: 'long' }),
  };
}

/**
 * Portada de un evento: su foto o, si no tiene, una portada tipográfica con la fecha grande en
 * el color de su categoría. La imagen se acerca suavemente al pasar el mouse por la tarjeta
 * (`group` en el contenedor).
 */
export function EventCover({
  event,
  sizes,
  className = 'aspect-[4/3]',
}: {
  event: Pick<Evento, 'imagen_url' | 'categoria' | 'fecha_inicio'>;
  sizes: string;
  className?: string;
}) {
  const date = dateParts(event.fecha_inicio);
  const label = event.categoria === 'evento' ? null : categoryLabel.get(event.categoria);
  return (
    // @container: la fecha se mide por el ancho de la portada (cqi), no de la ventana; la misma
    // portada sale grande en el destacado y chica en un carrusel o en tres columnas.
    <div className={`@container relative isolate overflow-hidden rounded-[inherit] ${className}`}>
      {event.imagen_url ? (
        <Image
          src={event.imagen_url}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-(--ease-out-soft) motion-safe:group-hover:scale-105"
        />
      ) : (
        <div
          className={`absolute inset-0 flex flex-col justify-end p-[clamp(1rem,6cqi,2rem)] text-surface ${COVER_TONE[event.categoria]}`}
        >
          <span
            aria-hidden="true"
            className="absolute -top-[18%] -right-[12%] size-[75%] rounded-full bg-surface/10 transition-transform duration-700 ease-(--ease-out-soft) motion-safe:group-hover:scale-110"
          />
          <span className="font-display text-[clamp(3rem,20cqi,6rem)] leading-[0.8] font-extrabold tracking-tighter">
            {date.day}
          </span>
          <span className="mt-1 font-script text-[clamp(1.5rem,9cqi,2.5rem)] leading-tight first-letter:uppercase">
            {date.weekday} · {date.month}
          </span>
        </div>
      )}
      {label && (
        <span className="absolute top-3 left-3 rounded-full bg-canvas/90 px-3 py-1 caps text-ink backdrop-blur">
          {label}
        </span>
      )}
    </div>
  );
}
