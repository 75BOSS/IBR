import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { RUTA_PRIMERA_VISITA } from '../enlaces';
import { IconoPoster } from '../IconoPoster';
import { Titulo } from '../piezas';

/**
 * «¿Es tu primera vez? Empieza aquí →» (lleva a la primera visita de la propuesta). Escritorio (imagen 13):
 * caja con borde y botón de contorno. Celular (imagen 15): fila arena con el libro a la izquierda.
 * Toda la caja es el enlace.
 */
export function PrimeraVez({ className = '' }: { className?: string }) {
  return (
    <Link
      href={RUTA_PRIMERA_VISITA}
      className={`group @container block border-2 border-ink bg-(--d-arena) text-ink @2xl/pagina:bg-canvas ${className}`}
    >
      <div className="flex h-full items-stretch @2xl/pagina:flex-col @2xl/pagina:justify-between @2xl/pagina:gap-[5cqi] @2xl/pagina:px-[10cqi] @2xl/pagina:pt-[6.5cqi] @2xl/pagina:pb-[6.5cqi]">
        <div className="grid place-items-center border-r-2 border-ink px-[5.5cqi] py-[3cqi] @2xl/pagina:hidden">
          <IconoPoster nombre="book" className="size-[clamp(2rem,10.5cqi,3.75rem)]" />
        </div>
        <div className="flex flex-col justify-center gap-[0.8cqi] px-[5cqi] py-[3cqi] @2xl/pagina:contents">
          <Titulo
            estilo="grueso"
            className="text-[clamp(1.125rem,5.4cqi,2.25rem)] @2xl/pagina:text-[clamp(1.625rem,12.4cqi,3.25rem)]"
          >
            ¿Es tu primera vez?
          </Titulo>
          <span className="inline-flex w-fit items-center gap-[0.5em] text-[clamp(0.9375rem,4cqi,1.5rem)] @2xl/pagina:w-full @2xl/pagina:border-2 @2xl/pagina:border-ink @2xl/pagina:px-[9cqi] @2xl/pagina:py-[3.4cqi] @2xl/pagina:font-display @2xl/pagina:text-[clamp(1rem,6cqi,1.5rem)] @2xl/pagina:font-bold @2xl/pagina:font-stretch-[90%] @2xl/pagina:group-hover:bg-ink @2xl/pagina:group-hover:text-canvas">
            Empieza aquí
            <Icon name="arrowRight" className="d-flecha size-[1.05em]" />
          </span>
        </div>
      </div>
    </Link>
  );
}
