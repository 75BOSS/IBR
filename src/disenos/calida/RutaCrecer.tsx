import Link from 'next/link';
import type { Paso } from '@/disenos/contenido';
import { Icon } from '@/components/Icon';
import { Titulo } from './Titulo';

/**
 * «Tu ruta en cinco pasos» (RUTA_CRECER): un camino con círculos numerados unidos por una línea.
 * Según el ancho de su contenedor: angosto, una columna con la línea vertical a la izquierda;
 * ancho (≥ 64rem), cinco columnas con la línea horizontal que se dibuja al entrar en pantalla.
 * Los pasos aparecen uno tras otro. El círculo se llena al pasar el mouse por el paso.
 * `claro`: sobre azul noche (inicio). `acciones`: cada paso con su enlace (página Crecer); los
 * destinos ya vienen resueltos (anclas y páginas que existen, `destinoPaso`).
 */
export function RutaCrecer({
  pasos,
  claro = false,
  acciones = false,
}: {
  pasos: Paso[];
  claro?: boolean;
  acciones?: boolean;
}) {
  const color = claro
    ? {
        riel: 'bg-cream/20',
        trazo: 'bg-peach',
        circulo:
          'bg-(--d-noche) text-peach ring-peach/70 group-hover:bg-peach group-hover:text-(--d-noche)',
        titulo: 'text-cream',
        texto: 'text-cream/80',
        enlace: 'text-peach',
      }
    : {
        riel: 'bg-line',
        trazo: 'bg-accent',
        circulo:
          'bg-canvas text-accent-strong ring-accent/60 group-hover:bg-accent group-hover:text-cream',
        titulo: 'text-ink',
        texto: 'text-ink-soft',
        enlace: 'text-accent-strong',
      };
  return (
    <div className="@container">
      <div className="relative">
        {/* Riel y trazo: verticales en angosto (detrás de los círculos), horizontales en ancho.
            Fuera de la lista: así el escalonado solo cuenta los pasos. */}
        <span
          aria-hidden="true"
          className={`absolute top-6 bottom-6 left-[1.6rem] w-px @5xl:top-[1.6rem] @5xl:right-[10%] @5xl:bottom-auto @5xl:left-[10%] @5xl:h-px @5xl:w-auto ${color.riel}`}
        />
        <span
          aria-hidden="true"
          className={`calida-linea absolute top-6 bottom-6 left-[1.6rem] w-px @5xl:hidden ${color.trazo}`}
        />
        <span
          aria-hidden="true"
          className={`calida-linea-x absolute top-[1.6rem] right-[10%] left-[10%] hidden h-px @5xl:block ${color.trazo}`}
        />
        <ol className="calida-escalonado relative grid gap-[clamp(1.75rem,5cqi,2.25rem)] @5xl:grid-cols-5 @5xl:gap-x-[clamp(1rem,2.4cqi,2rem)]">
          {pasos.map((paso) => (
            <li
              key={paso.numero}
              className="group relative grid grid-cols-[auto_minmax(0,1fr)] gap-x-[clamp(1rem,4cqi,1.5rem)] gap-y-2 @5xl:grid-cols-1 @5xl:justify-items-center @5xl:text-center"
            >
              <span
                className={`relative grid size-[3.2rem] place-items-center rounded-full font-display text-[1.375rem] ring-[1.5px] transition-colors duration-500 @5xl:row-span-1 ${color.circulo}`}
              >
                {paso.numero}
              </span>
              <div className="flex min-w-0 flex-col gap-1.5 @5xl:items-center @5xl:pt-3">
                <Titulo
                  como="h3"
                  tamano="libre"
                  className={`text-[clamp(1.375rem,1.2rem+0.7vw,1.75rem)] leading-tight ${color.titulo}`}
                >
                  {paso.titulo}
                </Titulo>
                <p
                  className={`max-w-[26rem] text-[clamp(0.95rem,0.92rem+0.2vw,1.0625rem)] leading-normal ${color.texto}`}
                >
                  {paso.texto}
                </p>
                {acciones && (
                  <Link
                    href={paso.href}
                    className={`group/paso mt-1 inline-flex items-center gap-2 text-[0.95rem] font-semibold ${color.enlace}`}
                  >
                    <span className="calida-trazo">{paso.accion}</span>
                    <Icon
                      name="arrowRight"
                      className="size-4 shrink-0 transition-transform motion-safe:group-hover/paso:translate-x-1"
                    />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
