import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import type { Area } from '@/lib/servir';
import { Marquesina } from '../movimiento/Marquesina';
import { A_LOS_BORDES } from '../PortadaPagina';
import { CabeceraSeccion, Titulo } from '../piezas';

/**
 * Sirve (#servir): una cinta roja con los nombres de las áreas reales que corre de lado y las
 * áreas en una grilla de fotos (gris que pasa a color) con su nombre en un rótulo. Cada área
 * abre el formulario «Quiero servir» con el área elegida. Sin áreas, no se dibuja.
 */
export function Servir({ areas }: { areas: Area[] }) {
  if (areas.length === 0) return null;
  return (
    <section id="servir" aria-labelledby="servir-titulo" className="flex flex-col gap-1">
      <CabeceraSeccion
        id="servir-titulo"
        lema="Paso 05 · Sirve"
        titulo={
          <>
            Sirve con tus <em>dones</em>
          </>
        }
        accion={{ href: '/servir', texto: 'Ver todas las áreas' }}
      />
      <Marquesina
        className={`${A_LOS_BORDES} my-[clamp(0.5rem,1.5cqi,1rem)]`}
        palabras={areas.map((a) => a.nombre)}
      />
      <ul className="grid grid-cols-2 gap-1 @3xl/pagina:grid-cols-3">
        {areas.map((a) => (
          <li key={a.id} className="@container flex">
            <Link
              href={`/servir?area=${a.slug}#quiero-servir`}
              className="group relative isolate flex min-h-[clamp(10rem,70cqi,16rem)] flex-1 flex-col justify-end overflow-hidden border-2 border-ink"
            >
              {a.imagen_url ? (
                <Image
                  src={a.imagen_url}
                  alt=""
                  fill
                  sizes="(min-width: 64rem) 25vw, 50vw"
                  className="d-foto -z-10 object-cover"
                />
              ) : (
                <span aria-hidden="true" className="absolute inset-0 -z-10 bg-(--d-durazno)" />
              )}
              <span className="flex items-center justify-between gap-2 bg-canvas px-[clamp(0.625rem,5cqi,1rem)] py-[clamp(0.5rem,3cqi,0.75rem)] transition-colors group-hover:bg-ink group-hover:text-canvas">
                <Titulo
                  as="h3"
                  estilo="condensado"
                  className="min-w-0 text-[clamp(1.0625rem,9cqi,1.75rem)] hyphens-auto"
                >
                  {a.nombre}
                </Titulo>
                <Icon name="arrowRight" className="d-flecha size-5 shrink-0" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
