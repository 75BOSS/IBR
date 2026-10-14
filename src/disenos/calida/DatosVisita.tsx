import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import { Contenedor } from './Contenedor';
import { Etiqueta } from './Etiqueta';
import { Foto } from './Foto';
import { IconoNavegar } from './IconoNavegar';
import { Titulo } from './Titulo';
import { diaPrincipal, rutaCalida } from './textos';

type Destino = { href: string; externo: boolean };

/** Enlace interno o a Google Maps (pestaña nueva, avisado a lectores de pantalla). */
function Destino({
  destino,
  className,
  children,
}: {
  destino: Destino;
  className: string;
  children: ReactNode;
}) {
  if (!destino.externo) {
    return (
      <Link href={destino.href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={destino.href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> (abre Google Maps en una pestaña nueva)</span>
    </a>
  );
}

/**
 * Cuándo y dónde, justo debajo de la portada. Según el ancho de su contenedor:
 * - angosto (imagen 3): tarjeta azul marino «Domingos» con filas (horarios, cómo llegar) y foto;
 * - ancho (imagen 1): franja durazno con tres datos separados por divisores.
 * Horarios reales de la BD; sin reuniones ni ubicación cargadas, la sección no aparece.
 */
export function DatosVisita({
  reuniones,
  horarios,
  verHorarios,
  comoLlegar,
}: {
  reuniones: { dia_semana: number; hora_inicio: string }[];
  horarios: string[];
  /** La página de reuniones tiene horarios. */
  verHorarios: boolean;
  comoLlegar: string | null;
}) {
  const principal = diaPrincipal(reuniones);
  if (!principal && !comoLlegar) return null;
  // Los horarios están en la Primera visita de la propuesta (solo si hay reuniones cargadas).
  const aHorarios: Destino | null = verHorarios
    ? { href: rutaCalida('/primera-visita#horarios'), externo: false }
    : null;
  const aMapa: Destino | null = comoLlegar ? { href: comoLlegar, externo: true } : null;

  const filas = [
    aHorarios && {
      icono: <Icon name="clock" className="size-5" />,
      texto: 'Consulta los horarios',
      destino: aHorarios,
    },
    aMapa && {
      icono: <Icon name="mapPin" className="size-5" />,
      texto: 'Cómo llegar',
      destino: aMapa,
    },
  ].filter((f) => f !== null);

  const datos = [
    principal && {
      icono: <Icon name="calendar" className="size-[45%]" />,
      titulo: `${principal.dia} ${principal.horas}`,
      detalle: aHorarios ? 'Consulta los horarios' : 'Te esperamos',
      destino: aHorarios,
    },
    {
      icono: <Icon name="mapPin" className="size-[45%]" />,
      titulo: 'Riobamba',
      detalle: 'Nuestra ciudad',
      destino: null,
    },
    aMapa && {
      icono: <IconoNavegar className="size-[42%]" />,
      titulo: 'Cómo llegar',
      detalle: 'Te esperamos',
      destino: aMapa,
    },
  ].filter((d) => d !== null);

  return (
    <section aria-label="Cuándo y dónde nos reunimos" className="@container">
      {/* Angosto: tarjeta «Domingos» de borde a borde. */}
      <div className="@container/tarjeta grid grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] gap-[clamp(0.625rem,3cqi,1.5rem)] rounded-r-[1.25rem] bg-(--d-marino) py-[clamp(0.875rem,4cqi,1.25rem)] pl-[max(1.25rem,5.5vw)] text-cream on-dark @2xl:hidden">
        <div className="flex min-w-0 flex-col gap-[clamp(0.5rem,2.5cqi,0.875rem)] py-[clamp(0.5rem,3cqi,1rem)]">
          <Etiqueta className="text-peach">Te esperamos</Etiqueta>
          <Titulo tamano="libre" className="text-[clamp(2.25rem,12cqi,3.5rem)] leading-none">
            {principal?.dia ?? 'Visítanos'}
          </Titulo>
          {horarios.length > 0 && (
            <p className="text-[0.95rem] text-peach">{horarios.slice(0, 2).join(' · ')}</p>
          )}
          {filas.length > 0 && (
            <ul className="divide-y divide-cream/12">
              {filas.map((f) => (
                <li key={f.texto}>
                  <Destino
                    destino={f.destino}
                    className="flex min-h-14 items-center gap-2.5 py-1.5 text-[clamp(0.875rem,3.9cqi,1.0625rem)] font-medium"
                  >
                    <span className="grid size-[clamp(2.25rem,10cqi,2.75rem)] shrink-0 place-items-center rounded-full bg-(--d-marino-claro)">
                      {f.icono}
                    </span>
                    <span className="flex-1">{f.texto}</span>
                    <Icon name="chevronRight" className="size-4" />
                  </Destino>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Foto
          src="/disenos/calida/domingos.webp"
          alt="Un hermano levanta la mano durante la alabanza del domingo"
          sizes="40vw"
          className="relative min-h-[11rem] rounded-l-[1rem]"
        />
      </div>

      {/* Ancho: franja durazno con los datos. */}
      <Contenedor className="hidden @2xl:block">
        <h2 className="sr-only">Cuándo y dónde nos reunimos</h2>
        <ul className="grid auto-cols-fr grid-flow-col rounded-[0.75rem] bg-accent-soft">
          {datos.map((d, i) => {
            const contenido = (
              <>
                <span className="grid size-[clamp(2.5rem,1.9rem+1.4vw,3.25rem)] shrink-0 place-items-center rounded-full bg-(--d-durazno-fuerte) text-accent-strong">
                  {d.icono}
                </span>
                <span className="flex flex-col gap-1.5">
                  <Titulo como="p" tamano="dato" className="text-ink">
                    {d.titulo}
                  </Titulo>
                  <span className="text-[clamp(0.625rem,0.58rem+0.15vw,0.7rem)] font-bold tracking-[0.16em] text-accent-strong uppercase lg:tracking-[0.28em]">
                    {d.detalle}
                  </span>
                </span>
              </>
            );
            const clases =
              'flex h-full items-center justify-center gap-[clamp(0.75rem,2.4vw,2.5rem)] px-[clamp(0.75rem,2vw,2rem)] py-[clamp(1rem,1.5vw,1.25rem)]';
            return (
              <li
                key={d.titulo}
                className={`relative ${i > 0 ? 'before:absolute before:top-1/2 before:left-0 before:h-[55%] before:w-px before:-translate-y-1/2 before:bg-(--d-raya)' : ''}`}
              >
                {d.destino ? (
                  <Destino
                    destino={d.destino}
                    className={`${clases} rounded-[0.75rem] transition-colors hover:bg-(--d-durazno-fuerte)/40`}
                  >
                    {contenido}
                  </Destino>
                ) : (
                  <div className={clases}>{contenido}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Contenedor>
    </section>
  );
}
