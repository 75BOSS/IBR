import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { botonPoster } from '../botones';
import type { Horario } from '../horarios';
import { CabeceraSeccion, Lema, PestanaNueva, Titulo } from '../piezas';

/**
 * Horarios de la primera visita como una cartelera: la hora enorme en rojo, el día en versalitas
 * y lo que pasa a esa hora; cada fila se invierte al pasar el cursor. Al lado, la foto del
 * auditorio con «Cómo llegar». Sin horarios cargados, invita a escribir (nunca inventa horas).
 */
export function Cartelera({
  horarios,
  comoLlegar,
}: {
  horarios: Horario[];
  comoLlegar: string | null;
}) {
  return (
    <section id="horarios" aria-labelledby="horarios-titulo" className="flex flex-col gap-1">
      <CabeceraSeccion
        id="horarios-titulo"
        lema="Cuándo nos reunimos"
        titulo={
          <>
            Te <em>esperamos</em>
          </>
        }
      />
      <div className="grid gap-1 @4xl/pagina:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {horarios.length > 0 ? (
          <ul className="@container flex flex-col border-2 border-ink">
            {horarios.map((h) => (
              <li
                key={`${h.dia}-${h.hora}`}
                className="d-invierte grid grow grid-cols-[auto_minmax(0,1fr)] items-center gap-x-[clamp(1rem,4cqi,2.5rem)] border-b-2 border-ink px-[clamp(1rem,4cqi,2rem)] py-[clamp(0.875rem,2.6cqi,1.5rem)] last:border-b-0"
              >
                <span className="font-display text-[clamp(2.75rem,13cqi,5.5rem)] leading-[0.85] font-black tracking-[-0.03em] text-(--inv-acento) font-stretch-[75%] tabular-nums">
                  {h.hora}
                </span>
                <span className="flex min-w-0 flex-col gap-1">
                  <Lema as="span" tamano="text-[clamp(0.6875rem,2.4cqi,0.875rem)]">
                    {h.dia}
                  </Lema>
                  <Titulo
                    as="span"
                    estilo="condensado"
                    className="text-[clamp(1.25rem,5cqi,2.25rem)] [overflow-wrap:anywhere]"
                  >
                    {h.nombres.join(' · ')}
                  </Titulo>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-start justify-center gap-4 border-2 border-ink p-[clamp(1.25rem,4vw,2.5rem)]">
            <Titulo estilo="grueso" as="p" className="text-[clamp(1.5rem,1.2rem+1.4vw,2.5rem)]">
              Pronto publicaremos los horarios.
            </Titulo>
            <Link href="/contacto#mensaje" className={botonPoster('tinta')}>
              Escríbenos y te contamos
              <Icon name="arrowRight" className="d-flecha size-[1.1em]" />
            </Link>
          </div>
        )}
        <div className="group @container relative isolate flex min-h-[clamp(18rem,60cqi,30rem)] flex-col justify-end overflow-hidden border-2 border-ink">
          <Image
            src="/disenos/poster/auditorio.webp"
            alt="El auditorio lleno durante un culto de domingo"
            fill
            sizes="(min-width: 64rem) 30vw, 100vw"
            className="-z-20 object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-t from-(--d-sombra-foto) via-(--d-sombra-foto)/40 via-55% to-transparent"
          />
          <div className="flex flex-col items-start gap-3 p-[clamp(1rem,6cqi,1.75rem)] text-canvas on-dark">
            <Titulo
              as="p"
              estilo="grueso"
              className="text-[clamp(1.75rem,10cqi,3rem)] text-balance"
            >
              Llega 10 minutos antes
            </Titulo>
            <p className="max-w-[30ch] leading-snug text-canvas/90">
              Así conoces al equipo de bienvenida y eliges tu lugar con calma.
            </p>
            {comoLlegar && (
              <a
                href={comoLlegar}
                target="_blank"
                rel="noopener noreferrer"
                className={botonPoster('crema')}
              >
                Cómo llegar
                <Icon name="arrowRight" className="d-flecha size-[1.1em]" />
                <PestanaNueva que="abre Google Maps en una pestaña nueva" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
