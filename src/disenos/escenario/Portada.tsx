import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { FLECHA, claseBoton } from './estilos';
import { FotoArte } from './FotoArte';
import { PRIMERA_VISITA } from './rutas';

/**
 * Portada de la propuesta: el auditorio a todo lo ancho con el texto centrado (imagen 10) y, en
 * celular y tablet, la foto de cerca con el texto abajo sobre el velo (imagen 12). En escritorio
 * «empieza aquí.» va entero en la serifa negra roja; en celular solo «aquí.», en cursiva. En
 * celular y tablet el encabezado va encima de esta foto (de ahí el aire superior).
 */
export function Portada() {
  return (
    <section
      aria-labelledby="portada-titulo"
      className="relative isolate flex min-h-[clamp(29rem,120vw,42rem)] flex-col justify-end overflow-hidden bg-(--d-marino) text-cream on-dark lg:min-h-[clamp(32rem,39.6vw,38rem)] lg:justify-center"
    >
      <FotoArte
        ancha={{ src: '/disenos/escenario/portada.webp', width: 1536, height: 608 }}
        angosta={{ src: '/disenos/escenario/portada-celular.webp', width: 728, height: 657 }}
        prioridad
        className="absolute inset-0 -z-20 size-full object-cover object-[45%_30%] motion-safe:animate-slow-zoom lg:object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-(image:--d-velo-portada-celular) lg:bg-(image:--d-velo-portada)"
      />
      <div className="container-page flex flex-col items-center gap-[clamp(1rem,2.2vw,1.75rem)] pt-28 pb-[clamp(2.25rem,7vw,3.5rem)] text-center lg:py-16">
        <h1
          id="portada-titulo"
          className="font-headline text-[clamp(2.625rem,1.3rem+5.6vw,6.75rem)] leading-[0.92] font-extrabold tracking-[-0.045em]"
        >
          Tu domingo{' '}
          <span className="lg:block lg:font-serif lg:text-[0.93em] lg:leading-[0.9] lg:font-black lg:tracking-[-0.015em] lg:text-(--d-rojo)">
            empieza <em className="font-semibold italic lg:font-black lg:not-italic">aquí.</em>
          </span>
        </h1>
        <p className="max-w-[34rem] text-[clamp(1.0625rem,0.92rem+0.55vw,1.375rem)] text-balance text-cream/95">
          Una familia para conocer a Dios y compartir la vida.
        </p>
        <Link href={PRIMERA_VISITA} className={`${claseBoton('portada')} mt-1`}>
          Planifica tu visita
          <Icon name="arrowRight" className={FLECHA} />
        </Link>
      </div>
    </section>
  );
}
