import { HISTORIA } from '@/disenos/contenido';
import { TitularDesliza } from '../movimiento/TitularDesliza';
import { A_LOS_BORDES } from '../PortadaPagina';
import { CabeceraSeccion, Titulo } from '../piezas';

/**
 * La historia en hitos (contenido de EJEMPLO): los años gigantes corren de lado mientras se
 * hace scroll y, debajo, la línea de tiempo: vertical con puntos en una página angosta y en
 * cinco columnas sobre una raya en una ancha. El último hito (hoy) va en rojo. Cada hito se
 * invierte al pasar el cursor.
 */
export function LineaTiempo() {
  return (
    <section id="linea-de-tiempo" aria-labelledby="linea-titulo" className="flex flex-col gap-1">
      <CabeceraSeccion
        id="linea-titulo"
        lema="Paso a paso"
        titulo={
          <>
            Nuestra <em>historia</em>
          </>
        }
      />
      <TitularDesliza
        className={`${A_LOS_BORDES} py-[clamp(0.5rem,2cqi,1rem)]`}
        hueco
        texto={HISTORIA.map((h) => h.anio).join(' — ')}
      />
      <ol className="grid gap-1 @4xl/pagina:grid-cols-5">
        {HISTORIA.map((h, n) => {
          const hoy = n === HISTORIA.length - 1;
          return (
            <li
              key={h.anio}
              className={`d-invierte @container relative flex flex-col gap-2 border-l-4 pt-1 pb-[clamp(1rem,4cqi,1.5rem)] pl-[clamp(1rem,6cqi,1.5rem)] @4xl/pagina:border-t-4 @4xl/pagina:border-l-0 @4xl/pagina:px-[clamp(0.75rem,6cqi,1.25rem)] @4xl/pagina:pt-[clamp(1rem,7cqi,1.5rem)] ${
                hoy ? 'border-accent' : 'border-ink'
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute top-2 -left-[0.6rem] size-4 rounded-full border-4 border-canvas @4xl/pagina:-top-[0.6rem] @4xl/pagina:left-[clamp(0.75rem,6cqi,1.25rem)] ${
                  hoy ? 'bg-accent' : 'bg-ink'
                }`}
              />
              <span
                className={`font-display text-[clamp(2.75rem,22cqi,4.5rem)] leading-[0.85] font-black tracking-[-0.03em] font-stretch-[75%] ${
                  hoy ? 'text-(--inv-acento)' : ''
                }`}
              >
                {h.anio}
              </span>
              <Titulo as="h3" estilo="condensado" className="text-[clamp(1.25rem,10cqi,1.75rem)]">
                {h.titulo}
              </Titulo>
              <p className="text-[0.9688rem] leading-snug text-(--inv-suave)">{h.texto}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
