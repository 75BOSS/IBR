import Image from 'next/image';
import Link from 'next/link';
import { toneVar } from '@/lib/css-vars';

export type Etiqueta = {
  texto: string;
  detalle?: string | null;
  href?: string;
  /** Color propio (ej. el del ministerio); sin él, el azul de la marca. */
  tono?: string | null;
};

export type PasoVisita = {
  titulo: string;
  texto: string;
  foto?: { src: string; alt: string };
  etiquetas?: Etiqueta[];
  enlace?: React.ReactNode;
};

/** Pastilla con un dato real (un horario, un ministerio con su edad). */
function Pastilla({ etiqueta }: { etiqueta: Etiqueta }) {
  const contenido = (
    <>
      {etiqueta.tono !== undefined && (
        <span
          aria-hidden="true"
          style={toneVar(etiqueta.tono)}
          className="size-2.5 shrink-0 rounded-full bg-(--tone)"
        />
      )}
      <span className="font-semibold text-ink">{etiqueta.texto}</span>
      {etiqueta.detalle && <span className="text-ink-soft">· {etiqueta.detalle}</span>}
    </>
  );
  const clase = 'inline-flex min-h-9 items-center gap-2 rounded-full bg-sunken px-3.5 text-sm';
  return (
    <li>
      {etiqueta.href ? (
        <Link
          href={etiqueta.href}
          className={`${clase} ring-1 ring-line transition-colors hover:bg-accent-soft`}
        >
          {contenido}
        </Link>
      ) : (
        <span className={clase}>{contenido}</span>
      )}
    </li>
  );
}

/** Alto del aire sobre cada paso: la línea del último termina justo en el centro de su círculo. */
const AIRE = 'pt-[clamp(1.75rem,6cqi,2.75rem)]';

/**
 * Línea de tiempo de «Tu primera visita» (imagen 11): círculos rojos numerados sobre una línea
 * vertical, con el texto y la foto a los lados, alternando. Mide su contenedor: angosto, la línea
 * va a la izquierda y la foto debajo del texto; ancho, la línea al centro. Un paso sin foto se
 * centra bajo su círculo (como «Ven en familia»), y la línea termina en el último círculo.
 */
export function LineaTiempo({ pasos }: { pasos: PasoVisita[] }) {
  return (
    <div className="@container">
      <ol className="mx-auto max-w-[57rem]">
        {pasos.map((paso, i) => {
          const ultimo = i === pasos.length - 1;
          const centrado = !paso.foto;
          // Ancho: el texto a la izquierda en los pasos impares (01, 03…) y a la derecha en los pares.
          const textoIzquierda = i % 2 === 0;
          const columnas = centrado
            ? '@2xl:grid-cols-1 @2xl:justify-items-center @2xl:text-center'
            : '@2xl:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] @2xl:gap-x-[clamp(2rem,6cqi,3.5rem)]';
          const texto = centrado
            ? '@2xl:col-start-1 @2xl:row-start-2 @2xl:mt-4 @2xl:items-center'
            : textoIzquierda
              ? '@2xl:col-start-1 @2xl:row-start-1 @2xl:items-end @2xl:text-right'
              : '@2xl:col-start-3 @2xl:row-start-1';
          return (
            <li
              key={paso.titulo}
              className={`relative grid grid-cols-[3rem_minmax(0,1fr)] gap-x-[clamp(1rem,4cqi,1.5rem)] ${AIRE} ${columnas} before:absolute before:top-0 before:left-6 before:w-0.5 before:-translate-x-1/2 before:bg-(--d-rojo)/75 @2xl:before:left-1/2 ${
                ultimo ? 'before:h-[calc(clamp(1.75rem,6cqi,2.75rem)+1.5rem)]' : 'before:bottom-0'
              }`}
            >
              <span
                aria-hidden="true"
                className={`relative z-10 col-start-1 row-start-1 grid size-12 place-items-center self-start rounded-full bg-(--d-rojo) font-display text-[1.25rem] font-bold text-cream ring-[6px] ring-canvas ${
                  centrado ? '@2xl:col-start-1' : '@2xl:col-start-2 @2xl:mt-3'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div
                className={`col-start-2 row-start-1 flex flex-col items-start gap-2 pt-1.5 ${texto} ${
                  centrado ? '' : '@2xl:pt-4'
                }`}
              >
                <h2 className="font-headline text-[clamp(1.5rem,1.15rem+1.4vw,2rem)] leading-tight font-extrabold tracking-[-0.035em] text-ink">
                  {paso.titulo}
                </h2>
                <p
                  className={`max-w-[24rem] text-[clamp(1rem,0.96rem+0.2vw,1.125rem)] text-ink-soft ${
                    centrado ? '@2xl:max-w-[29rem]' : ''
                  }`}
                >
                  {paso.texto}
                </p>
                {paso.etiquetas && paso.etiquetas.length > 0 && (
                  <ul
                    className={`flex max-w-[26rem] flex-wrap gap-2 pt-1 ${
                      centrado
                        ? '@2xl:max-w-[40rem] @2xl:justify-center'
                        : textoIzquierda
                          ? '@2xl:justify-end'
                          : ''
                    }`}
                  >
                    {paso.etiquetas.map((etiqueta) => (
                      <Pastilla key={etiqueta.href ?? etiqueta.texto} etiqueta={etiqueta} />
                    ))}
                  </ul>
                )}
                {paso.enlace}
              </div>

              {paso.foto && (
                <div
                  className={`relative col-start-2 row-start-2 mt-4 aspect-[12/5] w-full max-w-[28rem] self-start overflow-hidden rounded-xl shadow-card @2xl:row-start-1 @2xl:mt-0 @2xl:max-w-none ${
                    textoIzquierda ? '@2xl:col-start-3' : '@2xl:col-start-1'
                  }`}
                >
                  <Image
                    src={paso.foto.src}
                    alt={paso.foto.alt}
                    fill
                    sizes="(min-width: 64rem) 25rem, 85vw"
                    className="object-cover"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
