import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Paralaje } from '@/disenos/vibrante/animacion/Paralaje';
import { botonClases } from '@/disenos/vibrante/boton';
import { Foto } from '@/disenos/vibrante/Foto';
import { FOTOS } from '@/disenos/vibrante/fotos';
import { IconoPlayCirculo } from '@/disenos/vibrante/iconos';
import { RUTAS } from '@/disenos/vibrante/menu';

/**
 * Portada (imágenes 4 y 6): bloque rojo con el titular gigante y, a su derecha, el mosaico de
 * fotos de borde a borde. En escritorio: una foto grande y dos apiladas. En celular y tablet: una
 * columna de tres fotos escalonadas, y el titular se monta un poco sobre ellas. El titular entra
 * por líneas al abrir la página y las fotos se desplazan un poco con el cursor.
 */
export function Portada({
  etiqueta,
  subtitulo,
  verPredicas,
}: {
  /** «Iglesia Bíblica Riobamba · desde 2008». */
  etiqueta: string;
  subtitulo: string;
  /** «Ver prédicas» solo si Prédicas tiene contenido. */
  verPredicas: boolean;
}) {
  return (
    <section
      aria-labelledby="portada-titulo"
      data-cursor-claro
      className="bg-accent text-canvas on-dark"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_38%] md:grid-cols-[minmax(0,1fr)_42%] lg:min-h-[clamp(28rem,31.25vw,40rem)] lg:grid-cols-[minmax(0,46fr)_minmax(0,54fr)]">
        <div className="@container relative z-10 col-start-1 row-start-1 flex flex-col justify-center gap-[clamp(1rem,3.6cqi,1.5rem)] py-[clamp(1.75rem,6vw,3rem)] pl-[clamp(1rem,3.9vw,3.75rem)] lg:pr-[clamp(1.5rem,3vw,3rem)]">
          <p className="eyebrow hidden md:inline-flex">{etiqueta}</p>
          <h1
            id="portada-titulo"
            data-entrada="carga"
            className="vibrante-lineas font-display text-[clamp(3.25rem,34cqi,6.5rem)] leading-[0.88] font-black tracking-[-0.04em] [--em-escala:1.02em] lg:text-[19.5cqi] lg:[--em-escala:1.24em]"
          >
            <span className="vibrante-linea lg:whitespace-nowrap">Aquí somos</span>{' '}
            <em className="vibrante-linea -mt-[0.14em] -ml-[0.1em]">familia.</em>
          </h1>
          <p className="max-w-[40ch] pr-3 text-[clamp(1.0625rem,4.6cqi,1.875rem)] leading-snug">
            {subtitulo}
          </p>
          <div className="flex flex-wrap gap-3 pt-[clamp(0.25rem,1.5cqi,0.75rem)] pr-2 md:pr-3">
            <Link
              href={RUTAS.primeraVisita}
              className={botonClases({
                variante: 'crema',
                tamano: 'portada',
              })}
            >
              Planifica tu visita <Icon name="arrowRight" className="size-5" />
            </Link>
            {verPredicas && (
              <Link
                href="/predicas"
                className={botonClases({
                  variante: 'contorno',
                  tamano: 'lg',
                  desdeTablet: true,
                })}
              >
                <IconoPlayCirculo className="size-6" /> Ver prédicas
              </Link>
            )}
          </div>
        </div>

        {/* Fotos separadas por una línea crema, como en la propuesta (borde, no hueco: a la
            izquierda de las fotos escalonadas se ve el rojo). */}
        <Paralaje className="col-start-2 row-start-1 grid grid-rows-[46fr_31fr_23fr] overflow-hidden lg:grid-cols-[minmax(0,28.5fr)_minmax(0,25.5fr)] lg:grid-rows-2">
          <Foto
            foto={FOTOS.adoracion}
            prioridad
            profundidad={1}
            sizes="(min-width: 64rem) 29vw, 42vw"
            className="lg:row-span-2"
          />
          <Foto
            foto={FOTOS.abrazo}
            prioridad
            profundidad={2}
            sizes="(min-width: 64rem) 26vw, 34vw"
            className="ml-[20%] border-t-[3px] border-canvas lg:ml-0 lg:border-t-0 lg:border-l-[3px]"
          />
          <Foto
            foto={FOTOS.guitarra}
            profundidad={3}
            sizes="(min-width: 64rem) 26vw, 40vw"
            className="ml-[7%] border-t-[3px] border-canvas lg:ml-0 lg:border-l-[3px]"
          />
        </Paralaje>
      </div>
    </section>
  );
}
