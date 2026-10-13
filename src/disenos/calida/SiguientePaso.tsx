import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Contenedor } from './Contenedor';
import { Etiqueta } from './Etiqueta';
import { Foto } from './Foto';
import { Titulo } from './Titulo';
import { botonCalida } from './botones';
import { Texto } from './Texto';

/**
 * Banda «Tu siguiente paso» (imagen 2): la foto a la izquierda y el panel durazno con la
 * invitación a la primera visita. En el celular la foto queda arriba, de borde a borde.
 */
export function SiguientePaso() {
  return (
    <section aria-labelledby="calida-paso" className="@container pb-[clamp(3rem,7vw,6rem)]">
      <Contenedor ancho="amplio">
        <div className="grid overflow-hidden md:rounded-[0.875rem] @3xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Foto
            src="/disenos/calida/siguiente-paso.webp"
            alt="Dos amigas se abrazan sonriendo después de la reunión"
            sizes="(min-width: 48rem) 50vw, 100vw"
            encuadre="object-[60%_center]"
            className="relative min-h-[clamp(12rem,45cqi,16rem)] @3xl:min-h-full"
          />
          <div className="flex flex-col items-start justify-center gap-[clamp(0.75rem,1.6vw,1rem)] bg-(--d-durazno-panel) px-[clamp(1.25rem,6cqi,4.5rem)] py-[clamp(2rem,4.5cqi,3rem)]">
            <Etiqueta className="text-accent-strong">Para ti</Etiqueta>
            <Titulo
              id="calida-paso"
              tamano="libre"
              className="text-[clamp(2.125rem,4.6cqi,3.75rem)] leading-[0.98] text-ink"
            >
              Tu siguiente <em>paso</em>
            </Titulo>
            <Texto className="max-w-[27rem]">
              Si es tu primera vez en IBR, queremos conocerte y ayudarte a dar tus primeros pasos en
              esta familia.
            </Texto>
            <Link href="/soy-nuevo" className={botonCalida('naranja', 'normal', 'mt-1')}>
              Soy nuevo
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
        </div>
      </Contenedor>
    </section>
  );
}
