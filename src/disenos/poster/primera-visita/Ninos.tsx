import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { PREGUNTAS_VISITA } from '@/disenos/contenido';
import { RUTA_MINISTERIOS } from '../enlaces';
import type { Horario } from '../horarios';
import { SigueCursor } from '../movimiento/SigueCursor';
import { Lema, Titulo } from '../piezas';

export type MinisterioNinos = {
  slug: string;
  nombre: string;
  edad: string | null;
  descripcion: string | null;
  imagen: string | null;
  horarios: Horario[];
};

/** Lo que el sitio ya responde sobre los niños en las preguntas de la visita (ejemplo). */
const RESPUESTA_NINOS = PREGUNTAS_VISITA.find((p) => p.pregunta.includes('hijos'))?.respuesta;

/**
 * «Tus hijos tienen su lugar»: banda azul noche con los ministerios reales de niños y
 * adolescentes (foto, edades y su horario), cada uno enlazado a su sección en Ministerios. La
 * foto pasa de gris a color y una insignia «Conocer» sigue al cursor.
 */
export function Ninos({ ministerios }: { ministerios: MinisterioNinos[] }) {
  if (ministerios.length === 0) return null;
  return (
    <section
      id="ninos"
      aria-labelledby="ninos-titulo"
      className="@container bg-(--d-noche) text-canvas on-dark"
    >
      <div className="grid gap-[clamp(1.5rem,4cqi,3rem)] p-[clamp(1.25rem,5cqi,3.5rem)] @4xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] @4xl:items-start">
        <div className="flex flex-col gap-4">
          <Lema className="text-(--d-rojo-claro)">Ven en familia</Lema>
          <Titulo
            id="ninos-titulo"
            estilo="negro"
            className="text-[clamp(2.5rem,12cqi,5.5rem)] text-balance font-stretch-[80%] @4xl:text-[clamp(3rem,6.6cqi,6rem)]"
          >
            Tus hijos <span className="text-(--d-rojo-claro)">tienen</span> su lugar
          </Titulo>
          {RESPUESTA_NINOS && (
            <p className="max-w-[46ch] text-[clamp(1rem,0.95rem+0.3vw,1.1875rem)] leading-snug text-canvas/85">
              {RESPUESTA_NINOS}
            </p>
          )}
        </div>
        <ul className="grid gap-1 @xl:grid-cols-2">
          {ministerios.map((m) => (
            <li key={m.slug} className="@container flex">
              <Link
                href={`${RUTA_MINISTERIOS}#${m.slug}`}
                className="group flex flex-1 flex-col border-2 border-canvas/70 transition-colors hover:border-(--d-rojo-claro)"
              >
                <SigueCursor etiqueta="Conocer" className="relative aspect-[4/3] overflow-hidden">
                  {m.imagen ? (
                    <Image
                      src={m.imagen}
                      alt=""
                      fill
                      sizes="(min-width: 64rem) 22vw, (min-width: 36rem) 45vw, 100vw"
                      className="d-foto object-cover"
                    />
                  ) : (
                    <span aria-hidden="true" className="absolute inset-0 bg-accent" />
                  )}
                </SigueCursor>
                <span className="flex flex-1 flex-col gap-2 p-[clamp(1rem,6cqi,1.5rem)]">
                  <span className="flex items-baseline justify-between gap-3">
                    <Titulo
                      as="h3"
                      estilo="condensado"
                      className="min-w-0 text-[clamp(1.5rem,12cqi,2.5rem)] hyphens-auto"
                    >
                      {m.nombre}
                    </Titulo>
                    <Icon
                      name="arrowRight"
                      className="d-flecha size-6 shrink-0 text-(--d-rojo-claro)"
                    />
                  </span>
                  {m.edad && (
                    <Lema as="span" tamano="text-[0.75rem]" className="text-(--d-rojo-claro)">
                      {m.edad}
                    </Lema>
                  )}
                  {m.horarios.length > 0 && (
                    <span className="font-semibold">
                      {m.horarios.map((h) => `${h.dia} ${h.hora}`).join(' · ')}
                    </span>
                  )}
                  {m.descripcion && (
                    <span className="line-clamp-3 text-[0.9375rem] leading-snug text-canvas/80">
                      {m.descripcion}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
