import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Paralaje } from '@/disenos/vibrante/animacion/Paralaje';
import { botonClases } from '@/disenos/vibrante/boton';
import { Contenedor } from '@/disenos/vibrante/Contenedor';
import { Foto } from '@/disenos/vibrante/Foto';
import { FOTOS } from '@/disenos/vibrante/fotos';
import { type Destacado, TarjetaDestacada } from '@/disenos/vibrante/inicio/TarjetaDestacada';
import { RUTAS } from '@/disenos/vibrante/menu';
import { Titular } from '@/disenos/vibrante/Titular';

/**
 * «Personas que caminan juntas.» (imagen 4): texto, collage de tres fotos y la tarjeta negra de
 * la última prédica en una fila (desde 1280). Tablet y 1024: texto y collage, la tarjeta debajo a
 * lo ancho. Celular: todo apilado. Sin destacado, el texto y el collage se reparten la fila.
 */
export function PersonasJuntas({ destacado }: { destacado: Destacado | null }) {
  return (
    <section aria-labelledby="personas-titulo">
      <Contenedor
        className={`grid gap-[clamp(1rem,1.6vw,1.5rem)] py-[clamp(2.5rem,7vw,3.5rem)] md:grid-cols-2 xl:py-6 ${
          destacado
            ? 'xl:grid-cols-[minmax(0,25fr)_minmax(0,31fr)_minmax(0,40fr)]'
            : 'xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]'
        }`}
      >
        <div className="@container flex flex-col justify-center gap-[clamp(0.875rem,4cqi,1.25rem)] pb-4 md:pb-0">
          <p className="eyebrow text-accent">Una comunidad real</p>
          {/* Medida corta, como en la propuesta: «Personas / que caminan / juntas.». */}
          <Titular
            id="personas-titulo"
            tamano="columna"
            className="max-w-[6.4em]"
            lineas={['Personas', 'que caminan', 'juntas.']}
          />
          <p className="max-w-[40ch] text-[clamp(1rem,0.95rem+0.2vw,1.125rem)] leading-snug">
            En IBR encontrarás un lugar para pertenecer, crecer en la fe y compartir la vida con
            personas que también buscan a Dios.
          </p>
          <Link href={RUTAS.conocenos} className={botonClases({ className: 'mt-1 self-start' })}>
            Conoce más sobre nosotros <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>

        <Paralaje className="grid aspect-[447/337] grid-cols-[minmax(0,210fr)_minmax(0,228fr)] grid-rows-[158fr_173fr] gap-1.5 xl:aspect-auto xl:min-h-[clamp(20rem,22vw,23rem)]">
          <Foto
            foto={FOTOS.sonrisa}
            profundidad={1}
            sizes="(min-width: 80rem) 30vw, (min-width: 48rem) 50vw, 100vw"
            className="col-span-2"
          />
          <Foto
            foto={FOTOS.gorra}
            profundidad={2}
            sizes="(min-width: 80rem) 15vw, (min-width: 48rem) 25vw, 50vw"
          />
          <Foto
            foto={FOTOS.risas}
            profundidad={3}
            sizes="(min-width: 80rem) 15vw, (min-width: 48rem) 25vw, 50vw"
          />
        </Paralaje>

        {destacado && (
          <div className="md:col-span-2 xl:col-span-1">
            <TarjetaDestacada destacado={destacado} />
          </div>
        )}
      </Contenedor>
    </section>
  );
}
