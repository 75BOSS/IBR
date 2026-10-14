import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { botonClases } from '@/disenos/vibrante/boton';
import { Foto } from '@/disenos/vibrante/Foto';
import type { FotoVibrante } from '@/disenos/vibrante/fotos';
import { Titular } from '@/disenos/vibrante/Titular';

const FONDOS = {
  /** Negro con la segunda línea en rojo vivo (imagen 5). */
  negro: {
    seccion: 'bg-(--d-negro)',
    destacada: 'text-(--d-rojo-vivo)',
    velo: 'from-(--d-negro) lg:via-(--d-negro)/10',
    boton: 'rojo',
  },
  /** Rojo con la segunda línea en negro (titular grande: 3.9:1, suficiente para letra grande). */
  rojo: {
    seccion: 'bg-accent',
    destacada: 'text-(--d-negro)',
    velo: 'from-accent lg:via-accent/10',
    boton: 'crema',
  },
} as const;

/**
 * Banda de cierre de página (imagen 5): titular en dos líneas (la segunda en color), la
 * invitación con su botón y una foto que se funde con el fondo. Cada página le da su propio texto
 * y destino; «Siempre hay un lugar para ti.» es el de Comunidad.
 */
export function BandaCierre({
  id,
  etiqueta = 'Tu siguiente paso',
  linea,
  destacada,
  texto,
  accion,
  foto,
  fondo = 'negro',
}: {
  /** id del titular. */
  id: string;
  etiqueta?: string;
  linea: string;
  destacada: string;
  texto: string;
  accion: { href: string; texto: string };
  foto: FotoVibrante;
  fondo?: keyof typeof FONDOS;
}) {
  const tono = FONDOS[fondo];
  return (
    <section
      aria-labelledby={id}
      data-cursor-claro={fondo === 'rojo' ? '' : undefined}
      className={`grid text-canvas on-dark lg:grid-cols-[minmax(0,58.5fr)_minmax(0,41.5fr)] ${tono.seccion}`}
    >
      <div className="@container grid items-center gap-x-[clamp(1.5rem,4cqi,3.5rem)] gap-y-6 py-[clamp(2.5rem,7vw,3.5rem)] pr-[clamp(1rem,3.9vw,2rem)] pl-[clamp(1rem,3.9vw,3.75rem)] md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">{etiqueta}</p>
          <Titular
            id={id}
            tamano="libre"
            className="text-[clamp(2.375rem,9cqi,4rem)] leading-[0.92]"
            lineas={[
              linea,
              <span key="destacada" className={tono.destacada}>
                {destacada}
              </span>,
            ]}
          />
        </div>
        <div className="flex flex-col items-start gap-4">
          <p className="max-w-[36ch] text-[clamp(1rem,0.95rem+0.2vw,1.0625rem)] leading-snug">
            {texto}
          </p>
          <Link href={accion.href} className={botonClases({ variante: tono.boton })}>
            {accion.texto} <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>
      </div>
      <div className="relative min-h-[clamp(12rem,40vw,16rem)] lg:min-h-0">
        <Foto foto={foto} absoluta sizes="(min-width: 64rem) 42vw, 100vw" className="inset-0" />
        {/* La foto se funde con la banda: hacia arriba en celular, hacia la izquierda desde lg. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-linear-to-b via-transparent to-transparent lg:bg-linear-to-r ${tono.velo}`}
        />
      </div>
    </section>
  );
}
