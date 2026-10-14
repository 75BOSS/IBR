import Image from 'next/image';
import Link from 'next/link';
import { Icon, type IconName } from '@/components/Icon';
import type { Devocional, Serie } from '@/disenos/contenido';
import { Inclinable } from '@/disenos/vibrante/animacion/Inclinable';
import { FlechaEnlace } from '@/disenos/vibrante/FlechaEnlace';
import { CabeceraSeccion, Seccion } from '@/disenos/vibrante/Seccion';
import { youTubeThumbnail } from '@/lib/youtube';

/** Un mensaje para la lista: prédica del panel o video del canal, ya con su destino. */
export type Mensaje = {
  videoId: string;
  titulo: string;
  meta: string;
  href: string;
  /** El video del canal se abre en YouTube (pestaña nueva). */
  externo: boolean;
};

function EnlaceMensaje({
  mensaje,
  className,
  children,
}: {
  mensaje: Mensaje;
  className: string;
  children: React.ReactNode;
}) {
  if (mensaje.externo) {
    return (
      <a href={mensaje.href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <span className="sr-only"> (se abre en YouTube, en una pestaña nueva)</span>
      </a>
    );
  }
  return (
    <Link href={mensaje.href} className={className}>
      {children}
    </Link>
  );
}

/** Miniatura de YouTube con el botón de play (crece al pasar el mouse). */
function Miniatura({
  videoId,
  sizes,
  grande,
}: {
  videoId: string;
  sizes: string;
  grande: boolean;
}) {
  return (
    <span className="relative block aspect-video overflow-hidden rounded-[0.5rem] bg-(--d-negro)">
      <Image
        src={youTubeThumbnail(videoId)}
        alt=""
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out-soft motion-safe:group-hover:scale-105"
      />
      <span
        aria-hidden="true"
        className={`absolute grid place-items-center rounded-full bg-accent text-canvas transition-transform duration-300 group-hover:scale-110 ${
          grande ? 'bottom-4 left-4 size-16' : 'bottom-2 left-2 size-10'
        }`}
      >
        <Icon
          name="play"
          fill="currentColor"
          className={grande ? 'ml-1 size-7' : 'ml-0.5 size-4'}
        />
      </span>
    </span>
  );
}

/**
 * Últimas prédicas: la más reciente grande (se inclina con el cursor) y las siguientes en una
 * lista con su miniatura. Del panel, o los últimos videos del canal mientras no haya.
 */
export function Predicas({ mensajes, verTodas }: { mensajes: Mensaje[]; verTodas: boolean }) {
  const [principal, ...resto] = mensajes;
  if (!principal) return null;
  return (
    <Seccion id="predicas" tituloId="predicas-titulo">
      <div className="grid gap-[clamp(2rem,5vw,3.5rem)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <CabeceraSeccion
            etiqueta="Prédicas"
            id="predicas-titulo"
            lineas={['Escucha el', <em key="mensaje">mensaje.</em>]}
            texto="Los mensajes de cada domingo, para verlos cuando quieras y compartirlos."
            className="min-w-[min(100%,18rem)] flex-1"
          />
          {verTodas && <FlechaEnlace href="/predicas">Ver todas las prédicas</FlechaEnlace>}
        </div>
        <div
          className={`grid gap-[clamp(1.5rem,3vw,2.5rem)] ${
            resto.length > 0 ? 'lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]' : ''
          }`}
        >
          <Inclinable grados={3} cursor="Play" className="group @container rounded-[0.5rem]">
            {/* Si es el único mensaje, el título va al lado de la miniatura (desde tablet). */}
            <EnlaceMensaje
              mensaje={principal}
              className={`grid gap-4 ${
                resto.length > 0
                  ? ''
                  : '@3xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] @3xl:items-end'
              }`}
            >
              <Miniatura
                videoId={principal.videoId}
                grande
                sizes="(min-width: 64rem) 55vw, 100vw"
              />
              <span className="flex flex-col gap-1">
                <span className="caps text-accent">Último mensaje</span>
                <span className="font-display text-[clamp(1.5rem,5.5cqi,2.75rem)] leading-[1.02] font-black tracking-[-0.03em] text-balance [overflow-wrap:anywhere] group-hover:underline">
                  {principal.titulo}
                </span>
                <span className="text-ink-soft">{principal.meta}</span>
              </span>
            </EnlaceMensaje>
          </Inclinable>
          {resto.length > 0 && (
            <ul className="flex flex-col">
              {resto.map((m) => (
                <li
                  key={m.videoId}
                  className="border-t border-line first:border-t-0 lg:first:border-t"
                >
                  <EnlaceMensaje
                    mensaje={m}
                    className="group grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-4 py-3"
                  >
                    <Miniatura
                      videoId={m.videoId}
                      grande={false}
                      sizes="(min-width: 64rem) 15vw, 40vw"
                    />
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="font-display text-[clamp(1rem,0.95rem+0.3vw,1.1875rem)] leading-tight font-black tracking-[-0.02em] [overflow-wrap:anywhere] group-hover:underline">
                        {m.titulo}
                      </span>
                      <span className="text-sm text-ink-soft">{m.meta}</span>
                    </span>
                  </EnlaceMensaje>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Seccion>
  );
}

const PORTADAS = [
  'bg-accent text-canvas on-dark',
  'bg-canvas text-ink',
  'bg-(--d-negro-hondo) text-canvas ring-1 ring-canvas/15',
];

/**
 * Series de prédicas (SERIES, ejemplo) como portadas tipográficas de álbum: cada una con otro
 * fondo, el título enorme y cuántos mensajes tiene. Se inclinan con el cursor.
 */
export function Series({ series, verPredicas }: { series: Serie[]; verPredicas: boolean }) {
  return (
    <Seccion tono="negro" tituloId="series-titulo">
      <div className="grid gap-[clamp(2rem,5vw,3.5rem)]">
        <CabeceraSeccion
          oscuro
          etiqueta="Series"
          id="series-titulo"
          lineas={['Series para', <em key="vivir">vivir la fe.</em>]}
          texto="Temas que recorremos domingo a domingo (series de ejemplo)."
        />
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {series.map((s, i) => (
            <li key={s.titulo} className="flex min-w-0">
              <Inclinable
                cursor={verPredicas ? 'Ver' : null}
                className={`group @container flex aspect-[5/4] min-w-0 flex-1 flex-col justify-between gap-4 rounded-[0.5rem] p-[clamp(1.25rem,8cqi,2.25rem)] md:aspect-square ${
                  PORTADAS[i % PORTADAS.length]
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="caps">Serie</span>
                  <span className="caps">{s.mensajes} mensajes</span>
                </span>
                <span className="flex flex-col gap-3">
                  <h3 className="font-display text-[clamp(2rem,15cqi,4rem)] leading-[0.9] font-black tracking-[-0.05em] text-balance [overflow-wrap:anywhere]">
                    {verPredicas ? (
                      <Link href="/predicas" className="after:absolute after:inset-0">
                        {s.titulo}
                      </Link>
                    ) : (
                      s.titulo
                    )}
                  </h3>
                  <span className="max-w-[34ch] text-[clamp(0.9375rem,5cqi,1.0625rem)] leading-snug">
                    {s.texto}
                  </span>
                </span>
              </Inclinable>
            </li>
          ))}
        </ul>
      </div>
    </Seccion>
  );
}

/** Día de la semana de hoy en Ecuador, con el nombre que usan los devocionales («Lunes»…). */
const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export function diaDeHoy(fecha: string): string {
  return DIAS[new Date(`${fecha}T12:00:00Z`).getUTCDay()] ?? '';
}

/**
 * Plan de lectura de la semana (DEVOCIONALES, ejemplo): una columna por día; la de hoy en rojo
 * con «Hoy». En el celular, una lista.
 */
export function Devocionales({ dias, hoy }: { dias: Devocional[]; hoy: string }) {
  return (
    <Seccion id="devocionales" tituloId="devocionales-titulo">
      <div className="grid gap-[clamp(2rem,5vw,3.5rem)]">
        <CabeceraSeccion
          etiqueta="Devocionales"
          id="devocionales-titulo"
          lineas={['Cinco minutos', <em key="dios">con Dios.</em>]}
          texto="Un pasaje para cada día de la semana: léelo, ora y compártelo con tu grupo."
        />
        <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {dias.map((d) => {
            const esHoy = d.dia === hoy;
            return (
              <li key={d.dia} className="flex">
                <Inclinable
                  cursor={null}
                  className={`@container flex flex-1 flex-col gap-3 rounded-[0.5rem] p-[clamp(1.25rem,8cqi,1.75rem)] ${
                    esHoy ? 'bg-accent text-canvas on-dark' : 'bg-surface ring-1 ring-line'
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className={`caps ${esHoy ? '' : 'text-accent'}`}>{d.dia}</span>
                    {esHoy && (
                      <span className="rounded-full bg-canvas px-2.5 py-0.5 text-sm font-bold text-accent">
                        Hoy
                      </span>
                    )}
                  </span>
                  <span className="font-display text-[clamp(1.5rem,13cqi,2rem)] leading-none font-black tracking-[-0.04em] [overflow-wrap:anywhere]">
                    {d.pasaje}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-bold">{d.titulo}</span>
                    <span className={`leading-snug ${esHoy ? '' : 'text-ink-soft'}`}>
                      {d.texto}
                    </span>
                  </span>
                </Inclinable>
              </li>
            );
          })}
        </ol>
      </div>
    </Seccion>
  );
}

/**
 * Canales (fondo rojo): las redes reales de la config y «Pide oración», en baldosas negras que
 * se inclinan con el cursor.
 */
export function Canales({ redes }: { redes: { label: string; icon: IconName; href: string }[] }) {
  return (
    <Seccion tono="rojo" id="canales" tituloId="canales-titulo">
      <div className="grid gap-[clamp(2rem,5vw,3.5rem)] lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
        <CabeceraSeccion
          oscuro
          etiqueta="Canales"
          id="canales-titulo"
          tamano="columna"
          lineas={['Síguenos', <em key="semana">toda la semana.</em>]}
          texto="Cultos en vivo, avisos y fotos de la familia en nuestras redes."
        />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {redes.map((r) => (
            <li key={r.href} className="flex">
              <Inclinable
                cursor={null}
                className="group @container flex flex-1 flex-col justify-between gap-6 rounded-[0.5rem] bg-(--d-negro-hondo) p-[clamp(1rem,8cqi,1.75rem)] text-canvas transition-colors hover:bg-canvas hover:text-ink"
              >
                <Icon name={r.icon} className="size-[clamp(2rem,18cqi,2.75rem)]" />
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 font-display text-[clamp(1.125rem,11cqi,1.5rem)] font-black tracking-[-0.02em] after:absolute after:inset-0"
                >
                  {r.label}
                  <Icon name="arrowUpRight" className="size-5 shrink-0" />
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </Inclinable>
            </li>
          ))}
          <li className="col-span-2 flex">
            <Inclinable
              cursor={null}
              className="group @container flex flex-1 flex-col justify-between gap-6 rounded-[0.5rem] bg-canvas p-[clamp(1rem,8cqi,1.75rem)] text-ink"
            >
              <Icon name="handHeart" className="size-[clamp(2rem,18cqi,2.75rem)] text-accent" />
              <Link
                href="/oracion"
                className="flex items-center justify-between gap-2 font-display text-[clamp(1.125rem,11cqi,1.5rem)] font-black tracking-[-0.02em] after:absolute after:inset-0"
              >
                Pide oración
                <Icon name="arrowRight" className="size-5 shrink-0" />
              </Link>
            </Inclinable>
          </li>
        </ul>
      </div>
    </Seccion>
  );
}
