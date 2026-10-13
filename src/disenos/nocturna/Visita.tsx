import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import { IconoMapa } from './IconoMapa';
import { Aro, Etiqueta, Foto, PestanaNueva } from './ui';
import { type DiaDeReunion, unirHoras } from './dia-de-reunion';

/** Cuándo y dónde: lo mismo en la barra de escritorio y en la tarjeta del celular. */
export type DatosVisita = {
  visita: DiaDeReunion | null;
  /** Hay horarios publicados: «Consulta los horarios» lleva a /reuniones. */
  horarios: boolean;
  comoLlegar: string | null;
  direccion: string | null;
};

const MAPA_NUEVA = 'abre Google Maps';

function Dato({
  icono,
  etiqueta,
  children,
}: {
  icono: ReactNode;
  etiqueta: string;
  children: ReactNode;
}) {
  return (
    <li className="flex flex-auto items-center gap-[clamp(0.875rem,1.9vw,1.8rem)] px-[clamp(1rem,4vw_-_1.5rem,2.6rem)]">
      <Aro className="size-[clamp(2.5rem,0.5rem+3vw,3.625rem)] text-(--d-arena)">{icono}</Aro>
      <div className="flex min-w-0 flex-col gap-1.5">
        <Etiqueta raya={false} className="whitespace-nowrap text-(--d-arena)">
          {etiqueta}
        </Etiqueta>
        <p className="font-display text-[clamp(1rem,0.2rem+1.25vw,1.375rem)] leading-tight font-semibold">
          {children}
        </p>
      </div>
    </li>
  );
}

/**
 * Barra azul que monta sobre el borde inferior de la portada (imagen 7): cuándo, dónde y cómo
 * llegar. Solo en escritorio; en celular y tablet va `TarjetaVisita`.
 */
export function BarraVisita({ visita, horarios, comoLlegar, direccion }: DatosVisita) {
  return (
    <ul className="relative flex min-h-(--d-barra) items-stretch divide-x divide-cream/15 rounded-[0.875rem] bg-(--d-marino) py-[clamp(0.75rem,1vw,1.125rem)] text-cream shadow-lift ring-1 ring-cream/10">
      <Dato icono={<Icon name="calendar" className="size-[45%]" />} etiqueta="Te esperamos">
        {visita ? `${visita.dia} ${unirHoras(visita.horas)}` : 'Cada domingo'}
        {horarios && (
          <>
            <span aria-hidden="true" className="px-2 text-peach">
              ·
            </span>
            <Link
              href="/reuniones"
              className="underline decoration-peach/0 decoration-2 underline-offset-4 transition-colors hover:decoration-peach"
            >
              Consulta los horarios
            </Link>
          </>
        )}
      </Dato>
      <Dato icono={<Icon name="mapPin" className="size-[45%]" />} etiqueta="Nos encontramos en">
        {direccion ?? 'Riobamba'}
      </Dato>
      {comoLlegar && (
        <Dato icono={<IconoMapa className="size-[45%]" />} etiqueta="Cómo llegar">
          <a
            href={comoLlegar}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 whitespace-nowrap hover:text-peach"
          >
            Ver en el mapa
            <Icon
              name="arrowRight"
              className="size-5 transition-transform motion-safe:group-hover:translate-x-1"
            />
            <PestanaNueva que={MAPA_NUEVA} />
          </a>
        </Dato>
      )}
    </ul>
  );
}

/** Botón rectangular de la tarjeta «Domingos» (imagen 9): ícono, texto y flecha. */
function BotonTarjeta({
  href,
  externo = false,
  tono,
  icono,
  className,
  children,
}: {
  href: string;
  externo?: boolean;
  tono: 'marino' | 'contorno';
  icono: ReactNode;
  className: string;
  children: ReactNode;
}) {
  const clases = `flex min-h-[clamp(3rem,12cqi,3.75rem)] items-center gap-[clamp(0.5rem,2.5cqi,0.875rem)] rounded-[0.75rem] px-[clamp(0.75rem,3.5cqi,1.25rem)] py-2 font-display text-[clamp(0.875rem,3.4cqi,1.0625rem)] leading-tight font-semibold transition-colors ${
    tono === 'marino'
      ? 'bg-brand text-cream on-dark hover:bg-brand-strong'
      : 'border-[1.5px] border-ink bg-canvas text-ink hover:bg-sunken'
  } ${className}`;
  const contenido = (
    <>
      {icono}
      <span className="grow">{children}</span>
      <Icon name="arrowRight" className="size-5" />
    </>
  );
  return externo ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={clases}>
      {contenido}
      <PestanaNueva que={MAPA_NUEVA} />
    </a>
  ) : (
    <Link href={href} className={clases}>
      {contenido}
    </Link>
  );
}

/**
 * Tarjeta crema «Te esperamos · Domingos» del celular (imagen 9): el día real de reunión, su
 * hora y los dos caminos (horarios y cómo llegar), con la foto del predicador a la derecha.
 */
export function TarjetaVisita({ visita, horarios, comoLlegar }: DatosVisita) {
  const domingo = visita?.domingo ?? true;
  const hora = visita && visita.horas.length > 0 ? `, a las ${unirHoras(visita.horas)}` : '';
  return (
    <div className="bg-(--d-noche) md:px-[clamp(1rem,3.65vw,3.5rem)] md:pb-[clamp(1.5rem,4vw,3rem)] lg:hidden">
      <section
        aria-labelledby="visita-titulo"
        className="@container grid grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] gap-x-[clamp(0.75rem,3vw,2rem)] gap-y-[clamp(1rem,4vw,1.75rem)] rounded-[clamp(1.25rem,4vw,1.75rem)] bg-canvas p-[clamp(0.625rem,3vw,1rem)] text-ink"
      >
        <div className="col-start-1 row-start-1 flex flex-col gap-[clamp(0.375rem,1.8cqi,0.75rem)] pt-[clamp(1rem,5cqi,2rem)] pl-[clamp(0.625rem,3.5cqi,1.5rem)]">
          <Etiqueta className="text-accent-strong">Te esperamos</Etiqueta>
          <h2
            id="visita-titulo"
            className="font-display text-[clamp(2rem,9.6cqi,3.75rem)] leading-none font-extrabold tracking-[-0.035em]"
          >
            {visita?.dia ?? 'Domingos'}
          </h2>
          <p className="text-[clamp(0.9375rem,3.7cqi,1.1875rem)] leading-snug">
            {domingo
              ? 'Ven y sé parte de nuestros servicios dominicales'
              : 'Ven y sé parte de nuestras reuniones'}
            {hora}.
          </p>
        </div>
        <Foto
          src="predicador-movil.webp"
          sizes="(min-width: 48rem) 44vw, 46vw"
          encuadre="object-[50%_20%]"
          className="col-start-2 row-span-2 row-start-1 min-h-[9rem] rounded-[0.875rem]"
        />
        {horarios && (
          <BotonTarjeta
            href="/reuniones"
            tono="marino"
            icono={<Icon name="calendar" className="size-6" />}
            className="col-start-1 row-start-2 self-end"
          >
            Consulta los horarios
          </BotonTarjeta>
        )}
        {comoLlegar && (
          <BotonTarjeta
            href={comoLlegar}
            externo
            tono="contorno"
            icono={<Icon name="mapPin" className="size-6" />}
            className="z-10 col-start-2 row-start-2 self-end"
          >
            Cómo llegar
          </BotonTarjeta>
        )}
      </section>
    </div>
  );
}
