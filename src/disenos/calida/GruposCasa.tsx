import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { toneVar } from '@/lib/css-vars';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import { FRECUENCIAS_LABEL, type GrupoPublico } from '@/lib/grupos-public';

/**
 * Grupos en casa reales (directorio público): una lista editorial con el día y la hora en grande,
 * el nombre en serifa, la edad (con el color del ministerio), la zona de Riobamba y cada cuánto se
 * reúnen. Desde tablet, la foto del grupo. Cada fila lleva a la página del grupo y se pinta durazno
 * al pasar el mouse; las filas aparecen una tras otra.
 */
export function GruposCasa({ grupos }: { grupos: GrupoPublico[] }) {
  return (
    <ol className="calida-escalonado @container border-t border-line">
      {grupos.map((g) => (
        <li key={g.id} className="border-b border-line">
          <Link
            href={`/grupos/${g.id}`}
            className="group grid grid-cols-[clamp(5.5rem,18cqi,7rem)_minmax(0,1fr)_auto] items-center gap-x-[clamp(0.875rem,3cqi,2rem)] rounded-[0.75rem] px-[clamp(0.25rem,1.5cqi,1rem)] py-[clamp(1rem,2.4cqi,1.5rem)] transition-colors duration-300 hover:bg-accent-soft @2xl:grid-cols-[clamp(5.5rem,14cqi,7rem)_5.5rem_minmax(0,1fr)_auto]"
          >
            <span className="flex flex-col leading-none">
              <span className="text-[0.7rem] font-bold tracking-[0.12em] text-accent-strong uppercase">
                {g.dia_semana ? DAY_NAMES[g.dia_semana] : FRECUENCIAS_LABEL[g.frecuencia]}
              </span>
              {g.hora && (
                <span className="pt-1.5 font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] text-ink">
                  {formatTime(g.hora)}
                </span>
              )}
            </span>
            <span className="relative hidden aspect-square overflow-hidden rounded-full bg-sunken @2xl:block">
              {g.imagen_url && (
                <Image
                  src={g.imagen_url}
                  alt=""
                  fill
                  sizes="5.5rem"
                  className="object-cover transition-[scale] duration-[1600ms] ease-(--ease-out-soft) motion-safe:pointer-fine:group-hover:scale-110"
                />
              )}
            </span>
            <span className="flex min-w-0 flex-col gap-1">
              <span className="font-display text-[clamp(1.25rem,1.05rem+0.8vw,1.75rem)] leading-tight text-ink">
                {g.nombre}
              </span>
              <span className="flex flex-wrap gap-x-4 gap-y-1 text-[0.95rem] text-ink-soft">
                {g.rango_edad && (
                  <span className="inline-flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      style={toneVar(g.rango_color, 'var(--color-accent)')}
                      className="size-2.5 rounded-full bg-(--tone)"
                    />
                    {g.rango_edad}
                  </span>
                )}
                {g.ubicacion_tipo === 'en_linea' ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="video" className="size-4 text-accent-strong" /> En línea
                  </span>
                ) : (
                  (g.zona ?? g.ubicacion) && (
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="mapPin" className="size-4 text-accent-strong" />
                      {g.zona ?? g.ubicacion}
                    </span>
                  )
                )}
                {g.dia_semana && <span>{FRECUENCIAS_LABEL[g.frecuencia]}</span>}
              </span>
            </span>
            <span className="grid size-11 place-items-center rounded-full ring-1 ring-line transition-colors duration-300 group-hover:bg-accent group-hover:text-cream group-hover:ring-accent">
              <Icon name="arrowRight" className="size-5" />
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
