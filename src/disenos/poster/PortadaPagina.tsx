import type { ReactNode } from 'react';
import { Desregistro } from './movimiento/Desregistro';
import { Lema, Raya, TituloImpreso } from './piezas';

/**
 * Cabecera de las páginas interiores (como «ENCUENTRA TU LUGAR» de la imagen 14): lema, titular
 * gigante en mayúsculas con su copia «mal registrada» que sigue al cursor y, a la derecha (o
 * debajo, si la página es angosta), una frase gruesa, la raya roja y una entrada corta. El tamaño
 * sale del ancho de la página (`@container/pagina`, cqi): el titular llena el renglón en
 * cualquier pantalla. Las palabras de `titulo` van en renglones (`<span className="block">`).
 */
export function PortadaPagina({
  lema,
  titulo,
  frase,
  entrada,
  corto = false,
  children,
}: {
  lema: string;
  titulo: ReactNode;
  /** Renglones de 6 letras o menos («PASO / A PASO»): en una página angosta, más grande. */
  corto?: boolean;
  frase: ReactNode;
  entrada: ReactNode;
  /** Algo más bajo la entrada (un botón, los datos de la visita). */
  children?: ReactNode;
}) {
  return (
    <Desregistro className="grid gap-x-[3cqi] gap-y-[clamp(1rem,4cqi,1.5rem)] @4xl/pagina:grid-cols-[minmax(0,1fr)_minmax(0,24cqi)] @4xl/pagina:items-start">
      <div className="flex flex-col gap-[clamp(0.5rem,1.5cqi,1rem)]">
        <Lema className="text-accent">{lema}</Lema>
        <TituloImpreso
          estilo="negro"
          className={`pt-[0.08em] font-stretch-[78%] @4xl/pagina:text-[14.2cqi] @4xl/pagina:font-stretch-[72%] ${
            corto ? 'text-[24cqi]' : 'text-[17cqi]'
          }`}
        >
          {titulo}
        </TituloImpreso>
      </div>
      <div className="flex max-w-xl flex-col gap-[clamp(0.75rem,1.6cqi,1.25rem)] @4xl/pagina:pt-[5.4cqi]">
        <p className="font-display text-[clamp(1.25rem,1rem+0.9vw,1.75rem)] leading-[1.1] font-extrabold tracking-[-0.02em] text-balance">
          {frase}
        </p>
        <Raya />
        <p className="text-[clamp(1rem,0.92rem+0.35vw,1.1875rem)] leading-snug">{entrada}</p>
        {children}
      </div>
    </Desregistro>
  );
}

/**
 * Marco de las páginas interiores: el contenedor de página (`@container/pagina`) con los márgenes
 * de la propuesta y el ritmo entre bloques. Un bloque llega a los bordes con `A_LOS_BORDES`.
 */
export function PaginaPoster({ children }: { children: ReactNode }) {
  return (
    <div className="@container/pagina flex flex-col gap-[clamp(2.5rem,7vw,5rem)] px-(--d-margen) pt-[clamp(1.25rem,4vw,2rem)] lg:px-(--d-margen-lg) lg:pt-[clamp(1rem,2vw,1.75rem)]">
      {children}
    </div>
  );
}

/** Bloque que llega a los bordes de la página (bandas de color, marquesinas). */
export const A_LOS_BORDES = '-mx-(--d-margen) lg:-mx-(--d-margen-lg)';
