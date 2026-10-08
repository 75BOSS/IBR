import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { buttonClasses } from '@/components/button-styles';
import { Card } from '@/components/Card';
import { Field } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { LiveBanner } from '@/components/site/LiveBanner';
import { SectionHeading } from '@/components/site/SectionHeading';
import { getSiteConfig } from '@/lib/config';
import { formatDateOnly, formatDateTime } from '@/lib/dates';
import { type Predica, listPredicas, predicaFacets } from '@/lib/predicas';
import { pageMetadata } from '@/lib/seo';
import { youTubeThumbnail } from '@/lib/youtube';
import { type ChannelVideo, latestChannelVideos } from '@/lib/youtube-api';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Prédicas',
  description:
    'Prédicas de la Iglesia Bíblica Riobamba: mira las enseñanzas de cada domingo por serie y predicador.',
  path: '/predicas',
});

const pick = (value: string | string[] | undefined) =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

/** Video en la lista (prédicas guardadas o videos del canal): miniatura + título + datos. */
function VideoRow({
  href,
  thumbnail,
  title,
  children,
}: {
  href: string;
  thumbnail: string | null;
  title: string;
  children: ReactNode;
}) {
  return (
    <li>
      <Link href={href} scroll className="group flex gap-4 rounded-xl">
        <span className="relative aspect-video w-[clamp(7.5rem,32vw,11rem)] shrink-0 overflow-hidden rounded-xl bg-sunken">
          {thumbnail && (
            <Image
              src={thumbnail}
              alt=""
              fill
              sizes="176px"
              className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
            />
          )}
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="font-display text-h3 leading-snug font-semibold text-ink group-hover:text-brand-strong group-hover:underline">
            {title}
          </span>
          {children}
        </span>
      </Link>
    </li>
  );
}

function Meta({ p }: { p: Predica }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
      <span>{formatDateOnly(p.fecha)}</span>
      {p.predicador && <span>· {p.predicador}</span>}
      {p.pasaje && <span>· {p.pasaje}</span>}
    </p>
  );
}

/** Últimos cultos del canal: el elegido (o el más reciente) arriba y el resto en lista. */
function ChannelVideos({
  videos,
  selected,
  channelUrl,
}: {
  videos: ChannelVideo[];
  selected: string | null;
  channelUrl: string | null;
}) {
  const featured = videos.find((v) => v.videoId === selected) ?? videos[0];
  if (!featured) return null;
  const rest = videos.filter((v) => v.videoId !== featured.videoId);
  const published = (v: ChannelVideo) =>
    formatDateTime(new Date(v.publicado), { dateStyle: 'long' });
  return (
    <>
      <section
        aria-labelledby="predica-destacada"
        className="grid gap-[clamp(1rem,3vw,2rem)] lg:grid-cols-main-aside lg:items-center"
      >
        <YouTubeEmbed key={featured.videoId} videoId={featured.videoId} title={featured.titulo} />
        <div className="flex flex-col gap-3">
          <p className="eyebrow text-accent-strong">
            {featured === videos[0] ? 'Último culto' : 'Culto'}
          </p>
          <h2 id="predica-destacada" className="font-headline text-h1 text-brand-strong">
            {featured.titulo}
          </h2>
          <p className="text-sm text-ink-soft">Publicado el {published(featured)}</p>
          {channelUrl && (
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({
                variant: 'secondary',
                shape: 'pill',
                className: 'self-start',
              })}
            >
              <Icon name="youtube" className="size-5" /> Ver el canal
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          )}
        </div>
      </section>
      {rest.length > 0 && (
        <section aria-labelledby="mas-predicas" className="section-flow">
          <SectionHeading
            id="mas-predicas"
            title={
              <>
                Cultos <em>anteriores</em>
              </>
            }
          />
          <ul className="grid gap-x-8 gap-y-5 xl:grid-cols-2">
            {rest.map((v) => (
              <VideoRow
                key={v.videoId}
                href={`/predicas?v=${v.videoId}`}
                thumbnail={youTubeThumbnail(v.videoId)}
                title={v.titulo}
              >
                <span className="text-sm text-ink-soft">{published(v)}</span>
              </VideoRow>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

export default async function PredicasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const serie = pick(params.serie);
  const predicador = pick(params.predicador);
  const selected = pick(params.v);
  const [sermons, facets, config] = await Promise.all([
    listPredicas({ soloPublicadas: true, serie, predicador, limit: 60 }),
    predicaFacets(true),
    getSiteConfig(),
  ]);
  const featured =
    sermons.find((s) => s.youtube_id === selected) ??
    (serie || predicador ? sermons[0] : (sermons.find((s) => s.destacada) ?? sermons[0]));
  const rest = sermons.filter((s) => s.id !== featured?.id);
  const filtered = Boolean(serie || predicador);
  // Mientras no haya prédicas cargadas en el panel, los últimos cultos del canal de YouTube.
  const channelVideos =
    sermons.length === 0 && !filtered && config.youtube_channel_id
      ? await latestChannelVideos(config.youtube_channel_id)
      : [];
  const query = (v: string) => {
    const q = new URLSearchParams();
    if (serie) q.set('serie', serie);
    if (predicador) q.set('predicador', predicador);
    q.set('v', v);
    return `/predicas?${q.toString()}`;
  };

  return (
    <div className="container-page page-flow">
      <PageHeader
        size="display"
        eyebrow="Enseñanza"
        title="Prédicas"
        intro="Escucha la Palabra cuando quieras. Cada domingo subimos la prédica completa."
      />
      <LiveBanner />

      {featured ? (
        <section
          aria-labelledby="predica-destacada"
          className="grid gap-[clamp(1rem,3vw,2rem)] lg:grid-cols-main-aside lg:items-center"
        >
          <YouTubeEmbed
            key={featured.youtube_id}
            videoId={featured.youtube_id}
            title={featured.titulo}
          />
          <div className="flex flex-col gap-3">
            {featured.serie && <Tag tone="accent">Serie: {featured.serie}</Tag>}
            <h2 id="predica-destacada" className="font-headline text-h1 text-brand-strong">
              {featured.titulo}
            </h2>
            <Meta p={featured} />
            {featured.descripcion && (
              <p className="max-w-prose text-ink-soft">{featured.descripcion}</p>
            )}
          </div>
        </section>
      ) : channelVideos.length > 0 ? (
        <ChannelVideos videos={channelVideos} selected={selected} channelUrl={config.youtube} />
      ) : (
        <Card tone="sunken">
          <p className="text-ink-soft">
            {filtered
              ? 'No hay prédicas con ese filtro. '
              : 'Pronto publicaremos las prédicas aquí. '}
            {filtered ? (
              <Link href="/predicas" className="link">
                Ver todas
              </Link>
            ) : (
              config.youtube && (
                <a href={config.youtube} target="_blank" rel="noopener noreferrer" className="link">
                  Mira nuestro canal de YouTube
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              )
            )}
          </p>
        </Card>
      )}

      {(facets.series.length > 0 || facets.predicadores.length > 0) && (
        <form
          method="get"
          action="/predicas"
          className="grid items-end gap-3 rounded-2xl bg-sunken/70 p-4 md:grid-cols-[1fr_1fr_auto]"
        >
          <Field
            as="select"
            label="Serie"
            name="serie"
            emptyOption="Todas las series"
            options={facets.series.map((s) => ({ value: s, label: s }))}
            defaultValue={serie ?? ''}
          />
          <Field
            as="select"
            label="Predicador"
            name="predicador"
            emptyOption="Todos"
            options={facets.predicadores.map((s) => ({ value: s, label: s }))}
            defaultValue={predicador ?? ''}
          />
          <div className="flex gap-2">
            <button type="submit" className={buttonClasses({ className: 'flex-1 md:flex-none' })}>
              Filtrar
            </button>
            {filtered && (
              <Link href="/predicas" className={buttonClasses({ variant: 'ghost' })}>
                Limpiar
              </Link>
            )}
          </div>
        </form>
      )}

      {rest.length > 0 && (
        <section aria-labelledby="mas-predicas" className="section-flow">
          <SectionHeading
            id="mas-predicas"
            title={
              filtered ? (
                'Resultados'
              ) : (
                <>
                  Más <em>prédicas</em>
                </>
              )
            }
          />
          <ul className="grid gap-x-8 gap-y-5 xl:grid-cols-2">
            {rest.map((p) => (
              <VideoRow
                key={p.id}
                href={query(p.youtube_id)}
                thumbnail={p.miniatura_url}
                title={p.titulo}
              >
                <Meta p={p} />
              </VideoRow>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
