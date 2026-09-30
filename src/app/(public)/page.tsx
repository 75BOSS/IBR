import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Image from 'next/image';
import Link from 'next/link';
import { buttonClasses } from '@/components/button-styles';
import { Card } from '@/components/Card';
import { Icon, type IconName } from '@/components/Icon';
import { MapEmbed } from '@/components/MapEmbed';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { EventCard } from '@/components/site/EventCard';
import { LiveBanner } from '@/components/site/LiveBanner';
import { CONFIG_DEFAULTS, getSiteConfig } from '@/lib/config';
import { DAY_NAMES, formatDateOnly, formatTime } from '@/lib/dates';
import { listPastores } from '@/lib/equipo';
import { listUpcomingEventos } from '@/lib/eventos';
import { listPredicas } from '@/lib/predicas';
import { listReuniones } from '@/lib/reuniones';

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

function SectionTitle({
  id,
  title,
  link,
}: {
  id: string;
  title: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <h2 id={id} className="text-h2 font-semibold text-brand-strong">
        {title}
      </h2>
      {link && (
        <Link
          href={link.href}
          className="inline-flex items-center gap-1.5 font-semibold text-brand-strong underline decoration-accent decoration-2 underline-offset-4"
        >
          {link.label} <Icon name="arrowRight" className="size-4" />
        </Link>
      )}
    </div>
  );
}

function Access({
  href,
  icon,
  title,
  text,
  featured = false,
}: {
  href: string;
  icon: IconName;
  title: string;
  text: string;
  /** El acceso principal (Soy nuevo): otro color y, en tablet, todo el ancho. */
  featured?: boolean;
}) {
  return (
    <li className={featured ? 'md:col-span-2 lg:col-span-1' : ''}>
      <Link
        href={href}
        className={`group flex h-full items-start gap-4 rounded-2xl p-[clamp(1rem,3vw,1.5rem)] ring-1 transition-shadow hover:shadow-card ${
          featured ? 'bg-accent-soft ring-accent/30' : 'bg-surface ring-line/70'
        }`}
      >
        <span
          className={`grid size-12 shrink-0 place-items-center rounded-xl ${
            featured ? 'bg-accent text-surface' : 'bg-brand-soft text-brand-strong'
          }`}
        >
          <Icon name={icon} />
        </span>
        <span className="flex flex-col gap-1">
          <span className="font-display text-h3 font-semibold text-ink group-hover:text-brand-strong group-hover:underline">
            {title}
          </span>
          <span className="text-ink-soft">{text}</span>
        </span>
      </Link>
    </li>
  );
}

export default async function HomePage() {
  const [config, reuniones, eventos, [predica], pastores] = await Promise.all([
    getSiteConfig(),
    listReuniones({ soloActivas: true }),
    listUpcomingEventos(3),
    listPredicas({ soloPublicadas: true, limit: 1 }),
    listPastores(),
  ]);
  // Hay reuniones a la misma hora para distintas edades: se muestra cada día y hora una vez.
  const horarios = [
    ...new Set(reuniones.map((r) => `${DAY_NAMES[r.dia_semana]} ${formatTime(r.hora_inicio)}`)),
  ]
    .slice(0, 2)
    .join(' · ');
  const [firstEvent, ...otherEvents] = eventos;

  return (
    <>
      {/* Portada: foto real con velo oscuro; sin foto, el color de la marca. */}
      <section className="relative isolate overflow-hidden bg-brand-strong text-surface on-dark">
        {config.home_hero_imagen && (
          <>
            <Image
              src={config.home_hero_imagen}
              alt=""
              fill
              priority
              sizes="100vw"
              className="-z-20 object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/60 to-ink/30 md:bg-gradient-to-r md:from-ink/85 md:via-ink/55 md:to-transparent" />
          </>
        )}
        <div className="container-page flex min-h-[clamp(26rem,70vh,40rem)] flex-col justify-end gap-5 py-[clamp(2.5rem,8vw,5rem)] md:justify-center">
          <p className="text-sm font-semibold tracking-widest text-accent-soft uppercase">
            {config.nombre_iglesia}
          </p>
          <h1 className="max-w-3xl font-display text-display font-semibold">
            {config.home_hero_titulo}
          </h1>
          {config.home_hero_sub && (
            <p className="max-w-xl text-lg text-surface/90">{config.home_hero_sub}</p>
          )}
          {horarios && (
            <p className="inline-flex items-center gap-2 font-semibold">
              <Icon name="clock" className="size-5 text-accent-soft" /> {horarios}
            </p>
          )}
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/soy-nuevo" className={buttonClasses({ variant: 'accent', size: 'lg' })}>
              Es mi primera vez
            </Link>
            <Link
              href="/reuniones"
              className={buttonClasses({ variant: 'inverseOutline', size: 'lg' })}
            >
              Horarios y cómo llegar
            </Link>
          </div>
        </div>
      </section>

      <div className="container-page flex flex-col gap-[clamp(2.5rem,7vw,5rem)] py-[clamp(2rem,6vw,4.5rem)]">
        <LiveBanner />

        <nav aria-label="Accesos rápidos">
          <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <Access
              href="/soy-nuevo"
              icon="handHeart"
              title="Soy nuevo"
              text="Qué esperar en tu primera visita y cómo conectar."
              featured
            />
            <Access
              href="/reuniones"
              icon="clock"
              title="Horarios"
              text={horarios ? `${horarios}. Dirección y mapa.` : 'Días, horas y cómo llegar.'}
            />
            <Access
              href="/grupos"
              icon="users"
              title="Grupos"
              text="Encuentra un grupo en casa cerca de ti."
            />
          </ul>
        </nav>

        {firstEvent && (
          <section aria-labelledby="proximos-eventos" className="flex flex-col gap-4">
            <SectionTitle
              id="proximos-eventos"
              title="Próximos eventos"
              link={{ href: '/eventos', label: 'Ver todos' }}
            />
            <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
              <EventCard event={firstEvent} featured />
              {otherEvents.length > 0 && (
                <div className="flex flex-col gap-4">
                  {otherEvents.map((e) => (
                    <EventCard key={e.id} event={e} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {predica && (
          <section
            aria-labelledby="ultima-predica"
            className="grid items-center gap-[clamp(1.25rem,3vw,2.5rem)] rounded-3xl bg-sunken p-[clamp(1rem,4vw,2.5rem)] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
          >
            <YouTubeEmbed videoId={predica.youtube_id} title={predica.titulo} />
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold tracking-widest text-accent-strong uppercase">
                Última prédica
              </p>
              <h2 id="ultima-predica" className="text-h2 font-semibold text-ink">
                {predica.titulo}
              </h2>
              <p className="text-ink-soft">
                {[predica.predicador, predica.pasaje, formatDateOnly(predica.fecha)]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              {predica.serie && <p className="text-ink-soft">Serie: {predica.serie}</p>}
              <Link
                href="/predicas"
                className="mt-2 inline-flex items-center gap-1.5 font-semibold text-brand-strong underline decoration-accent decoration-2 underline-offset-4"
              >
                Más prédicas <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
          </section>
        )}

        {pastores.length > 0 && (
          <section aria-labelledby="pastores" className="flex flex-col gap-4">
            <SectionTitle id="pastores" title="Nuestros pastores" />
            <ul className="flex flex-wrap gap-[clamp(1rem,3vw,2rem)]">
              {pastores.map((p) => (
                <li
                  key={p.id}
                  className="flex max-w-md min-w-0 flex-[1_1_18rem] gap-4 rounded-2xl bg-surface p-4 ring-1 ring-line/70"
                >
                  <span className="relative size-[clamp(4.5rem,18vw,6rem)] shrink-0 overflow-hidden rounded-full bg-brand-soft">
                    {p.foto_url ? (
                      <Image src={p.foto_url} alt="" fill sizes="96px" className="object-cover" />
                    ) : (
                      <span className="grid size-full place-items-center font-display text-h2 text-brand-strong">
                        {p.nombre.charAt(0)}
                      </span>
                    )}
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-display text-h3 font-semibold text-ink">{p.nombre}</span>
                    <span className="text-sm font-semibold text-accent-strong">{p.rol}</span>
                    {p.bio && <span className="line-clamp-3 text-sm text-ink-soft">{p.bio}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="grid gap-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start">
          <Card as="section" tone="brand" emphasis="featured">
            <Icon name="handHeart" className="size-8 text-accent-soft" />
            <h2 className="mt-3 font-display text-h2 font-semibold">¿Podemos orar por ti?</h2>
            <p className="mt-2 text-surface/85">
              Cuéntanos lo que estás viviendo. Los pastores leen cada petición y oramos por ella.
              Puedes enviarla sin tu nombre.
            </p>
            <Link
              href="/oracion"
              className={buttonClasses({ variant: 'inverseOutline', className: 'mt-5' })}
            >
              Pedir oración
            </Link>
          </Card>
          <Card as="section" title="Visítanos" tone="sunken">
            <div className="flex flex-col gap-4">
              {config.direccion && (
                <address className="not-italic">
                  <p className="font-semibold">{config.direccion}</p>
                  {config.referencia_llegada && (
                    <p className="mt-1 text-ink-soft">{config.referencia_llegada}</p>
                  )}
                </address>
              )}
              <MapEmbed
                embedUrl={config.maps_embed_url}
                address={config.direccion}
                title="Mapa del auditorio"
              />
              <WhatsAppButton
                number={config.whatsapp}
                message="Hola, quiero conocer la iglesia."
                label="Escríbenos por WhatsApp"
              />
            </div>
          </Card>
        </div>
      </div>
      <WhatsAppButton
        number={config.whatsapp}
        variant="floating"
        message="Hola, les escribo desde la página web."
      />
    </>
  );
}
