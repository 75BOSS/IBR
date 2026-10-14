import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Devocional, Serie } from '@/disenos/contenido';
import { Icon, type IconName } from '@/components/Icon';
import { youTubeThumbnail, youTubeWatchUrl } from '@/lib/youtube';
import { Etiqueta } from './Etiqueta';

export type VideoCalida = { videoId: string; titulo: string; serie: string | null; meta: string };

/** A Prédicas si esa página tiene contenido; si no, al video en YouTube (pestaña nueva). */
function EnlaceVideo({
  videoId,
  verPredicas,
  className,
  children,
}: {
  videoId: string;
  verPredicas: boolean;
  className: string;
  children: ReactNode;
}) {
  if (verPredicas) {
    return (
      <Link href="/predicas" className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={youTubeWatchUrl(videoId)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      <span className="sr-only"> (abre YouTube en una pestaña nueva)</span>
    </a>
  );
}

/** Miniatura de YouTube con zoom lento y el botón ▶ (magnético) encima. */
function Miniatura({
  videoId,
  sizes,
  grande,
  className = '',
}: {
  videoId: string;
  sizes: string;
  grande: boolean;
  className?: string;
}) {
  return (
    <span className={`relative block overflow-clip bg-(--d-noche) ${className}`}>
      <Image
        src={youTubeThumbnail(videoId)}
        alt=""
        fill
        sizes={sizes}
        className="object-cover transition-[scale] duration-[1600ms] ease-(--ease-out-soft) motion-safe:pointer-fine:group-hover:scale-[1.06]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-(--d-noche)/70 via-transparent to-transparent"
      />
      <span
        aria-hidden="true"
        className={`calida-magnetico absolute grid place-items-center rounded-full bg-cream text-(--d-noche) shadow-pop transition-colors group-hover:bg-accent group-hover:text-cream ${
          grande ? 'bottom-5 left-5 size-16' : 'bottom-2 left-2 size-9'
        }`}
      >
        <Icon name="play" className={`ml-0.5 fill-current ${grande ? 'size-6' : 'size-3.5'}`} />
      </span>
    </span>
  );
}

/**
 * Prédicas recientes (las del panel o los últimos cultos del canal): la más reciente grande y las
 * siguientes en una lista con miniatura (si es la única, la miniatura y el texto lado a lado). Sin videos, invita al canal de YouTube o a escribirnos.
 */
export function PredicasRecientes({
  videos,
  verPredicas,
  canal,
}: {
  videos: VideoCalida[];
  verPredicas: boolean;
  /** Enlace al canal de YouTube (redes); null si la iglesia no lo cargó. */
  canal: string | null;
}) {
  const [destacado, ...resto] = videos;
  if (!destacado) {
    return (
      <div className="calida-aparece flex flex-col items-start gap-3 rounded-[0.875rem] bg-surface p-[clamp(1.5rem,4vw,2.5rem)] ring-1 ring-line">
        <p className="font-display text-[clamp(1.5rem,1.3rem+0.8vw,2rem)] leading-tight text-ink">
          Muy pronto, las prédicas de cada domingo aquí.
        </p>
        {canal ? (
          <a href={canal} target="_blank" rel="noopener noreferrer" className="link">
            Mientras tanto, míralas en nuestro canal de YouTube
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        ) : (
          <Link href="/contacto#mensaje" className="link">
            Escríbenos y te contamos dónde verlas
          </Link>
        )}
      </div>
    );
  }
  return (
    <div className="@container">
      <div className="grid gap-[clamp(1.5rem,4cqi,2.5rem)] @4xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <EnlaceVideo
          videoId={destacado.videoId}
          verPredicas={verPredicas}
          className={`group calida-aparece flex flex-col gap-4 ${
            resto.length === 0
              ? '@4xl:col-span-2 @4xl:grid @4xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] @4xl:items-center @4xl:gap-[clamp(1.5rem,4cqi,3rem)]'
              : ''
          }`}
        >
          <Miniatura
            videoId={destacado.videoId}
            sizes="(min-width: 80rem) 55vw, 100vw"
            grande
            className="calida-elevar aspect-video rounded-[0.875rem]"
          />
          <span className="flex flex-col gap-1.5">
            {destacado.serie && (
              <span className="text-[0.75rem] font-bold tracking-[0.2em] text-accent-strong uppercase">
                Serie {destacado.serie}
              </span>
            )}
            <span className="font-display text-[clamp(1.625rem,1.2rem+1.6vw,2.5rem)] leading-[1.05] wrap-break-word text-ink transition-colors group-hover:text-accent-strong">
              {destacado.titulo}
            </span>
            {destacado.meta && <span className="text-ink-soft">{destacado.meta}</span>}
            <span className="mt-2 inline-flex items-center gap-2 font-semibold text-accent-strong">
              <span className="calida-trazo calida-trazo-grupo">Mirar la prédica</span>
              <Icon
                name="arrowRight"
                className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
              />
            </span>
          </span>
        </EnlaceVideo>
        {resto.length > 0 && (
          <ul className="calida-escalonado flex flex-col divide-y divide-line border-y border-line">
            {resto.slice(0, 4).map((v) => (
              <li key={v.videoId}>
                <EnlaceVideo
                  videoId={v.videoId}
                  verPredicas={verPredicas}
                  className="group grid grid-cols-[clamp(6.5rem,28cqi,9rem)_minmax(0,1fr)] items-center gap-[clamp(0.875rem,3cqi,1.25rem)] py-4"
                >
                  <Miniatura
                    videoId={v.videoId}
                    sizes="9rem"
                    grande={false}
                    className="aspect-video rounded-[0.625rem]"
                  />
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-display text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] leading-tight wrap-break-word text-ink transition-colors group-hover:text-accent-strong">
                      {v.titulo}
                    </span>
                    {v.meta && <span className="text-sm text-ink-soft">{v.meta}</span>}
                  </span>
                </EnlaceVideo>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/** Tonos de las portadas de serie: azul noche, naranja tostado y durazno (no tres iguales). */
const PORTADAS = [
  { fondo: 'bg-(--d-noche) text-cream on-dark', detalle: 'text-peach', raya: 'bg-peach' },
  { fondo: 'bg-accent-strong text-cream on-dark', detalle: 'text-cream/85', raya: 'bg-cream' },
  { fondo: 'bg-(--d-durazno-fuerte) text-ink', detalle: 'text-accent-strong', raya: 'bg-accent' },
];

/**
 * Series de prédicas como portadas de libro: la primera más alta, las otras dos a su lado. El
 * título grande en serifa, cuántos mensajes y de qué trata; se elevan al pasar el mouse.
 */
export function SeriesPortadas({ series }: { series: Serie[] }) {
  return (
    <div className="@container">
      <ul className="calida-escalonado grid gap-[clamp(0.875rem,2cqi,1.5rem)] @2xl:grid-cols-2 @5xl:grid-cols-3">
        {series.map((s, i) => {
          const tono = PORTADAS[i % PORTADAS.length] ?? PORTADAS[0]!;
          return (
            <li
              key={s.titulo}
              className={`calida-elevar relative isolate flex min-h-[clamp(16rem,40cqi,22rem)] flex-col justify-between gap-6 overflow-clip rounded-[0.875rem] p-[clamp(1.5rem,4cqi,2.25rem)] ${tono.fondo} ${
                i === 0 ? '@2xl:col-span-2 @5xl:col-span-1 @5xl:min-h-[26rem]' : ''
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute -right-6 -bottom-16 -z-10 font-script text-[14rem] leading-none italic opacity-10"
              >
                {String(i + 1)}
              </span>
              <p className={`text-[0.75rem] font-bold tracking-[0.2em] uppercase ${tono.detalle}`}>
                Serie · {s.mensajes} mensajes
              </p>
              <div className="flex flex-col gap-3">
                <span aria-hidden="true" className={`h-0.5 w-12 ${tono.raya}`} />
                <h3 className="font-display text-[clamp(2rem,1.6rem+1.8vw,3rem)] leading-[1.02] wrap-break-word">
                  {s.titulo}
                </h3>
                <p className="max-w-[24rem] text-[clamp(1rem,0.96rem+0.2vw,1.0625rem)] leading-normal opacity-90">
                  {s.texto}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Devocional de la semana: el panel azul noche con la invitación y, a su lado, los cinco días
 * (día, pasaje, título y una frase) como filas que se pintan durazno al pasar el mouse.
 */
export function PlanDevocional({ dias }: { dias: Devocional[] }) {
  return (
    <div className="@container">
      <div className="grid gap-[clamp(1rem,2.5cqi,2rem)] @4xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div
          data-luz=""
          className="calida-aparece calida-luz relative isolate flex flex-col justify-between gap-8 overflow-clip rounded-[0.875rem] bg-(--d-noche) p-[clamp(1.5rem,5cqi,2.75rem)] text-cream on-dark"
        >
          <div className="flex flex-col gap-4">
            <Etiqueta className="text-peach">Lunes a viernes</Etiqueta>
            <p className="font-display text-[clamp(2rem,1.6rem+1.6vw,3rem)] leading-[1.02]">
              Cinco lecturas para empezar <em className="text-peach">cada día</em>
            </p>
            <p className="max-w-[26rem] text-cream/85">
              Unos minutos con la Biblia antes de salir de casa. Lee el pasaje, piensa en la frase y
              conversa con Dios sobre lo que leíste.
            </p>
          </div>
          <p className="font-script text-[clamp(1.375rem,1.2rem+0.8vw,1.875rem)] leading-snug text-peach italic">
            «Lámpara es a mis pies tu palabra.» Salmo 119:105
          </p>
        </div>
        <ol className="calida-escalonado flex flex-col">
          {dias.map((d) => (
            <li
              key={d.dia}
              className="grid grid-cols-[minmax(5.5rem,auto)_minmax(0,1fr)] gap-x-[clamp(0.875rem,3cqi,1.75rem)] gap-y-1 rounded-[0.75rem] border-b border-line px-[clamp(0.5rem,2cqi,1rem)] py-4 transition-colors duration-300 hover:bg-accent-soft"
            >
              <span className="pt-1 text-[0.75rem] font-bold tracking-[0.18em] text-accent-strong uppercase">
                {d.dia}
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-display text-[clamp(1.25rem,1.1rem+0.6vw,1.625rem)] leading-tight text-ink">
                  {d.titulo}
                </span>
                <span className="text-[0.95rem] font-semibold text-ink">{d.pasaje}</span>
                <span className="text-ink-soft">{d.texto}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** Tonos de los canales: cada uno distinto, como fichas de colores. */
const CANALES = [
  'bg-(--d-noche) text-cream on-dark',
  'bg-(--d-durazno-panel) text-ink',
  'bg-surface text-ink ring-1 ring-line',
  'bg-accent-soft text-ink',
];

/** «@usuario» a partir del enlace de la red (último tramo de la ruta). */
function usuario(href: string): string {
  const tramo = new URL(href).pathname.split('/').filter(Boolean).pop() ?? '';
  return tramo.startsWith('@') ? tramo : `@${tramo}`;
}

/** Redes reales de la iglesia (config) como fichas grandes que se elevan al pasar el mouse. */
export function Canales({ redes }: { redes: { label: string; icon: IconName; href: string }[] }) {
  return (
    <ul className="calida-escalonado grid grid-cols-1 gap-[clamp(0.75rem,1.5vw,1.25rem)] md:grid-cols-2 xl:grid-cols-4">
      {redes.map((r, i) => (
        <li key={r.href}>
          <a
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group calida-elevar flex h-full min-h-[clamp(7.5rem,14vw,11rem)] flex-col justify-between gap-6 rounded-[0.875rem] p-[clamp(1.25rem,2.4vw,1.75rem)] ${CANALES[i % CANALES.length]}`}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-current/10">
                <Icon name={r.icon} className="size-6" />
              </span>
              <Icon
                name="arrowUpRight"
                className="size-5 transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1"
              />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="font-display text-[clamp(1.5rem,1.3rem+0.8vw,2rem)] leading-tight">
                {r.label}
              </span>
              <span className="text-[0.95rem] wrap-anywhere opacity-85">{usuario(r.href)}</span>
            </span>
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
