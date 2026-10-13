import Link from 'next/link';
import { Contenedor } from '@/disenos/vibrante/Contenedor';
import { FlechaEnlace } from '@/disenos/vibrante/FlechaEnlace';
import { Titular } from '@/disenos/vibrante/Titular';
import { formatDateTime } from '@/lib/dates';
import type { Evento } from '@/lib/eventos';

/** Cuándo: «sábado · 10:00» (o solo el día si dura todo el día). */
function cuando(evento: Pick<Evento, 'fecha_inicio' | 'todo_el_dia'>): string {
  const dia = formatDateTime(evento.fecha_inicio, { weekday: 'long' });
  if (evento.todo_el_dia) return `${dia} · todo el día`;
  return `${dia} · ${formatDateTime(evento.fecha_inicio, { timeStyle: 'short' })}`;
}

/**
 * Próximos eventos de la agenda: el primero destacado en negro y los dos siguientes en crema
 * (jerarquía, no tarjetas iguales). Solo existe si hay eventos.
 */
export function ProximosEventos({
  eventos,
  verTodos,
}: {
  eventos: Evento[];
  /** «Ver todos» solo si la agenda tiene más que estos tres. */
  verTodos: boolean;
}) {
  if (eventos.length === 0) return null;
  const visibles = eventos.slice(0, 3);
  return (
    // Sobre el fondo hundido el rojo de texto baja a 4.2:1: en esta sección el acento de texto es
    // el rojo más hondo (5.7:1). Se redefine el token para el subárbol, como hace tema.css.
    <section
      aria-labelledby="eventos-titulo"
      className="bg-sunken [--color-accent:var(--color-accent-strong)]"
    >
      <Contenedor className="flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)] py-[clamp(2.5rem,7vw,5.5rem)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="@container flex min-w-[min(100%,20rem)] flex-1 flex-col gap-3">
            <p className="eyebrow text-accent">Agenda</p>
            <Titular id="eventos-titulo">
              Lo que <em>viene.</em>
            </Titular>
          </div>
          {verTodos && <FlechaEnlace href="/eventos">Ver todos los eventos</FlechaEnlace>}
        </div>
        <ul
          className={`grid gap-3 md:grid-cols-2 ${
            visibles.length === 3
              ? 'lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)]'
              : ''
          }`}
        >
          {visibles.map((evento, i) => (
            <TarjetaEvento
              key={evento.id}
              evento={evento}
              destacado={i === 0}
              ancho={visibles.length === 3 && i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}
            />
          ))}
        </ul>
      </Contenedor>
    </section>
  );
}

function TarjetaEvento({
  evento,
  destacado,
  ancho,
}: {
  evento: Evento;
  destacado: boolean;
  ancho: string;
}) {
  return (
    <li
      className={`group @container relative flex min-h-[clamp(12rem,18vw,15rem)] reveal flex-col justify-between gap-6 rounded-[0.5rem] p-[clamp(1.25rem,6cqi,2rem)] ${ancho} ${
        destacado
          ? 'bg-(--d-negro-hondo) text-canvas on-dark'
          : 'bg-surface text-ink ring-1 ring-line'
      }`}
    >
      <p className="flex items-baseline gap-3">
        <span className="font-display text-[clamp(3rem,16cqi,4.5rem)] leading-none font-black tracking-[-0.04em]">
          {formatDateTime(evento.fecha_inicio, { day: 'numeric' })}
        </span>
        <span
          className={`caps text-[clamp(0.8125rem,4cqi,0.9375rem)] ${
            destacado ? 'text-(--d-rojo-vivo)' : 'text-accent'
          }`}
        >
          {formatDateTime(evento.fecha_inicio, { month: 'long' })}
        </span>
      </p>
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-[clamp(1.375rem,7cqi,2rem)] leading-tight font-black tracking-[-0.03em]">
          <Link
            href={`/eventos/${evento.slug}`}
            className="group-hover:underline after:absolute after:inset-0"
          >
            {evento.titulo}
          </Link>
        </h3>
        <p className={destacado ? 'text-(--d-crema-tenue)' : 'text-ink-soft'}>
          {cuando(evento)}
          {evento.ubicacion ? ` · ${evento.ubicacion}` : ''}
        </p>
      </div>
    </li>
  );
}
