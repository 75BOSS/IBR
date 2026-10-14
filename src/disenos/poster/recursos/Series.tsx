import Link from 'next/link';
import { SERIES } from '@/disenos/contenido';
import { CabeceraSeccion, Lema, Titulo } from '../piezas';

/** Cada portada con su tinta: azul noche, rojo y durazno (como tres pósters distintos). */
const PORTADAS = [
  'bg-(--d-noche) text-canvas on-dark',
  'bg-accent text-canvas on-dark',
  'bg-(--d-durazno) text-ink',
];

/**
 * Series de prédicas (EJEMPLO) como portadas tipográficas de póster: el título enorme en
 * mayúsculas, cuántos mensajes tiene y de qué trata. Al pasar el cursor la portada se levanta
 * con una sombra recta azul marino. Llevan a Prédicas si esa página tiene contenido.
 */
export function Series({ conPredicas }: { conPredicas: boolean }) {
  return (
    <section aria-labelledby="series-titulo" className="flex flex-col gap-1">
      <CabeceraSeccion
        id="series-titulo"
        lema="Para escuchar en orden"
        titulo={
          <>
            Series de <em>mensajes</em>
          </>
        }
      />
      <ul className="grid gap-[clamp(0.25rem,1vw,0.75rem)] pt-1 @3xl/pagina:grid-cols-3">
        {SERIES.map((s, n) => {
          const contenido = (
            <>
              <span className="flex items-center justify-between gap-3 border-b-2 border-current pb-2">
                <Lema as="span" tamano="text-[0.75rem]">
                  Serie {String(n + 1).padStart(2, '0')}
                </Lema>
                <span className="font-display text-[0.875rem] font-bold">
                  {s.mensajes} mensajes
                </span>
              </span>
              <Titulo
                as="h3"
                estilo="negro"
                className="pt-[0.1em] text-[clamp(2.5rem,17cqi,4.75rem)] text-balance hyphens-auto font-stretch-[72%]"
              >
                {s.titulo}
              </Titulo>
              <span className="leading-snug">{s.texto}</span>
            </>
          );
          const clases = `@container flex min-h-[clamp(16rem,80cqi,24rem)] flex-1 flex-col justify-between gap-6 p-[clamp(1.25rem,7cqi,2rem)] ${PORTADAS[n % PORTADAS.length]}`;
          return (
            <li key={s.titulo} className="@container flex reveal">
              {conPredicas ? (
                <Link
                  href="/predicas"
                  className={`${clases} hover:shadow-[0.5rem_0.5rem_0_var(--color-ink)] motion-safe:transition-[translate,box-shadow] motion-safe:duration-300 motion-safe:hover:-translate-x-1 motion-safe:hover:-translate-y-1`}
                >
                  {contenido}
                </Link>
              ) : (
                <article className={clases}>{contenido}</article>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
