import { Icon } from '@/components/Icon';

/**
 * Barra fija inferior del celular (imagen 3): «Cómo llegar» a Google Maps, siempre a mano. Solo
 * existe si la iglesia cargó su ubicación (`comoLlegar`); desde tablet no se muestra (la franja de
 * datos ya tiene el enlace). La clase `calida-barra-llegar` sube el selector de diseños.
 */
export function BarraComoLlegar({ href }: { href: string }) {
  return (
    <div className="calida-barra-llegar fixed inset-x-0 bottom-0 z-30 md:hidden">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-15 items-center gap-4 rounded-t-[1.25rem] bg-(--d-marino) px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-cream shadow-pop on-dark"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-(--d-marino-claro)">
          <Icon name="mapPin" className="size-5" />
        </span>
        <span className="flex-1 text-center text-[1.0625rem] font-semibold">Cómo llegar</span>
        <Icon name="arrowRight" className="size-6" />
        <span className="sr-only"> (abre Google Maps en una pestaña nueva)</span>
      </a>
    </div>
  );
}
