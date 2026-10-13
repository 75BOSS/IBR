import { Icon } from '@/components/Icon';
import { PestanaNueva, pildora } from './ui';

/**
 * Barra fija naranja «Cómo llegar» al pie de la pantalla del celular (imagen 9). Solo existe si
 * la iglesia tiene enlace de Google Maps o dirección. `data-barra-llegar` sube el selector de
 * diseños por encima de ella (tema.css).
 */
export function BarraLlegar({ href }: { href: string }) {
  return (
    <div
      data-barra-llegar
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-[clamp(0.625rem,3vw,1rem)] pb-[calc(0.625rem+env(safe-area-inset-bottom))] md:hidden"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={pildora({
          tono: 'naranja',
          tamano: 'lg',
          className: 'pointer-events-auto w-full shadow-pop on-dark',
        })}
      >
        <span aria-hidden="true" className="size-5" />
        <span className="flex grow items-center justify-center gap-3">
          <Icon name="mapPin" className="size-6" />
          Cómo llegar
        </span>
        <Icon name="arrowRight" className="size-5" />
        <PestanaNueva que="abre Google Maps" />
      </a>
    </div>
  );
}
