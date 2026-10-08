import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { buttonClasses } from '@/components/button-styles';
import { EmphasizeLast } from '@/components/Emphasis';
import { Icon, type IconName } from '@/components/Icon';
import { MapEmbed } from '@/components/MapEmbed';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { Carousel } from '@/components/site/Carousel';
import { EventCard } from '@/components/site/EventCard';
import { HeroArt } from '@/components/site/HeroArt';
import { LiveBanner } from '@/components/site/LiveBanner';
import { Marquee } from '@/components/site/Marquee';
import { MinisterioCard, ministerioSpan } from '@/components/site/MinisterioCard';
import { SectionHeading } from '@/components/site/SectionHeading';
import { CONFIG_DEFAULTS, getSiteConfig } from '@/lib/config';
import { DAY_NAMES, formatDateOnly, formatDateTime, formatTime } from '@/lib/dates';
import { listPastores } from '@/lib/equipo';
import { listUpcomingEventos } from '@/lib/eventos';
import { listMinisterios } from '@/lib/ministerios';
import { listPredicas } from '@/lib/predicas';
import { listReuniones } from '@/lib/reuniones';
import { directionsUrl } from '@/lib/maps';
import { type SiteContent, socialLinks } from '@/lib/nav';
import { pageMetadata } from '@/lib/seo';
import { getSiteContent } from '@/lib/site-content';
import { latestChannelVideos } from '@/lib/youtube-api';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return pageMetadata({
    title: config.nombre_iglesia ?? CONFIG_DEFAULTS.nombre_iglesia,
    absoluteTitle: true,
    description:
      config.home_hero_sub ??
      'Una iglesia en Riobamba donde se enseña la Biblia y se vive en comunidad. Conoce nuestros horarios, grupos y prédicas.',
    path: '/',
    image: config.home_hero_imagen,
  });
}

/** Accesos rápidos: cada uno con su color; el primero ocupa el doble (bento, no grilla igual). */
type Access = {
  href: string;
  icon: IconName;
  title: string;
  text: string;
  tone: string;
  /** Solo se muestra si su destino tiene contenido. */
  needs?: keyof SiteContent;
};

const ACCESSES: Access[] = [
  {
    href: '/reuniones',
    icon: 'clock',
    title: 'Horarios',
    text: 'Días, horas y cómo llegar.',
    tone: 'bg-brand-strong text-surface on-dark',
    needs: 'horarios',
  },
  {
    href: '/grupos',
    icon: 'users',
    title: 'Grupos',
    text: 'Un grupo en casa cerca de ti.',
    tone: 'bg-electric-soft text-ink',
    needs: 'grupos',
  },
  {
    href: '/oracion',
    icon: 'handHeart',
    title: 'Pedir oración',
    text: 'Los pastores oran por ti.',
    tone: 'bg-electric text-surface on-dark',
  },
  {
    href: '/predicas',
    icon: 'play',
    title: 'Prédicas',
    text: 'Los mensajes de cada domingo.',
    tone: 'bg-night text-surface on-dark',
    needs: 'predicas',
  },
];

/**
 * Lugar de cada acceso en la grilla (2 columnas en celular, 2×2 junto a «Soy nuevo» en
 * escritorio): si faltan accesos porque su destino aún no tiene contenido, los que quedan se
 * estiran y no quedan huecos.
 */
function accessSpan(index: number, total: number): string {
  if (total === 1) return 'xs:col-span-2 lg:col-span-2 lg:row-span-2';
  if (total === 2) return 'lg:col-span-2';
  if (total === 3 && index === 2) return 'xs:col-span-2 lg:col-span-2';
  return '';
}

function AccessTile({ access, className }: { access: Access; className: string }) {
  return (
    <li className={`reveal ${className}`}>
      <Link
        href={access.href}
        className={`group flex h-full min-h-[clamp(8.5rem,16vw,10.5rem)] flex-col justify-between gap-6 rounded-[1.75rem] p-[clamp(1.125rem,2.5vw,1.75rem)] transition duration-300 ease-(--ease-out-soft) hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0 ${access.tone}`}
      >
        <span className="flex items-start justify-between gap-3">
          <Icon name={access.icon} className="size-7 opacity-80" />
          <span className="grid size-10 place-items-center rounded-full ring-1 ring-current/30 transition group-hover:rotate-45">
            <Icon name="arrowUpRight" className="size-4" />
          </span>
        </span>
        <span className="flex flex-col gap-1">
          <span className="font-headline text-[clamp(1.375rem,1.1rem+1vw,1.875rem)] leading-none">
            {access.title}
          </span>
          <span className="text-[0.95rem]">{access.text}</span>
        </span>
      </Link>
    </li>
  );
}

export default async function HomePage() {
  const [config, content, reuniones, eventos, predicas, pastores, ministerios] = await Promise.all([
    getSiteConfig(),
    getSiteContent(),
    listReuniones({ soloActivas: true }),
    listUpcomingEventos(8),
    listPredicas({ soloPublicadas: true, limit: 2 }),
    listPastores(),
    listMinisterios({ soloActivos: true, conContenido: true }),
  ]);
  // Última prédica: la del panel o, si aún no hay, el último culto del canal de YouTube.
  const [predica] = predicas;
  const [ultimoVideo] =
    predica || !config.youtube_channel_id
      ? []
      : await latestChannelVideos(config.youtube_channel_id);
  const sermon = predica
    ? {
        videoId: predica.youtube_id,
        titulo: predica.titulo,
        meta: [predica.predicador, predica.pasaje, formatDateOnly(predica.fecha)]
          .filter(Boolean)
          .join(' · '),
        serie: predica.serie,
      }
    : ultimoVideo
      ? {
          videoId: ultimoVideo.videoId,
          titulo: ultimoVideo.titulo,
          meta: `Publicado el ${formatDateTime(new Date(ultimoVideo.publicado), { dateStyle: 'long' })}`,
          serie: null,
        }
      : null;
  // «Más prédicas» solo si hay más que la que ya se ve aquí (otra prédica o los videos del canal).
  const morePredicas = predicas.length > 1 || (!predica && Boolean(ultimoVideo));
  const accesses = ACCESSES.filter((a) => !a.needs || content[a.needs]);
  const directions = directionsUrl(config.maps_url, config.direccion);
  const channels: { href: string; label: string; icon: IconName }[] = [
    ...(config.whatsapp_canal_url
      ? [{ href: config.whatsapp_canal_url, label: 'Canal de WhatsApp', icon: 'whatsapp' as const }]
      : []),
    ...socialLinks(config),
  ];
  // Hay reuniones a la misma hora para distintas edades: se muestra cada día y hora una vez.
  const horarios = [
    ...new Set(reuniones.map((r) => `${DAY_NAMES[r.dia_semana]} ${formatTime(r.hora_inicio)}`)),
  ].slice(0, 2);
  const title = config.home_hero_titulo ?? CONFIG_DEFAULTS.home_hero_titulo;
  const closingImage = config.nosotros_imagen ?? config.home_hero_imagen;

  return (
    <>
      {/* Portada: titular grande y, debajo, el marco con video, foto o la ilustración. */}
      <section aria-labelledby="bienvenida" className="container-page pt-[clamp(2rem,6vw,4.5rem)]">
        <div className="grid gap-[clamp(1.25rem,3vw,2.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end">
          <div className="flex flex-col gap-[clamp(1rem,2.5vw,1.75rem)]">
            <p className="eyebrow text-accent-strong">
              {config.nombre_iglesia}
              {config.anio_fundacion ? ` · desde ${config.anio_fundacion}` : ''}
            </p>
            <h1 id="bienvenida" className="font-headline text-hero text-brand-strong">
              <EmphasizeLast text={title} />
            </h1>
          </div>
          {config.home_hero_sub && (
            <p className="max-w-md text-lead text-ink-soft lg:pb-3">{config.home_hero_sub}</p>
          )}
        </div>

        <div className="relative isolate mt-[clamp(1.5rem,4vw,3rem)] flex min-h-[clamp(22rem,45vw,34rem)] flex-col justify-end overflow-hidden rounded-(--radius-frame) bg-brand-strong text-surface on-dark">
          {config.home_hero_imagen ? (
            <Image
              src={config.home_hero_imagen}
              alt=""
              fill
              priority
              sizes="(min-width: 1216px) 1216px, 100vw"
              className="-z-30 object-cover motion-safe:animate-slow-zoom"
            />
          ) : (
            <HeroArt className="absolute inset-0 -z-30 size-full" />
          )}
          {config.home_hero_video && (
            <video
              src={config.home_hero_video}
              poster={config.home_hero_imagen ?? undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="absolute inset-0 -z-20 size-full object-cover motion-reduce:hidden"
            />
          )}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night/90 via-night/40 to-transparent" />
          <div className="flex flex-col gap-5 p-[clamp(1.25rem,4vw,3rem)] md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-2">
              <p className="eyebrow text-peach">Te esperamos</p>
              <p className="flex flex-wrap gap-x-4 font-headline text-[clamp(1.375rem,1.1rem+1vw,2rem)] leading-tight">
                {horarios.length > 0
                  ? horarios.map((h) => (
                      <span key={h} className="whitespace-nowrap">
                        {h}
                      </span>
                    ))
                  : 'Cada domingo'}
              </p>
              {config.direccion && <p className="max-w-md text-surface/85">{config.direccion}</p>}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/soy-nuevo"
                className={buttonClasses({
                  variant: 'accent',
                  size: 'lg',
                  shape: 'pill',
                })}
              >
                Es mi primera vez
              </Link>
              {content.horarios ? (
                <Link
                  href="/reuniones"
                  className={buttonClasses({
                    variant: 'inverseOutline',
                    size: 'lg',
                    shape: 'pill',
                    className: 'backdrop-blur-sm',
                  })}
                >
                  Horarios y cómo llegar
                </Link>
              ) : (
                directions && (
                  <a
                    href={directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClasses({
                      variant: 'inverseOutline',
                      size: 'lg',
                      shape: 'pill',
                      className: 'backdrop-blur-sm',
                    })}
                  >
                    Cómo llegar
                    <span className="sr-only"> (abre Google Maps en una pestaña nueva)</span>
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-page flex flex-col gap-[clamp(3rem,7vw,5.5rem)] py-[clamp(2.5rem,7vw,5rem)]">
        <LiveBanner />

        {/* Accesos rápidos: «Soy nuevo» grande y cuatro de colores. */}
        <nav aria-label="Accesos rápidos">
          <ul className="grid gap-3 xs:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            <li className="reveal xs:col-span-2 lg:row-span-2">
              <Link
                href="/soy-nuevo"
                className="group relative isolate flex h-full min-h-[clamp(14rem,32vw,20rem)] flex-col justify-between gap-6 overflow-hidden rounded-[1.75rem] bg-peach p-[clamp(1.5rem,3.5vw,2.5rem)] text-ink transition duration-300 ease-(--ease-out-soft) hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute -right-16 -bottom-24 -z-10 size-80 rounded-full bg-accent-soft/70 transition-transform duration-700 ease-(--ease-out-soft) motion-safe:group-hover:scale-110"
                />
                <span className="eyebrow text-accent-strong">Soy nuevo</span>
                <span className="flex flex-col gap-4">
                  <span className="font-headline text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] leading-[0.98]">
                    ¿Es tu <em>primera vez</em>?
                  </span>
                  <span className="max-w-md text-lead text-ink/85">
                    Qué esperar el domingo, dónde dejar a los niños y cómo conectar con la familia.
                  </span>
                  <span className="inline-flex items-center gap-2 font-semibold">
                    Empieza aquí
                    <Icon
                      name="arrowRight"
                      className="size-5 transition-transform motion-safe:group-hover:translate-x-1"
                    />
                  </span>
                </span>
              </Link>
            </li>
            {accesses.map((access, i) => (
              <AccessTile
                key={access.href}
                access={access}
                className={accessSpan(i, accesses.length)}
              />
            ))}
          </ul>
        </nav>

        {/* Declaración: quiénes somos en una frase. */}
        <section
          aria-labelledby="somos"
          className="flex reveal flex-col items-center gap-8 text-center"
        >
          <p className="eyebrow text-accent-strong">Quiénes somos</p>
          <h2
            id="somos"
            className="max-w-4xl font-headline text-[clamp(1.5rem,1.1rem+1.8vw,2.625rem)] leading-[1.15] text-ink"
          >
            {config.nosotros_mision ?? (
              <>
                Una iglesia donde se enseña la Biblia y se vive en familia. Nos encantaría que este
                también sea <em>tu hogar</em>.
              </>
            )}
          </h2>
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 font-semibold text-brand-strong">
            {[
              { href: '/nosotros', label: 'Conócenos', show: true },
              { href: '/nosotros#equipo', label: 'Nuestros pastores', show: content.pastores },
              { href: '/nosotros#creencias', label: 'En qué creemos', show: content.creencias },
            ]
              .filter((l) => l.show)
              .map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-2 border-b-2 border-accent pb-1"
                  >
                    {l.label}
                    <Icon
                      name="arrowRight"
                      className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
          </ul>
        </section>

        {eventos.length > 0 && (
          <Carousel
            label="Próximos eventos"
            itemClassName="w-[min(82vw,25rem)]"
            heading={
              <SectionHeading
                id="proximos-eventos"
                eyebrow="Agenda"
                title={
                  <>
                    Lo que <em>viene</em>
                  </>
                }
                link={{ href: '/eventos', label: 'Ver todos' }}
              />
            }
          >
            {eventos.map((e) => (
              <EventCard key={e.id} event={e} variant="tile" />
            ))}
          </Carousel>
        )}
      </div>

      {config.vision && <Marquee text={config.vision} />}

      {/* Sin ministerios con contenido no queda una franja vacía entre la frase y la prédica. */}
      {ministerios.length > 0 && (
        <div className="container-page py-[clamp(2.5rem,7vw,5rem)]">
          <section
            aria-labelledby="ministerios"
            className="flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)]"
          >
            <SectionHeading
              id="ministerios"
              eyebrow="Ministerios"
              title={
                <>
                  Un lugar para <em>cada edad</em>
                </>
              }
              link={{ href: '/ministerios', label: 'Todos los ministerios' }}
            />
            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-6">
              {ministerios.map((m, i) => (
                <li key={m.id} className={`reveal ${ministerioSpan(i, ministerios.length)}`}>
                  <MinisterioCard
                    ministerio={m}
                    featured={i < 2}
                    sizes={
                      i < 2 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 33vw, 50vw'
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {sermon && (
        <section aria-labelledby="ultima-predica" className="bg-night text-surface on-dark">
          <div className="container-page grid items-center gap-[clamp(1.5rem,4vw,3.5rem)] py-[clamp(3rem,8vw,6rem)] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="reveal overflow-hidden rounded-(--radius-frame)">
              <YouTubeEmbed videoId={sermon.videoId} title={sermon.titulo} />
            </div>
            <div className="flex flex-col gap-4">
              <p className="eyebrow text-peach">{predica ? 'Última prédica' : 'Último culto'}</p>
              <h2 id="ultima-predica" className="font-headline text-section">
                {sermon.titulo}
              </h2>
              {sermon.meta && <p className="text-lead text-surface/80">{sermon.meta}</p>}
              {sermon.serie && (
                <p className="text-surface/70">
                  Serie{' '}
                  <span className="font-script text-[1.6em] leading-none text-peach">
                    {sermon.serie}
                  </span>
                </p>
              )}
              <div className="flex flex-wrap gap-3 pt-2">
                {morePredicas && (
                  <Link
                    href="/predicas"
                    className={buttonClasses({ variant: 'accent', shape: 'pill' })}
                  >
                    Más prédicas
                  </Link>
                )}
                {config.youtube && (
                  <a
                    href={config.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClasses({
                      variant: 'inverseOutline',
                      shape: 'pill',
                    })}
                  >
                    <Icon name="youtube" className="size-5" /> Canal de YouTube
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container-page flex flex-col gap-[clamp(3rem,7vw,5.5rem)] py-[clamp(3rem,8vw,6rem)]">
        {pastores.length > 0 && (
          <section
            aria-labelledby="pastores"
            className="flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)]"
          >
            <SectionHeading
              id="pastores"
              eyebrow="Quienes nos cuidan"
              title={
                <>
                  Nuestros <em>pastores</em>
                </>
              }
              link={{ href: '/nosotros#equipo', label: 'Conoce al equipo' }}
            />
            <ul className="grid gap-[clamp(1rem,3vw,2rem)] lg:grid-cols-2">
              {pastores.map((p) => (
                <li
                  key={p.id}
                  className="flex reveal flex-col gap-5 rounded-(--radius-frame) bg-surface p-[clamp(1.25rem,3vw,2rem)] ring-1 ring-line/70 xs:flex-row xs:items-center"
                >
                  <span className="relative size-[clamp(5rem,14vw,7rem)] shrink-0 overflow-hidden rounded-full bg-electric-soft">
                    {p.foto_url ? (
                      <Image src={p.foto_url} alt="" fill sizes="136px" className="object-cover" />
                    ) : (
                      <span className="grid size-full place-items-center font-script text-[clamp(3rem,2.4rem+2.4vw,4.25rem)] text-electric-strong">
                        {p.nombre.replace(/^(Pastora?|Ps\.)\s+/i, '').charAt(0)}
                      </span>
                    )}
                  </span>
                  <span className="flex min-w-0 flex-col gap-1.5">
                    <span className="eyebrow text-accent-strong">{p.rol}</span>
                    <span className="font-headline text-h2 text-ink">{p.nombre}</span>
                    {p.bio && <span className="line-clamp-3 text-ink-soft">{p.bio}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Cierre: invitación grande y dos formas de seguir conectado. */}
        <section aria-labelledby="ser-parte" className="flex flex-col gap-3">
          <div className="relative isolate flex min-h-[clamp(18rem,36vw,24rem)] reveal flex-col justify-end overflow-hidden rounded-(--radius-frame) bg-brand-strong text-surface on-dark">
            {closingImage ? (
              <Image
                src={closingImage}
                alt=""
                fill
                sizes="(min-width: 1216px) 1216px, 100vw"
                className="-z-20 object-cover"
              />
            ) : (
              <HeroArt className="absolute inset-0 -z-20 size-full scale-x-[-1]" />
            )}
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night/90 via-night/45 to-night/5" />
            <div className="flex flex-col gap-5 p-[clamp(1.5rem,5vw,3.5rem)] md:flex-row md:items-end md:justify-between">
              <div className="flex max-w-2xl flex-col gap-3">
                <h2 id="ser-parte" className="font-headline text-section">
                  ¿Quieres ser <em>parte</em>?
                </h2>
                <p className="text-lead text-surface/85">
                  Da tu siguiente paso: visítanos un domingo, únete a un grupo o sirve con tus
                  dones.
                </p>
              </div>
              <Link
                href="/soy-nuevo"
                className={buttonClasses({
                  variant: 'accent',
                  size: 'lg',
                  shape: 'pill',
                  className: 'shrink-0',
                })}
              >
                Tu siguiente paso
              </Link>
            </div>
          </div>
          {(content.agenda || channels.length > 0) && (
            <div
              className={`grid gap-3 ${
                content.agenda && channels.length > 0
                  ? 'md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]'
                  : ''
              }`}
            >
              {content.agenda && (
                <div className="flex reveal flex-col justify-between gap-6 rounded-(--radius-frame) bg-accent-soft p-[clamp(1.5rem,4vw,2.5rem)] text-ink">
                  <div className="flex flex-col gap-2">
                    <Icon name="mailOpen" className="size-8 text-accent-strong" />
                    <h3 className="font-headline text-h2">
                      La agenda de la semana, <em>en tu correo</em>
                    </h3>
                    <p className="max-w-md">
                      Eventos y reuniones de los próximos 7 días. Un correo por semana; te das de
                      baja con un clic.
                    </p>
                  </div>
                  <Link
                    href="/agenda#suscribirme"
                    className={buttonClasses({
                      variant: 'primary',
                      shape: 'pill',
                      className: 'self-start',
                    })}
                  >
                    Suscribirme
                  </Link>
                </div>
              )}
              {channels.length > 0 && (
                <div className="flex reveal flex-col justify-between gap-6 rounded-(--radius-frame) bg-electric p-[clamp(1.5rem,4vw,2.5rem)] text-surface on-dark">
                  <div className="flex flex-col gap-2">
                    <Icon name="message" className="size-8 text-peach" />
                    <h3 className="font-headline text-h2">
                      Únete a nuestros <em>canales</em>
                    </h3>
                    <p className="text-surface/85">Avisos, versículos y transmisiones en vivo.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {channels.map((c) => (
                      <a
                        key={c.href}
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonClasses({
                          variant: c.icon === 'whatsapp' ? 'whatsapp' : 'inverseOutline',
                          shape: 'pill',
                        })}
                      >
                        <Icon name={c.icon} className="size-5" /> {c.label}
                        <span className="sr-only"> (se abre en una pestaña nueva)</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Visítanos: dirección y horarios a la izquierda, mapa a la derecha. */}
        <section
          aria-labelledby="visitanos"
          className="grid gap-[clamp(1.5rem,4vw,3rem)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-center"
        >
          <div className="flex flex-col gap-5">
            <SectionHeading
              id="visitanos"
              eyebrow="Visítanos"
              title={
                <>
                  Aquí nos <em>encuentras</em>
                </>
              }
            />
            {config.direccion && (
              <address className="flex flex-col gap-1 not-italic">
                <span className="text-lead font-semibold text-ink">{config.direccion}</span>
                {config.referencia_llegada && (
                  <span className="text-ink-soft">{config.referencia_llegada}</span>
                )}
              </address>
            )}
            {horarios.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {horarios.map((h) => (
                  <li
                    key={h}
                    className="inline-flex items-center gap-2 rounded-full bg-sunken px-4 py-2 font-semibold text-ink"
                  >
                    <Icon name="clock" className="size-4 text-accent-strong" /> {h}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-3">
              <WhatsAppButton
                number={config.whatsapp}
                message="Hola, quiero conocer la iglesia."
                label="Escríbenos por WhatsApp"
              />
              {content.horarios && (
                <Link href="/reuniones" className={buttonClasses({ variant: 'secondary' })}>
                  Todos los horarios
                </Link>
              )}
            </div>
          </div>
          <div className="reveal overflow-hidden rounded-(--radius-frame) ring-1 ring-line/70">
            <MapEmbed
              embedUrl={config.maps_embed_url}
              mapsUrl={config.maps_url}
              address={config.direccion}
              title="Mapa del auditorio"
            />
          </div>
        </section>
      </div>
      <WhatsAppButton
        number={config.whatsapp}
        variant="floating"
        message="Hola, les escribo desde la página web."
      />
    </>
  );
}
