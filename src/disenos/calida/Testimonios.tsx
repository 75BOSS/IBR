import type { Testimonio } from '@/disenos/contenido';
import { Marquesina } from './Marquesina';

/** Una cita: el texto en la itálica de Playfair, el nombre y el barrio de Riobamba. */
function Cita({ t, grande = false }: { t: Testimonio; grande?: boolean }) {
  return (
    <figure className="flex h-full flex-col gap-4">
      <span
        aria-hidden="true"
        className="font-script text-[clamp(3.5rem,3rem+2vw,5rem)] leading-[0.6] text-accent italic"
      >
        “
      </span>
      <blockquote
        className={`font-script text-ink italic ${
          grande
            ? 'text-[clamp(1.625rem,1.2rem+1.8vw,2.75rem)] leading-[1.15]'
            : 'text-[clamp(1.25rem,1.1rem+0.6vw,1.5rem)] leading-snug'
        }`}
      >
        {t.texto}
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-2">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft font-display text-lg text-accent-strong">
          {t.nombre.charAt(0)}
        </span>
        <span className="flex flex-col leading-tight">
          <span className="font-semibold text-ink">{t.nombre}</span>
          <span className="text-sm text-ink-soft">{t.barrio}, Riobamba</span>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Testimonios en una cinta que se desliza muy despacio (inicio): tarjetas crema sobre el panel
 * durazno; se detiene con el mouse, el foco o el botón «Pausar». Con «reducir movimiento» las
 * tarjetas quedan quietas en una cuadrícula (la copia duplicada para el bucle se oculta).
 */
export function TestimoniosCinta({ testimonios }: { testimonios: Testimonio[] }) {
  const tarjetas = (copia: boolean) =>
    testimonios.map((t) => (
      <li
        key={`${copia ? 'b' : 'a'}-${t.nombre}`}
        className="w-[min(22rem,78vw)] shrink-0 rounded-[0.875rem] bg-surface p-[clamp(1.25rem,2.5vw,1.75rem)] ring-1 ring-line motion-reduce:w-auto"
      >
        <Cita t={t} />
      </li>
    ));
  return (
    <Marquesina etiqueta="testimonios">
      <ul className="flex gap-[clamp(0.875rem,1.5vw,1.25rem)] pr-[clamp(0.875rem,1.5vw,1.25rem)] motion-reduce:contents">
        {tarjetas(false)}
      </ul>
      <ul
        aria-hidden="true"
        className="flex gap-[clamp(0.875rem,1.5vw,1.25rem)] pr-[clamp(0.875rem,1.5vw,1.25rem)] motion-reduce:hidden"
      >
        {tarjetas(true)}
      </ul>
    </Marquesina>
  );
}

/**
 * Testimonios en la página Recursos: el primero grande (cita destacada) y los demás en una columna
 * a su lado, separados por rayas; aparecen uno tras otro.
 */
export function TestimoniosEditorial({ testimonios }: { testimonios: Testimonio[] }) {
  const [primero, ...resto] = testimonios;
  if (!primero) return null;
  return (
    <div className="@container">
      <div className="grid gap-[clamp(2rem,5cqi,4rem)] @4xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="calida-aparece rounded-[0.875rem] bg-(--d-durazno-panel) p-[clamp(1.5rem,5cqi,3.5rem)]">
          <Cita t={primero} grande />
        </div>
        <ul className="calida-escalonado flex flex-col">
          {resto.map((t) => (
            <li
              key={t.nombre}
              className="border-b border-line py-[clamp(1.25rem,3cqi,1.75rem)] first:pt-0"
            >
              <Cita t={t} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
