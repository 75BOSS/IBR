import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Etiqueta } from './Etiqueta';
import { PortadaFoto } from './PortadaFoto';
import { Titulo } from './Titulo';
import { botonCalida } from './botones';
import { Texto } from './Texto';

/**
 * Portada del inicio. Escritorio desde 1280 px (imagen 1): dos columnas, el titular a la izquierda
 * y la foto grande con esquinas redondeadas que sangra hasta el borde derecho. Celular y tablet
 * (imagen 3): el texto a la izquierda sobre la foto, que se desvanece hacia la crema (así los dos
 * botones caben en una fila también a 1024 px).
 * `--margen` alinea el texto con el resto de la página en cualquier ancho (también > 1536 px).
 */
export function Portada({
  nombre,
  anioFundacion,
  verPredicas,
}: {
  nombre: string;
  anioFundacion: string | null;
  /** «Ver prédicas» solo si la página de prédicas tiene contenido. */
  verPredicas: boolean;
}) {
  return (
    <section
      aria-labelledby="calida-portada"
      className="relative isolate [--margen:max(1.25rem,6.5vw,calc((100vw_-_96rem)/2_+_6.25rem))] xl:grid xl:grid-cols-[minmax(0,calc(var(--margen)_+_min(35.5vw,34rem)))_minmax(0,1fr)] xl:gap-[clamp(1rem,1.2vw,1.25rem)] xl:pt-4"
    >
      <div className="relative flex w-[66%] flex-col items-start gap-[clamp(1rem,1.7vw,1.5rem)] py-[clamp(2rem,6vw,3.5rem)] pl-(--margen) md:w-[60%] xl:w-auto xl:justify-center xl:py-[clamp(1.25rem,2vw,2.25rem)] xl:pr-2">
        <Etiqueta className="text-accent-strong">
          {nombre}
          {anioFundacion ? ` · Desde ${anioFundacion}` : ''}
        </Etiqueta>
        <Titulo como="h1" id="calida-portada" tamano="portada" className="text-ink">
          Aquí somos <em className="-mt-[0.06em] block text-accent-strong">familia.</em>
        </Titulo>
        <Texto tamano="entrada" className="max-w-[30rem]">
          Conocemos a Dios y compartimos la vida.
        </Texto>
        <div className="flex flex-wrap gap-[clamp(0.75rem,1.1vw,1rem)] pt-[clamp(0.25rem,1vw,0.75rem)]">
          <Link href="/soy-nuevo" className={botonCalida('naranja')}>
            Planifica tu visita
            <Icon name="arrowRight" className="size-5" />
          </Link>
          {verPredicas && (
            <Link href="/predicas" className={botonCalida('contorno', 'grande', 'max-md:hidden')}>
              Ver prédicas
              <span className="grid size-7 place-items-center rounded-full border-[1.5px] border-current">
                <Icon name="play" className="ml-0.5 size-3 fill-current" />
              </span>
            </Link>
          )}
        </div>
      </div>

      <div className="absolute inset-y-0 right-0 -z-10 w-[56%] overflow-hidden rounded-br-[1.25rem] md:w-[52%] xl:relative xl:inset-auto xl:z-auto xl:min-h-[clamp(24rem,28.5vw,36rem)] xl:w-auto xl:rounded-l-[1.1rem] xl:rounded-br-none">
        <PortadaFoto className="absolute inset-0 size-full object-cover" />
        {/* Hasta 1280 px: la foto se funde con la crema bajo el texto (contraste del titular). */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-canvas from-[8%] via-canvas/80 via-30% to-transparent to-75% xl:hidden"
        />
      </div>
    </section>
  );
}
