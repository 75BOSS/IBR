import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { DEVOCIONALES, SERIES, TESTIMONIOS } from '@/disenos/contenido';
import { datosRecursos } from '@/disenos/datos';
import { BandaFoto } from '@/disenos/escenario/BandaFoto';
import { Cabecera } from '@/disenos/escenario/Cabecera';
import { Devocionales } from '@/disenos/escenario/Devocionales';
import { FLECHA, FLECHA_TARJETA, claseBoton } from '@/disenos/escenario/estilos';
import { FlechaEnlace } from '@/disenos/escenario/FlechaEnlace';
import { diaDeHoy } from '@/disenos/escenario/horarios';
import { Testimonios } from '@/disenos/escenario/Testimonios';
import { TituloPagina } from '@/disenos/escenario/TituloPagina';
import { formatDateOnly, formatDateTime } from '@/lib/dates';

export const revalidate = 300;

export const metadata: Metadata = { title: 'D · Escenario · Recursos' };

type Video = { id: string; titulo: string; meta: string };

const miniatura = (id: string) => `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;
const enYoutube = (id: string) => `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;

/** Botón rojo de «reproducir» sobre la miniatura; crece al pasar el cursor por la tarjeta. */
function Reproducir({ grande = false }: { grande?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-0 grid place-items-center bg-(--d-marino)/20 transition-colors group-hover:bg-(--d-marino)/5`}
    >
      <span
        className={`grid place-items-center rounded-full bg-accent text-cream shadow-pop transition-transform duration-300 motion-safe:group-hover:scale-110 ${
          grande ? 'size-[clamp(3.5rem,8vw,5rem)]' : 'size-12'
        }`}
      >
        <Icon name="play" className={grande ? 'size-[45%]' : 'size-5'} />
      </span>
    </span>
  );
}

/** Tarjeta de un video (abre YouTube en una pestaña nueva). */
function TarjetaVideo({ video, grande = false }: { video: Video; grande?: boolean }) {
  return (
    <a
      href={enYoutube(video.id)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group d-tarjeta flex h-full flex-col overflow-hidden rounded-2xl ${
        grande ? 'bg-(--d-marino) text-cream on-dark' : 'bg-surface shadow-card ring-1 ring-line'
      }`}
    >
      <span className="relative block aspect-video overflow-hidden bg-(--d-marino-hondo)">
        <Image
          src={miniatura(video.id)}
          alt=""
          fill
          sizes={grande ? '(min-width: 64rem) 44rem, 100vw' : '(min-width: 64rem) 22rem, 50vw'}
          className="d-zoom object-cover"
        />
        <Reproducir grande={grande} />
      </span>
      <span className="flex flex-1 flex-col gap-1.5 p-[clamp(1rem,3vw,1.5rem)]">
        <span
          className={`font-headline leading-tight font-extrabold tracking-[-0.03em] ${
            grande ? 'text-[clamp(1.375rem,1.1rem+1.2vw,2rem)]' : 'text-[1.125rem] text-ink'
          }`}
        >
          {video.titulo}
        </span>
        {video.meta && (
          <span className={`text-sm ${grande ? 'text-cream/80' : 'text-ink-soft'}`}>
            {video.meta}
          </span>
        )}
        <span className="sr-only"> (abre YouTube en una pestaña nueva)</span>
      </span>
    </a>
  );
}

/** Al canal de YouTube; sin canal, a Prédicas o, si tampoco hay, a escribirnos. */
function AccionCanal({ youtube, hayPredicas }: { youtube: string | null; hayPredicas: boolean }) {
  return youtube ? (
    <a href={youtube} target="_blank" rel="noopener noreferrer" className={claseBoton('rojo')}>
      Ir a nuestro canal
      <Icon name="arrowRight" className={FLECHA} />
      <span className="sr-only"> (abre YouTube en una pestaña nueva)</span>
    </a>
  ) : (
    <Link href={hayPredicas ? '/predicas' : '/contacto#mensaje'} className={claseBoton('rojo')}>
      {hayPredicas ? 'Ver prédicas' : 'Escríbenos'}
      <Icon name="arrowRight" className={FLECHA} />
    </Link>
  );
}

/** Junto a una sola prédica: invitación a ver las demás en el canal. */
function MasEnCanal({ youtube, hayPredicas }: { youtube: string | null; hayPredicas: boolean }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border-t-4 border-(--d-rojo) bg-sunken">
      <div className="relative min-h-[10rem] flex-1">
        <Image
          src="/disenos/escenario/escenario-luces.webp"
          alt=""
          fill
          sizes="(min-width: 64rem) 28rem, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col items-start gap-3 p-[clamp(1.25rem,4cqi,2rem)]">
        <p className="caps text-accent">Cada domingo</p>
        <h3 className="font-headline text-[clamp(1.5rem,1.2rem+1.4cqi,2.125rem)] leading-tight font-extrabold tracking-[-0.04em] text-ink">
          ¿Te perdiste <em className="font-semibold italic">un domingo?</em>
        </h3>
        <p className="max-w-[26rem] text-ink-soft">
          Los cultos y las prédicas completas quedan en video para que los veas cuando quieras.
        </p>
        <div className="pt-1">
          <AccionCanal youtube={youtube} hayPredicas={hayPredicas} />
        </div>
      </div>
    </div>
  );
}

/**
 * Sin prédicas cargadas ni videos del canal (el feed de YouTube no respondió): una invitación con
 * la foto del escenario que lleva al canal, a Prédicas o, sin ninguno, a escribirnos.
 */
function SinVideos({ youtube, hayPredicas }: { youtube: string | null; hayPredicas: boolean }) {
  const accion = <AccionCanal youtube={youtube} hayPredicas={hayPredicas} />;
  return (
    <div className="@container">
      <div className="grid overflow-hidden rounded-[1.75rem] bg-(--d-marino) text-cream on-dark @3xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="relative aspect-video @3xl:aspect-auto @3xl:min-h-[18rem]">
          <Image
            src="/disenos/escenario/escenario-luces.webp"
            alt=""
            fill
            sizes="(min-width: 64rem) 40rem, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-3 p-[clamp(1.5rem,5cqi,3rem)]">
          <p className="caps text-peach">Cada domingo</p>
          <h3 className="font-headline text-[clamp(1.5rem,1.2rem+1.6cqi,2.25rem)] leading-tight font-extrabold tracking-[-0.04em]">
            Cultos y prédicas <em className="font-semibold italic">completos.</em>
          </h3>
          <p className="max-w-[28rem] text-cream/85">
            Si no pudiste venir o quieres volver a escuchar el mensaje, míralo cuando quieras.
          </p>
          <div className="pt-2">{accion}</div>
        </div>
      </div>
    </div>
  );
}

const SERIE_TONO = [
  'bg-(--d-marino) text-cream on-dark',
  'bg-accent text-cream on-dark',
  'bg-surface text-ink ring-1 ring-line',
] as const;

/**
 * Recursos de la propuesta D · Escenario: prédicas (las del panel o los últimos videos del
 * canal), series, el plan de lectura de la semana, testimonios y los canales de la iglesia.
 */
export default async function RecursosEscenario() {
  const { content, predicas, videos, redes } = await datosRecursos();
  const lista: Video[] =
    predicas.length > 0
      ? predicas.map((p) => ({
          id: p.youtube_id,
          titulo: p.titulo,
          meta: [p.predicador, formatDateOnly(p.fecha)].filter(Boolean).join(' · '),
        }))
      : videos.map((v) => ({
          id: v.videoId,
          titulo: v.titulo,
          meta: `Publicado el ${formatDateTime(new Date(v.publicado), { dateStyle: 'long' })}`,
        }));
  const [destacado, ...otros] = lista;
  const youtube = redes.find((r) => r.icon === 'youtube');

  return (
    <>
      <TituloPagina
        id="recursos"
        etiqueta="Recursos"
        antes="Para tu"
        destacado="semana."
        texto="Prédicas, devocionales y testimonios para seguir creciendo de lunes a sábado, en casa, en el bus o con tu grupo."
      />

      <section
        aria-labelledby="predicas-titulo"
        id="predicas"
        className="container-page flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)] pt-[clamp(2.5rem,6vw,4rem)] pb-[clamp(3rem,7vw,5rem)]"
      >
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <Cabecera
            id="predicas-titulo"
            etiqueta="Prédicas"
            titulo={
              <>
                La Palabra, <em className="font-semibold italic">cada domingo.</em>
              </>
            }
          />
          {content.predicas && <FlechaEnlace href="/predicas">Ver todas las prédicas</FlechaEnlace>}
        </div>

        {destacado && otros.length === 0 ? (
          <div className="@container">
            <div className="grid gap-[clamp(0.875rem,2cqi,1.25rem)] @3xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <TarjetaVideo video={destacado} grande />
              <MasEnCanal youtube={youtube?.href ?? null} hayPredicas={content.predicas} />
            </div>
          </div>
        ) : destacado ? (
          <div className="@container">
            <ul className="grid gap-[clamp(0.875rem,2cqi,1.25rem)] @3xl:grid-cols-2 @5xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
              <li className="@3xl:col-span-2 @5xl:col-span-1 @5xl:row-span-2">
                <TarjetaVideo video={destacado} grande />
              </li>
              {otros.slice(0, 4).map((v) => (
                <li key={v.id}>
                  <TarjetaVideo video={v} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <SinVideos youtube={youtube?.href ?? null} hayPredicas={content.predicas} />
        )}

        <div className="flex flex-col gap-4 pt-[clamp(1rem,3vw,2rem)]">
          <h3 className="font-headline text-[clamp(1.5rem,1.2rem+1.3vw,2.125rem)] leading-tight font-extrabold tracking-[-0.04em] text-ink">
            Series <em className="font-semibold italic">para recorrer.</em>
          </h3>
          <div className="@container">
            <ul className="grid gap-[clamp(0.875rem,2cqi,1.25rem)] @2xl:grid-cols-3">
              {SERIES.map((s, i) => (
                <li
                  key={s.titulo}
                  className={`d-tarjeta flex min-h-[clamp(13rem,30cqi,17rem)] flex-col justify-between gap-6 rounded-[1.5rem] p-[clamp(1.25rem,4cqi,1.75rem)] ${SERIE_TONO[i % SERIE_TONO.length]}`}
                >
                  <p className="flex items-center justify-between gap-3">
                    <span className="caps">Serie</span>
                    <span className="rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-current/40">
                      {s.mensajes} mensajes
                    </span>
                  </p>
                  <span className="flex flex-col gap-2">
                    <span className="font-headline text-[clamp(1.75rem,1.4rem+1.5cqi,2.375rem)] leading-[1.02] font-extrabold tracking-[-0.045em]">
                      {s.titulo}
                    </span>
                    <span>{s.texto}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="devocionales-titulo"
        id="devocionales"
        className="bg-sunken py-[clamp(3rem,7vw,5rem)]"
      >
        <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)]">
          <Cabecera
            id="devocionales-titulo"
            etiqueta="Devocionales"
            titulo={
              <>
                Plan de <em className="font-semibold italic">la semana.</em>
              </>
            }
            texto="Una lectura corta para cada día, de lunes a viernes. Léela por la mañana y compártela con tu grupo."
          />
          <Devocionales devocionales={DEVOCIONALES} hoy={diaDeHoy()} />
        </div>
      </section>

      <section
        aria-labelledby="testimonios-titulo"
        id="testimonios"
        className="container-page flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)] py-[clamp(3rem,7vw,5rem)]"
      >
        <Cabecera
          id="testimonios-titulo"
          etiqueta="Testimonios"
          titulo={
            <>
              Vidas <em className="font-semibold italic">cambiadas.</em>
            </>
          }
          texto="Historias de hermanos de distintos barrios de Riobamba (testimonios de ejemplo)."
        />
        <Testimonios testimonios={TESTIMONIOS} />
      </section>

      {redes.length > 0 && (
        <section
          aria-labelledby="canales-titulo"
          className="container-page flex flex-col gap-[clamp(1.25rem,3vw,2rem)] pb-[clamp(3rem,7vw,5rem)]"
        >
          <Cabecera
            id="canales-titulo"
            etiqueta="Canales"
            titulo={
              <>
                Síguenos <em className="font-semibold italic">en las redes.</em>
              </>
            }
          />
          <div className="@container">
            <ul className="grid gap-[clamp(0.75rem,2cqi,1rem)] @md:grid-cols-2 @4xl:grid-cols-4">
              {redes.map((r) => (
                <li key={r.href}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-tarjeta flex min-h-20 items-center gap-4 rounded-2xl bg-surface p-4 ring-1 ring-line"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-(--d-marino) text-cream">
                      <Icon name={r.icon} className="size-6" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="font-display text-[1.125rem] font-bold text-ink">
                        {r.label}
                      </span>
                      <span className="text-sm text-ink-soft">
                        {r.icon === 'youtube' ? 'Cultos y prédicas' : 'Síguenos'}
                      </span>
                    </span>
                    <Icon name="arrowRight" className={FLECHA_TARJETA} />
                    <span className="sr-only"> (abre en una pestaña nueva)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <BandaFoto
        id="oracion"
        titulo={
          <>
            ¿Podemos orar <em className="font-semibold italic">por ti?</em>
          </>
        }
        texto="Cuéntanos tu petición. Los pastores y el equipo de intercesión oran por cada una."
      >
        <Link href="/oracion" className={claseBoton('rojo')}>
          Pedir oración
          <Icon name="arrowRight" className={FLECHA} />
        </Link>
      </BandaFoto>
    </>
  );
}
