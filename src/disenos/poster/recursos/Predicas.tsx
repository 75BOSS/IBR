import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { formatDateOnly, formatDateTime } from '@/lib/dates';
import { youTubeThumbnail, youTubeWatchUrl } from '@/lib/youtube';
import { botonPoster } from '../botones';
import { SigueCursor } from '../movimiento/SigueCursor';
import { CabeceraSeccion, Lema, PestanaNueva, Titulo } from '../piezas';

export type Mensaje = {
  clave: string;
  titulo: string;
  meta: string;
  miniatura: string;
  href: string;
  /** El enlace abre YouTube (otra pestaña). */
  externo: boolean;
};

/** Prédicas del panel o, si no hay, los últimos videos del canal, en la forma que se dibujan. */
export function mensajesDe(
  predicas: {
    id: number;
    titulo: string;
    youtube_id: string;
    miniatura_url: string | null;
    predicador: string | null;
    serie: string | null;
    fecha: string;
  }[],
  videos: { videoId: string; titulo: string; publicado: string }[],
): Mensaje[] {
  if (predicas.length > 0) {
    return predicas.map((p) => ({
      clave: String(p.id),
      titulo: p.titulo,
      meta: [p.predicador, p.serie, formatDateOnly(p.fecha)].filter(Boolean).join(' · '),
      miniatura: p.miniatura_url ?? youTubeThumbnail(p.youtube_id),
      href: '/predicas',
      externo: false,
    }));
  }
  return videos.map((v) => ({
    clave: v.videoId,
    titulo: v.titulo,
    meta: `Publicado el ${formatDateTime(new Date(v.publicado), { dateStyle: 'long' })}`,
    miniatura: youTubeThumbnail(v.videoId),
    href: youTubeWatchUrl(v.videoId),
    externo: true,
  }));
}

/** Atributos de un enlace que puede abrir YouTube en otra pestaña. */
const destino = (m: Mensaje) =>
  m.externo ? { href: m.href, target: '_blank', rel: 'noopener noreferrer' } : { href: m.href };

/**
 * Prédicas (#predicas): el último mensaje en grande (miniatura de YouTube con el botón rojo de
 * play y la insignia «Ver» que sigue al cursor) y los anteriores en filas con miniatura que pasa
 * de gris a color. Cada uno lleva a Prédicas (si están en el panel) o al video en YouTube. Sin
 * mensajes, invita al canal o a escribir.
 */
export function Predicas({
  mensajes,
  todas,
}: {
  mensajes: Mensaje[];
  /** «Todas las prédicas» (página del sitio o canal de YouTube); null = sin enlace. */
  todas: { href: string; texto: string; externo?: boolean } | null;
}) {
  const [ultimo, ...anteriores] = mensajes;
  return (
    <section id="predicas" aria-labelledby="predicas-titulo" className="flex flex-col gap-1">
      <CabeceraSeccion id="predicas-titulo" lema="Cada domingo" titulo="Prédicas" accion={todas} />
      {!ultimo ? (
        <div className="@container relative isolate flex min-h-[clamp(16rem,40vw,24rem)] flex-col justify-end gap-4 overflow-hidden border-2 border-ink bg-(--d-noche) p-[clamp(1.25rem,5cqi,2.5rem)] text-canvas on-dark">
          <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-[55%]">
            <Image
              src="/disenos/poster/predicador.webp"
              alt=""
              fill
              sizes="40vw"
              className="object-cover object-top"
            />
            <span className="absolute inset-0 bg-linear-to-r from-(--d-noche) to-transparent" />
          </div>
          <Titulo
            as="p"
            estilo="grueso"
            className="max-w-[16ch] text-[clamp(1.75rem,7cqi,3.25rem)] text-balance"
          >
            Pronto publicaremos aquí los mensajes de cada domingo.
          </Titulo>
          {todas && (
            <Link
              href={todas.href}
              {...(todas.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={botonPoster('rojo')}
            >
              {todas.texto}
              <Icon name="arrowRight" className="d-flecha size-[1.1em]" />
              {todas.externo && <PestanaNueva />}
            </Link>
          )}
        </div>
      ) : (
        <div
          className={`grid gap-1 ${anteriores.length > 0 ? '@4xl/pagina:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]' : ''}`}
        >
          <Link
            {...destino(ultimo)}
            className={`group @container flex flex-col border-2 border-ink bg-(--d-noche) text-canvas on-dark ${
              anteriores.length > 0 ? '' : '@4xl/pagina:flex-row @4xl/pagina:items-end'
            }`}
          >
            <SigueCursor
              etiqueta="Ver"
              className={`relative aspect-video overflow-hidden ${
                anteriores.length > 0 ? '' : '@4xl/pagina:w-[58%] @4xl/pagina:shrink-0'
              }`}
            >
              <Image
                src={ultimo.miniatura}
                alt=""
                fill
                sizes="(min-width: 64rem) 45vw, 100vw"
                className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"
              />
              <span className="absolute bottom-[clamp(0.75rem,3cqi,1.5rem)] left-[clamp(0.75rem,3cqi,1.5rem)] grid size-[clamp(3.25rem,12cqi,5rem)] place-items-center rounded-full bg-accent motion-safe:transition-transform motion-safe:group-hover:scale-110">
                <Icon name="play" className="size-[42%] translate-x-[8%] fill-current" />
              </span>
            </SigueCursor>
            <span className="flex flex-col gap-2 p-[clamp(1rem,4cqi,2rem)]">
              <Lema as="span" tamano="text-[0.75rem]" className="text-(--d-rojo-claro)">
                Último mensaje
              </Lema>
              <Titulo
                as="h3"
                estilo="grueso"
                className="text-[clamp(1.5rem,6cqi,2.75rem)] text-balance"
              >
                {ultimo.titulo}
              </Titulo>
              <span className="text-sm text-canvas/80">{ultimo.meta}</span>
            </span>
            {ultimo.externo && <PestanaNueva que="abre YouTube en una pestaña nueva" />}
          </Link>
          {anteriores.length > 0 && (
            <ul className="flex flex-col border-2 border-ink">
              {anteriores.map((m) => (
                <li key={m.clave} className="flex grow border-b-2 border-ink last:border-b-0">
                  <Link
                    {...destino(m)}
                    className="group d-fila d-invierte @container flex flex-1 items-center gap-[clamp(0.75rem,4cqi,1.25rem)] p-[clamp(0.625rem,2.5cqi,1rem)]"
                  >
                    <span className="relative aspect-video w-[clamp(6rem,32cqi,10rem)] shrink-0 overflow-hidden border border-(--inv-borde)">
                      <Image
                        src={m.miniatura}
                        alt=""
                        fill
                        sizes="10rem"
                        className="d-foto object-cover"
                      />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="line-clamp-2 font-display text-[clamp(1rem,5cqi,1.25rem)] leading-tight font-extrabold font-stretch-[88%]">
                        {m.titulo}
                      </span>
                      <span className="text-[0.8125rem] text-(--inv-suave)">{m.meta}</span>
                    </span>
                    <Icon
                      name="arrowRight"
                      className="d-flecha size-5 shrink-0 text-(--inv-acento)"
                    />
                    {m.externo && <PestanaNueva que="abre YouTube en una pestaña nueva" />}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
