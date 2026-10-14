import type { ReactNode } from 'react';
import { Contenedor } from './Contenedor';
import { Etiqueta } from './Etiqueta';
import { Foto } from './Foto';
import { IndicePagina } from './IndicePagina';
import { Titulo } from './Titulo';
import { Texto } from './Texto';

/**
 * Cabecera de las páginas interiores (imagen 2, «La vida se comparte.»): etiqueta, titular con
 * la palabra en itálica naranja (`<em>`), una frase y las acciones a la izquierda; a la derecha
 * la foto grande con esquinas redondeadas, paralaje al hacer scroll y profundidad con el mouse.
 * En el celular la foto va debajo del texto. El titular entra al cargar (escalonado). Debajo,
 * opcional, el índice de la página.
 */
export function CabeceraPagina({
  id,
  etiqueta,
  titulo,
  texto,
  acciones,
  foto,
  indice,
}: {
  id: string;
  etiqueta: string;
  titulo: ReactNode;
  texto: ReactNode;
  acciones?: ReactNode;
  foto: { src: string; alt: string; encuadre?: string };
  indice?: { href: string; label: string }[];
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
      <Contenedor className="grid items-center gap-[clamp(1.5rem,3.4vw,3rem)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="flex min-w-0 flex-col items-start gap-[clamp(0.875rem,1.4vw,1.25rem)] xl:pl-[clamp(0rem,6vw,6rem)]">
          <Etiqueta className="calida-entrada text-accent-strong">{etiqueta}</Etiqueta>
          <Titulo como="h1" id={id} tamano="pagina" className="calida-entrada-2 text-ink">
            {titulo}
          </Titulo>
          <Texto className="calida-entrada-3 max-w-[29rem]">{texto}</Texto>
          {acciones && <div className="calida-entrada-3 mt-1 flex flex-wrap gap-3">{acciones}</div>}
        </div>
        <Foto
          src={foto.src}
          alt={foto.alt}
          sizes="(min-width: 64rem) 58vw, 100vw"
          prioridad
          paralaje
          profundidad
          encuadre={foto.encuadre}
          className="relative aspect-[4/3] rounded-[0.875rem] md:aspect-[16/8] lg:aspect-auto lg:min-h-[clamp(20rem,24vw,24rem)] lg:self-stretch"
        />
      </Contenedor>
      {indice && <IndicePagina enlaces={indice} />}
    </section>
  );
}
