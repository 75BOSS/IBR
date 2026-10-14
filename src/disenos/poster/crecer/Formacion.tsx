import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { CURSOS } from '@/disenos/contenido';
import { botonPoster } from '../botones';
import { CabeceraSeccion, Lema, Titulo } from '../piezas';

/** «8 semanas» → número y unidad, para escribir el número en grande. */
function partirDuracion(duracion: string): { numero: string; unidad: string } {
  const [numero = '', ...resto] = duracion.split(' ');
  return /^\d+$/.test(numero)
    ? { numero, unidad: resto.join(' ') }
    : { numero: '', unidad: duracion };
}

/**
 * Escuela de Discipulado (#formacion), por módulos como los cursos de ciem.casadedios.org: cada
 * curso es una fila de periódico con su módulo, título, explicación y la duración enorme a la
 * derecha; se invierte al pasar el cursor. Cursos de EJEMPLO (contenido.ts).
 */
export function Formacion() {
  return (
    <section id="formacion" aria-labelledby="formacion-titulo" className="flex flex-col gap-1">
      <CabeceraSeccion
        id="formacion-titulo"
        lema="Paso 04 · Fórmate"
        titulo={
          <>
            Escuela de <em>Discipulado</em>
          </>
        }
      />
      <ol className="@container flex flex-col">
        {CURSOS.map((c, n) => {
          const { numero, unidad } = partirDuracion(c.duracion);
          return (
            <li
              key={c.titulo}
              className="d-invierte d-fila grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-[clamp(1rem,4cqi,3rem)] gap-y-2 border-b-2 border-ink px-[clamp(0.5rem,2cqi,1.5rem)] py-[clamp(1rem,3cqi,1.75rem)] @3xl:grid-cols-[auto_minmax(0,1.1fr)_minmax(0,1.4fr)_auto]"
            >
              <Lema
                as="span"
                tamano="text-[0.75rem]"
                className="col-span-2 text-(--inv-acento) @3xl:col-span-1"
              >
                Módulo {String(n + 1).padStart(2, '0')}
              </Lema>
              <Titulo
                as="h3"
                estilo="condensado"
                className="text-[clamp(1.5rem,7cqi,2.5rem)] @3xl:text-[clamp(1.5rem,3.4cqi,2.5rem)]"
              >
                {c.titulo}
              </Titulo>
              <p className="col-start-1 leading-snug text-(--inv-suave) @3xl:col-start-auto">
                {c.texto}
              </p>
              <span className="col-start-2 row-span-2 row-start-2 flex flex-col items-end text-right @3xl:col-start-auto @3xl:row-span-1 @3xl:row-start-auto">
                {numero && (
                  <span className="font-display text-[clamp(2.75rem,12cqi,5rem)] leading-[0.8] font-black text-(--inv-acento) font-stretch-[75%] tabular-nums @3xl:text-[clamp(2.75rem,6cqi,5rem)]">
                    {numero}
                  </span>
                )}
                <span className="font-display text-[0.8125rem] font-bold tracking-[0.2em] uppercase">
                  {unidad}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-[clamp(1rem,3cqi,1.5rem)]">
        <Link href="/contacto#mensaje" className={botonPoster('rojo')}>
          Quiero inscribirme
          <Icon name="arrowRight" className="d-flecha size-[1.1em]" />
        </Link>
        <p className="text-sm text-ink-soft">Te avisamos cuándo empieza el próximo módulo.</p>
      </div>
    </section>
  );
}
