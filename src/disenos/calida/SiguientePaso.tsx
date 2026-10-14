import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import { Contenedor } from './Contenedor';
import { Etiqueta } from './Etiqueta';
import { Foto } from './Foto';
import { Titulo } from './Titulo';
import { botonCalida } from './botones';
import { Texto } from './Texto';
import { rutaCalida } from './textos';

/**
 * Banda «Tu siguiente paso» (imagen 2): la foto a la izquierda y el panel durazno con una
 * invitación. En el celular la foto queda arriba, de borde a borde. Por omisión invita a la
 * primera visita; cada página puede cambiar el texto, el botón y la foto (cierre de página).
 */
export function SiguientePaso({
  id = 'calida-paso',
  etiqueta = 'Para ti',
  titulo = (
    <>
      Tu siguiente <em>paso</em>
    </>
  ),
  texto = 'Si es tu primera vez en IBR, queremos conocerte y ayudarte a dar tus primeros pasos en esta familia.',
  boton = { href: rutaCalida('/primera-visita'), label: 'Soy nuevo' },
  foto = {
    src: '/disenos/calida/siguiente-paso.webp',
    alt: 'Dos amigas se abrazan sonriendo después de la reunión',
    encuadre: 'object-[60%_center]',
  },
}: {
  id?: string;
  etiqueta?: string;
  titulo?: ReactNode;
  texto?: ReactNode;
  boton?: { href: string; label: string };
  foto?: { src: string; alt: string; encuadre?: string };
}) {
  return (
    <section aria-labelledby={id} className="@container pb-[clamp(3rem,7vw,6rem)]">
      <Contenedor ancho="amplio">
        <div className="calida-aparece grid overflow-clip md:rounded-[0.875rem] @3xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Foto
            src={foto.src}
            alt={foto.alt}
            sizes="(min-width: 48rem) 50vw, 100vw"
            encuadre={foto.encuadre}
            paralaje
            className="relative min-h-[clamp(12rem,45cqi,16rem)] @3xl:min-h-full"
          />
          <div className="flex flex-col items-start justify-center gap-[clamp(0.75rem,1.6vw,1rem)] bg-(--d-durazno-panel) px-[clamp(1.25rem,6cqi,4.5rem)] py-[clamp(2rem,4.5cqi,3rem)]">
            <Etiqueta className="text-accent-strong">{etiqueta}</Etiqueta>
            <Titulo
              id={id}
              tamano="libre"
              className="text-[clamp(2.125rem,4.6cqi,3.75rem)] leading-[0.98] text-ink"
            >
              {titulo}
            </Titulo>
            <Texto className="max-w-[27rem]">{texto}</Texto>
            <Link href={boton.href} className={botonCalida('naranja', 'normal', 'mt-1')}>
              {boton.label}
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
        </div>
      </Contenedor>
    </section>
  );
}
