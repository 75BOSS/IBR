import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { BarraVisita, type DatosVisita } from './Visita';
import { Alterna, Aro, CONTENEDOR, Foto, pildora } from './ui';

/**
 * Portada del inicio (imágenes 7 y 9): noche azul con la foto a la derecha y un velo que la funde
 * hacia el titular. En escritorio la barra de la visita monta sobre el borde inferior: la foto
 * termina a la mitad de la barra y la otra mitad queda sobre la crema de la sección siguiente.
 */
export function Portada({ predicas, ...visita }: DatosVisita & { predicas: boolean }) {
  return (
    <section aria-labelledby="portada-titulo" className="relative isolate text-cream on-dark">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 bottom-0 -z-10 overflow-hidden bg-(--d-noche) lg:bottom-[calc(var(--d-barra)/2)]"
      >
        {/* Celular: la mujer que adora con la mano en alto (imagen 9). Tablet y escritorio: la
            congregación de la imagen 7. Las dos llegan con la página; cada una se ve en su ancho. */}
        <Foto
          src="portada-movil.webp"
          sizes="60vw"
          prioridad
          encuadre="object-left"
          capa
          className="inset-y-0 right-0 w-[48%] mask-l-from-75% md:hidden"
        />
        <Foto
          src="portada.webp"
          sizes="(min-width: 64rem) 60vw, 70vw"
          prioridad
          encuadre="object-left lg:object-[40%_center]"
          capa
          className="inset-y-0 right-0 hidden w-[62%] mask-l-from-60% md:block lg:w-[64%]"
        />
        <div className="absolute inset-0 hidden bg-linear-to-r from-(--d-noche)/70 from-30% to-(--d-noche)/0 to-60% md:block" />
      </div>

      <div
        className={`${CONTENEDOR} pt-[clamp(3.5rem,1.5rem+5vw,5.25rem)] pb-[clamp(1.75rem,5vw,3rem)] lg:pb-0`}
      >
        <div className="flex flex-col items-start pl-[clamp(0rem,8vw_-_2.25rem,5.5rem)]">
          <h1
            id="portada-titulo"
            className="font-display text-[clamp(3.25rem,2.2rem+4.6vw,6.15rem)] leading-[0.94] font-extrabold tracking-[-0.035em] text-cream"
          >
            <span className="block">
              Aquí <br className="md:hidden" />
              somos
            </span>
            <em className="-ml-[0.05em] block text-[1.34em] leading-[0.74] md:-ml-[0.2em]">
              familia.
            </em>
          </h1>
          <p className="mt-[clamp(0.75rem,2vw,1.25rem)] max-w-[14rem] text-[clamp(1.0625rem,0.8rem+0.95vw,1.625rem)] leading-snug font-light md:max-w-[24rem] lg:max-w-none">
            <Alterna
              movil="Una iglesia para conocer a Jesús, crecer juntos y servir a nuestra ciudad."
              escritorio="Conocemos a Dios y compartimos la vida."
            />
          </p>
          <span
            aria-hidden="true"
            className="mt-[clamp(1rem,1.6vw,1.5rem)] hidden h-0.5 w-[2.4rem] bg-(--d-durazno) md:block"
          />
          <div className="mt-[clamp(1.25rem,1.6vw,1.5rem)] flex flex-wrap gap-x-5 gap-y-3">
            <Link href="/soy-nuevo" className={pildora({ tono: 'durazno', tamano: 'lg' })}>
              Planifica tu visita
              <Icon name="arrowRight" className="size-[1.2em]" />
            </Link>
            {/* En celular la imagen 9 deja una sola llamada: «Ver prédicas» aparece desde tablet. */}
            {predicas && (
              <div className="hidden md:block">
                <Link href="/predicas" className={pildora({ tono: 'contornoClaro', tamano: 'lg' })}>
                  Ver prédicas
                  <Aro className="size-[1.45em]">
                    <Icon name="play" fill="currentColor" className="ml-[0.1em] size-[0.6em]" />
                  </Aro>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="mt-[clamp(1.5rem,2.6vw,2.3rem)] hidden lg:block">
          <BarraVisita {...visita} />
        </div>
      </div>
    </section>
  );
}
