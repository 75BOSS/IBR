import type { ReactNode } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Contenedor } from '@/disenos/vibrante/Contenedor';
import { IconoNavegar } from '@/disenos/vibrante/iconos';

type Dato = {
  clave: string;
  /** Ícono de contorno rojo (tablet y escritorio). */
  icono: ReactNode;
  /** Ícono dentro del círculo rojo (celular). */
  iconoMovil: ReactNode;
  titulo: string;
  detalle: string;
  /** Texto en el celular; sin él, el dato solo aparece desde tablet. */
  movil?: string;
  href?: string;
  externo?: boolean;
};

const COLUMNAS: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
};

/**
 * Franja negra bajo la portada. Tablet y escritorio (imagen 4): tres datos con íconos rojos de
 * contorno. Celular (imagen 6): «Te esperamos» con el día de la reunión en grande y dos accesos
 * con círculos rojos. Todo sale de la BD; sin reuniones ni «Cómo llegar» no hay franja.
 */
export function FranjaVisita({
  principal,
  verHorarios,
  direccion,
  comoLlegar,
}: {
  principal: { dias: string; hora: string } | null;
  verHorarios: boolean;
  direccion: string | null;
  comoLlegar: string | null;
}) {
  if (!principal && !comoLlegar) return null;
  const datos: Dato[] = [];
  if (principal) {
    const cuando = `${principal.dias} · ${principal.hora}`;
    datos.push({
      clave: 'horarios',
      icono: <Icon name="calendar" className="size-9" />,
      iconoMovil: <Icon name="clock" className="size-5" />,
      titulo: cuando,
      detalle: verHorarios ? 'Consulta los horarios' : 'Te esperamos',
      movil: verHorarios ? 'Consulta los horarios' : cuando,
      href: verHorarios ? '/reuniones' : undefined,
    });
  }
  datos.push({
    clave: 'ciudad',
    icono: <Icon name="mapPin" className="size-9" />,
    iconoMovil: null,
    titulo: 'Riobamba',
    detalle: direccion ?? 'Nuestra ciudad, nuestra familia',
  });
  if (comoLlegar) {
    datos.push({
      clave: 'llegar',
      icono: <IconoNavegar className="size-9" />,
      iconoMovil: <Icon name="mapPin" className="size-5" />,
      titulo: 'Cómo llegar',
      detalle: 'Te esperamos con alegría',
      movil: 'Cómo llegar',
      href: comoLlegar,
      externo: true,
    });
  }
  // En el celular, si queda un solo acceso, ocupa toda la fila.
  const unoEnCelular = datos.filter((d) => d.movil).length === 1;

  return (
    <section aria-label="Horarios y cómo llegar" className="bg-(--d-negro) text-canvas on-dark">
      <Contenedor className="flex flex-col gap-4 py-[clamp(1.5rem,6vw,2.25rem)] md:py-0">
        {principal && (
          <div className="flex flex-col gap-1 md:hidden">
            <p className="eyebrow">Te esperamos · {principal.hora}</p>
            <h2 className="font-display text-[clamp(3.5rem,19.5vw,6rem)] leading-[0.95] font-black tracking-[-0.04em]">
              {principal.dias}
            </h2>
          </div>
        )}
        <ul className={`grid grid-cols-2 ${COLUMNAS[datos.length]}`}>
          {datos.map((d, i) => (
            <li
              key={d.clave}
              className={`relative min-h-16 items-center md:flex md:min-h-[clamp(4.75rem,5.3vw,5.25rem)] md:justify-center ${
                d.movil ? 'flex' : 'hidden'
              } ${unoEnCelular && d.movil ? 'col-span-2 md:col-span-1' : ''} ${
                i > 0
                  ? 'pl-3 before:absolute before:top-1/2 before:left-0 before:h-10 before:w-px before:-translate-y-1/2 before:bg-canvas/35 xs:pl-4 md:pl-6'
                  : ''
              }`}
            >
              <DatoFranja dato={d} />
            </li>
          ))}
        </ul>
      </Contenedor>
    </section>
  );
}

function DatoFranja({ dato }: { dato: Dato }) {
  const contenido = (
    <>
      <span className="grid size-[clamp(2rem,8.6vw,2.75rem)] shrink-0 place-items-center rounded-full bg-(--d-rojo-vivo) text-canvas md:size-auto md:rounded-none md:bg-transparent md:text-(--d-rojo-vivo)">
        <span className="md:hidden">{dato.iconoMovil}</span>
        <span className="hidden md:block">{dato.icono}</span>
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="hidden text-[clamp(1.125rem,0.85rem+0.6vw,1.375rem)] leading-tight font-semibold md:block">
          {dato.titulo}
        </span>
        <span className="hidden text-[clamp(0.9375rem,0.85rem+0.2vw,1rem)] text-(--d-crema-tenue) md:block">
          {dato.detalle}
        </span>
        <span className="text-[clamp(0.9375rem,4.3vw,1.25rem)] leading-tight font-semibold md:hidden">
          {dato.movil}
        </span>
      </span>
      {dato.href && <Icon name="chevronRight" className="size-4 shrink-0 xs:size-5 md:hidden" />}
    </>
  );
  const clases = 'flex items-center gap-2 py-2 xs:gap-3 md:gap-4';
  if (!dato.href) return <div className={clases}>{contenido}</div>;
  if (dato.externo) {
    return (
      <a
        href={dato.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${clases} hover:underline`}
      >
        {contenido}
        <span className="sr-only"> (abre Google Maps en una pestaña nueva)</span>
      </a>
    );
  }
  return (
    <Link href={dato.href} className={`${clases} hover:underline`}>
      {contenido}
    </Link>
  );
}
