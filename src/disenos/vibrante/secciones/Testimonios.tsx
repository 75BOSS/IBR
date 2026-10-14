import type { ReactNode } from 'react';
import { Inclinable } from '@/disenos/vibrante/animacion/Inclinable';
import type { Testimonio } from '@/disenos/contenido';

/** Comillas grandes en la itálica de la propuesta (decorativas). */
function Comillas({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`font-script text-[clamp(4.5rem,24cqi,8rem)] leading-[0.6] italic ${className}`}
    >
      “
    </span>
  );
}

// La primera, destacada en rojo a dos filas; luego crema, negro y crema a lo ancho.
const TARJETAS = [
  { lugar: 'lg:row-span-2', fondo: 'bg-accent text-canvas on-dark', oscuro: true },
  { lugar: '', fondo: 'bg-surface ring-1 ring-line', oscuro: false },
  { lugar: '', fondo: 'bg-(--d-negro-hondo) text-canvas on-dark', oscuro: true },
  { lugar: 'lg:col-span-2', fondo: 'bg-surface ring-1 ring-line', oscuro: false },
] as const;

/**
 * Testimonios de la familia (ejemplo de contenido.ts): el primero grande en rojo, los demás con
 * otro fondo cada uno (jerarquía, no tarjetas iguales). Cada tarjeta se inclina con el cursor.
 * La página pone la cabecera (`cabecera`).
 */
export function Testimonios({
  testimonios,
  cabecera,
}: {
  testimonios: Testimonio[];
  cabecera: ReactNode;
}) {
  return (
    <div className="grid gap-[clamp(1.5rem,4vw,3rem)]">
      {cabecera}
      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
        {testimonios.map((t, i) => {
          const destacado = i === 0;
          const tarjeta = TARJETAS[i % TARJETAS.length] ?? TARJETAS[1];
          return (
            <li key={t.nombre} className={`flex reveal ${tarjeta.lugar}`}>
              <Inclinable
                as="figure"
                cursor={null}
                grados={destacado ? 4 : 6}
                className={`@container flex flex-1 flex-col justify-between gap-6 rounded-[0.5rem] p-[clamp(1.25rem,6cqi,2.5rem)] ${tarjeta.fondo}`}
              >
                <div className="flex flex-col gap-3">
                  <Comillas
                    className={
                      destacado
                        ? 'text-canvas'
                        : tarjeta.oscuro
                          ? 'text-(--d-rojo-vivo)'
                          : 'text-accent'
                    }
                  />
                  <blockquote
                    className={
                      destacado
                        ? 'font-display text-[clamp(1.625rem,8cqi,2.75rem)] leading-[1.05] font-black tracking-[-0.03em] text-balance'
                        : 'text-[clamp(1.0625rem,5cqi,1.3125rem)] leading-snug font-semibold'
                    }
                  >
                    <p>{t.texto}</p>
                  </blockquote>
                </div>
                <figcaption className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`grid size-11 shrink-0 place-items-center rounded-full font-display text-lg font-black ${
                      destacado ? 'bg-canvas text-accent' : 'bg-accent text-canvas'
                    }`}
                  >
                    {t.nombre.charAt(0)}
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="font-bold">{t.nombre}</span>
                    <span className={tarjeta.oscuro ? 'text-sm' : 'text-sm text-ink-soft'}>
                      {t.barrio}, Riobamba
                    </span>
                  </span>
                </figcaption>
              </Inclinable>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
