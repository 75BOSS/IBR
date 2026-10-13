import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { diaPrincipal } from './horarios';
import { IconoNavegar } from './IconoNavegar';

type Props = {
  reuniones: { dia_semana: number; hora_inicio: string }[];
  /** Hay horarios publicados: «Consulta los horarios» lleva a /reuniones. */
  hayHorarios: boolean;
  direccion: string | null;
  comoLlegar: string | null;
};

const ENLACE_MAPA = ' (abre Google Maps en una pestaña nueva)';

/** Raya vertical corta entre dos datos de la franja (no antes del primero). */
const SEPARADOR =
  'relative not-first:before:absolute not-first:before:top-1/2 not-first:before:left-0 not-first:before:h-7 not-first:before:w-px not-first:before:-translate-y-1/2 not-first:before:bg-ink/35';
const CELDA_ANCHA = `${SEPARADOR} px-[clamp(2rem,4.5vw,4.5rem)]`;

/** Acceso de la franja en celular: ícono rojo grande, texto y flecha (imagen 12). */
function Acceso({
  href,
  externo,
  icono,
  children,
}: {
  href: string;
  externo?: boolean;
  icono: 'calendar' | 'mapPin';
  children: React.ReactNode;
}) {
  const contenido = (
    <>
      <Icon name={icono} className="size-[clamp(1.5rem,0.9rem+2.4vw,1.75rem)] text-(--d-rojo)" />
      <span className="max-w-[8.5rem] leading-tight">{children}</span>
      <Icon
        name="arrowRight"
        className="size-4 transition-transform motion-safe:group-hover:translate-x-1 xs:size-5"
      />
    </>
  );
  const clase =
    'group inline-flex min-h-12 items-center gap-2 text-left font-display text-[clamp(0.9375rem,0.8rem+0.6vw,1.0625rem)] font-semibold xs:gap-2.5';
  return (
    <li className={`${SEPARADOR} flex flex-1 justify-center px-2`}>
      {externo ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={clase}>
          {contenido}
          <span className="sr-only">{ENLACE_MAPA}</span>
        </a>
      ) : (
        <Link href={href} className={clase}>
          {contenido}
        </Link>
      )}
    </li>
  );
}

/**
 * Franja crema bajo la portada con cuándo y dónde (imagen 10: tres datos con íconos rojos;
 * imagen 12: «Domingos» grande y dos accesos). Cada dato aparece solo si existe: sin dirección
 * cargada no hay columna de dirección, sin enlace de mapa no hay «Cómo llegar».
 */
export function FranjaDomingos({ reuniones, hayHorarios, direccion, comoLlegar }: Props) {
  const principal = hayHorarios ? diaPrincipal(reuniones) : null;
  if (!principal && !direccion && !comoLlegar) return null;

  return (
    <section aria-label="Cuándo y dónde" className="bg-sunken">
      {/* Escritorio: una fila con los tres datos separados por rayas cortas. */}
      <ul className="container-page hidden min-h-[4.5rem] items-center justify-center text-[1.0625rem] lg:flex">
        {principal && (
          <li className={CELDA_ANCHA}>
            <Link href="/reuniones" className="group inline-flex min-h-11 items-center gap-3">
              <Icon name="calendar" className="size-5 text-(--d-rojo)" />
              <span>
                <strong className="font-bold">
                  {principal.dia} {principal.horas}
                </strong>
                <span className="text-ink-soft"> · </span>
                <span className="underline-offset-4 group-hover:underline">
                  Consulta los horarios
                </span>
              </span>
            </Link>
          </li>
        )}
        {direccion && (
          <li className={`${CELDA_ANCHA} flex min-h-11 items-center gap-3`}>
            <Icon name="mapPin" className="size-5 text-(--d-rojo)" />
            <strong className="font-bold">{direccion}</strong>
          </li>
        )}
        {comoLlegar && (
          <li className={CELDA_ANCHA}>
            <a
              href={comoLlegar}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-3 font-bold underline-offset-4 hover:underline"
            >
              <IconoNavegar className="size-5 text-(--d-rojo)" />
              Cómo llegar
              <span className="sr-only">{ENLACE_MAPA}</span>
            </a>
          </li>
        )}
      </ul>

      {/* Celular y tablet: el día grande y dos accesos con flecha. */}
      <div className="container-page flex flex-col items-center gap-3 py-[clamp(1.25rem,5vw,1.75rem)] text-center lg:hidden">
        {principal && (
          <p className="font-headline text-[clamp(2.125rem,1.5rem+3vw,2.75rem)] leading-none font-extrabold tracking-[-0.045em]">
            {principal.dia} <span className="text-(--d-rojo)">{principal.horas}</span>
          </p>
        )}
        {direccion && <p className="text-ink-soft">{direccion}</p>}
        <ul className="flex w-full max-w-[26rem] justify-center">
          {principal && (
            <Acceso href="/reuniones" icono="calendar">
              Consulta los horarios
            </Acceso>
          )}
          {comoLlegar && (
            <Acceso href={comoLlegar} externo icono="mapPin">
              Cómo llegar
            </Acceso>
          )}
        </ul>
      </div>
    </section>
  );
}
