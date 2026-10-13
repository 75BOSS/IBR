import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { formatTime } from '@/lib/dates';
import { IconoPoster } from '../IconoPoster';
import { PestanaNueva, Titulo } from '../piezas';

/** «10:00», «10:00 y 18:00», «8:00, 10:00 y 18:00». */
function unirHoras(horas: string[]): string {
  if (horas.length < 2) return horas.join('');
  return `${horas.slice(0, -1).join(', ')} y ${horas.at(-1)}`;
}

/**
 * Bloque rojo «Este domingo» con las horas reales del culto y «Cómo llegar». En la grilla de
 * escritorio (imagen 13) es una columna; en el celular (imagen 15), una banda con el calendario
 * y el botón a la derecha. Lo decide el ancho de la página (`@2xl/pagina`), no el del bloque:
 * en ambos casos el bloque mide parecido. Sin reunión el domingo dice «Te esperamos» con los
 * otros horarios; sin horarios, ofrece escribir.
 */
export function BloqueDomingo({
  reuniones,
  horarios,
  hayHorarios,
  comoLlegar,
  className = '',
}: {
  reuniones: { dia_semana: number; hora_inicio: string }[];
  horarios: string[];
  hayHorarios: boolean;
  comoLlegar: string | null;
  className?: string;
}) {
  const domingo = [
    ...new Set(reuniones.filter((r) => r.dia_semana === 7).map((r) => formatTime(r.hora_inicio))),
  ];
  const cuando =
    domingo.length > 0 ? `A las ${unirHoras(domingo)}` : horarios.slice(0, 2).join(' · ');

  return (
    <section
      aria-labelledby="este-domingo"
      className={`@container bg-accent text-canvas on-dark ${className}`}
    >
      <div className="flex h-full items-center gap-x-[2.8cqi] px-[3.4cqi] py-[3cqi] @2xl/pagina:flex-col @2xl/pagina:items-stretch @2xl/pagina:justify-between @2xl/pagina:gap-[5.5cqi] @2xl/pagina:px-[10cqi] @2xl/pagina:pt-[6.5cqi] @2xl/pagina:pb-[6.5cqi]">
        <IconoPoster
          nombre="calendar"
          className="size-[clamp(1.5rem,7.2cqi,3.25rem)] @2xl/pagina:hidden"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-[0.8cqi] @2xl/pagina:flex-none @2xl/pagina:gap-[3.6cqi]">
          <Titulo
            id="este-domingo"
            estilo="grueso"
            className="text-[clamp(1.0625rem,5.7cqi,2.5rem)] @2xl/pagina:border-b @2xl/pagina:border-canvas/80 @2xl/pagina:pb-[4.5cqi] @2xl/pagina:text-[clamp(2rem,19.5cqi,4.75rem)] @2xl/pagina:leading-[0.88]"
          >
            {domingo.length > 0 ? 'Este domingo' : 'Te esperamos'}
          </Titulo>
          <div className="flex flex-col text-[clamp(0.8125rem,3.5cqi,1.125rem)] leading-snug @2xl/pagina:gap-[1.5cqi] @2xl/pagina:text-[clamp(1rem,5.8cqi,1.375rem)]">
            {cuando && <p className="font-semibold">{cuando}</p>}
            {hayHorarios ? (
              <Link href="/reuniones" className="w-fit link">
                Consulta los horarios
              </Link>
            ) : (
              !cuando && (
                <Link href="/contacto#mensaje" className="w-fit link">
                  Escríbenos y te contamos
                </Link>
              )
            )}
          </div>
        </div>
        {comoLlegar && (
          <>
            <span
              aria-hidden="true"
              className="w-0.5 self-stretch bg-canvas/70 @2xl/pagina:hidden"
            />
            <a
              href={comoLlegar}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-11 shrink-0 items-center justify-center gap-[0.55em] rounded-md bg-canvas px-[0.8em] py-[0.55em] font-display text-[clamp(0.875rem,3.7cqi,1.375rem)] leading-none font-bold text-ink font-stretch-[90%] @2xl/pagina:justify-start @2xl/pagina:px-[9cqi] @2xl/pagina:py-[4.6cqi] @2xl/pagina:text-[clamp(1rem,6.2cqi,1.5rem)]"
            >
              Cómo llegar
              <Icon
                name="arrowRight"
                className="size-[1.05em] motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
              />
              <PestanaNueva que="abre Google Maps en una pestaña nueva" />
            </a>
          </>
        )}
      </div>
    </section>
  );
}
