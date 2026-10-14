import Link from 'next/link';
import { Icon } from '@/components/Icon';
import type { Paso } from '@/disenos/contenido';

/**
 * La ruta de crecimiento como un camino de cinco paradas: número en un círculo, título, frase y
 * su acción. Una raya roja une las paradas y se dibuja al bajar (`.vibrante-trazo`): vertical en
 * el celular, horizontal desde 1024. `oscuro` para el fondo negro.
 */
export function Ruta({ pasos, oscuro = false }: { pasos: Paso[]; oscuro?: boolean }) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="vibrante-trazo absolute top-2 bottom-2 left-[1.6875rem] w-[3px] origin-top bg-(--d-rojo-vivo) lg:top-[1.6875rem] lg:right-[calc((100%_-_4*clamp(1rem,2vw,2rem))/5_-_1.75rem)] lg:bottom-auto lg:left-7 lg:h-[3px] lg:w-auto lg:origin-left"
      />
      <ol className="relative grid gap-[clamp(1.75rem,4vw,2.5rem)] lg:grid-cols-5 lg:gap-[clamp(1rem,2vw,2rem)]">
        {pasos.map((paso) => (
          <li
            key={paso.numero}
            className="group @container relative grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 gap-y-2 lg:grid-cols-1 lg:gap-y-3"
          >
            <span
              className={`relative row-span-3 grid size-14 place-items-center rounded-full font-display text-lg font-black ring-[3px] ring-(--d-rojo-vivo) transition-colors group-hover:bg-(--d-rojo-vivo) group-hover:text-(--d-negro) lg:row-span-1 ${
                oscuro ? 'bg-(--d-negro) text-canvas' : 'bg-canvas text-ink'
              }`}
            >
              {paso.numero}
            </span>
            <h3 className="pt-3 font-display text-[clamp(1.375rem,1.1rem+1.1vw,1.875rem)] leading-[1.02] font-black tracking-[-0.03em] text-balance lg:pt-1">
              {paso.titulo}
            </h3>
            <p
              className={`max-w-[40ch] text-[clamp(0.9375rem,0.9rem+0.2vw,1.0625rem)] leading-snug ${
                oscuro ? 'text-(--d-crema-tenue)' : 'text-ink-soft'
              }`}
            >
              {paso.texto}
            </p>
            <Link
              href={paso.href}
              className={`group/paso col-start-2 inline-flex min-h-11 items-center gap-2 self-start font-bold lg:col-start-1 ${
                oscuro ? 'text-(--d-rojo-vivo)' : 'text-accent'
              } hover:underline`}
            >
              {paso.accion}
              <Icon
                name="arrowRight"
                className="size-5 transition-transform motion-safe:group-hover/paso:translate-x-1"
              />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
