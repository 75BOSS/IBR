import Link from 'next/link';
import { Icon } from '@/components/Icon';

export type Paso = { href: string; titulo: string; texto: string };

/**
 * Los tres pasos bajo «Ven. Conoce. Comparte.». Mide su contenedor, no la ventana: angosto, filas
 * con número rojo, texto y flecha separadas por líneas (imagen 12); ancho, una sola fila con los
 * números unidos por rayas (imagen 10), donde la explicación queda solo para lectores de pantalla.
 */
export function Pasos({ pasos }: { pasos: Paso[] }) {
  return (
    <div className="@container w-full">
      <ol className="mx-auto flex max-w-[34rem] flex-col text-left @3xl:max-w-none @3xl:flex-row @3xl:items-center @3xl:justify-center">
        {pasos.map((paso, i) => (
          <li
            key={paso.href}
            className="border-b border-line last:border-b-0 @3xl:flex @3xl:items-center @3xl:border-b-0 @3xl:not-first:before:mx-[clamp(1rem,2.6cqi,2rem)] @3xl:not-first:before:h-px @3xl:not-first:before:w-[clamp(2.5rem,6cqi,4.5rem)] @3xl:not-first:before:bg-ink/60"
          >
            <Link
              href={paso.href}
              className="group grid grid-cols-[3.25rem_1fr_auto] items-start gap-x-[clamp(0.75rem,5cqi,2rem)] py-[clamp(1rem,4.5cqi,1.5rem)] @3xl:flex @3xl:items-baseline @3xl:gap-x-[clamp(1rem,2.6cqi,2.25rem)] @3xl:py-2"
            >
              <span
                aria-hidden="true"
                className="font-display text-[clamp(1.875rem,1.4rem+2.4cqi,2.375rem)] leading-none font-bold text-(--d-rojo) @3xl:text-[1.625rem] @3xl:font-medium"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-display text-[1.1875rem] leading-tight font-bold text-ink transition-colors group-hover:text-accent @3xl:text-[1.3125rem] @3xl:font-semibold">
                  {paso.titulo}
                </span>
                <span className="text-ink-soft @3xl:sr-only">{paso.texto}</span>
              </span>
              <Icon
                name="arrowRight"
                className="mt-1 size-6 text-ink transition-transform motion-safe:group-hover:translate-x-1 @3xl:hidden"
              />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
