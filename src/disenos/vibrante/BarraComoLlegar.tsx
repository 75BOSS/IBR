import { Icon } from '@/components/Icon';

/**
 * Barra roja fija abajo en el celular (imagen 6): «Cómo llegar» a un toque. Solo existe si hay
 * a dónde llevar (Google Maps de la iglesia o su dirección); desde tablet la franja negra ya
 * tiene el enlace. `data-barra-llegar` sube el selector de diseños por encima (tema.css). El
 * anillo de foco va por dentro de la barra: afuera quedaría sobre cualquier fondo.
 */
export function BarraComoLlegar({ href }: { href: string }) {
  return (
    <div data-barra-llegar className="fixed inset-x-0 bottom-0 z-30 p-2 md:hidden">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex min-h-14 items-center justify-center gap-3 rounded-[0.5rem] bg-accent px-14 text-lg font-bold text-canvas shadow-pop on-dark focus-visible:outline-offset-[-0.375rem]"
      >
        <Icon name="mapPin" className="size-6" />
        <span>Cómo llegar</span>
        <span className="sr-only"> (abre Google Maps en una pestaña nueva)</span>
        <Icon name="arrowRight" className="absolute right-5 size-6" />
      </a>
    </div>
  );
}
