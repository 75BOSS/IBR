import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { buttonClasses } from '@/components/button-styles';
import { Card } from '@/components/Card';
import { Field } from '@/components/Field';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { LiveBanner } from '@/components/site/LiveBanner';
import { formatDateOnly } from '@/lib/dates';
import { type Predica, listPredicas, predicaFacets } from '@/lib/predicas';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Prédicas',
  description:
    'Prédicas de la Iglesia Bíblica Riobamba: mira las enseñanzas de cada domingo por serie y predicador.',
  openGraph: { title: 'Prédicas · Iglesia Bíblica Riobamba' },
};

const pick = (value: string | string[] | undefined) =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

function Meta({ p }: { p: Predica }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
      <span>{formatDateOnly(p.fecha)}</span>
      {p.predicador && <span>· {p.predicador}</span>}
      {p.pasaje && <span>· {p.pasaje}</span>}
    </p>
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
  const [sermons, facets] = await Promise.all([
    listPredicas({ soloPublicadas: true, serie, predicador, limit: 60 }),
    predicaFacets(true),
  ]);
  const featured =
    sermons.find((s) => s.youtube_id === selected) ??
    (serie || predicador ? sermons[0] : (sermons.find((s) => s.destacada) ?? sermons[0]));
  const rest = sermons.filter((s) => s.id !== featured?.id);
  const filtered = Boolean(serie || predicador);
  const query = (v: string) => {
    const q = new URLSearchParams();
    if (serie) q.set('serie', serie);
    if (predicador) q.set('predicador', predicador);
    q.set('v', v);
    return `/predicas?${q.toString()}`;
  };

  return (
    <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,3rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <PageHeader
        eyebrow="Enseñanza"
        title="Prédicas"
        intro="Escucha la Palabra cuando quieras. Cada domingo subimos la prédica completa."
      />
      <LiveBanner />

      {featured ? (
        <section
          aria-labelledby="predica-destacada"
          className="grid gap-[clamp(1rem,3vw,2rem)] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center"
        >
          <YouTubeEmbed
            key={featured.youtube_id}
            videoId={featured.youtube_id}
            title={featured.titulo}
          />
          <div className="flex flex-col gap-3">
            {featured.serie && <Tag tone="accent">Serie: {featured.serie}</Tag>}
            <h2 id="predica-destacada" className="text-h2 font-semibold text-brand-strong">
              {featured.titulo}
            </h2>
            <Meta p={featured} />
            {featured.descripcion && (
              <p className="max-w-prose text-ink-soft">{featured.descripcion}</p>
            )}
          </div>
        </section>
      ) : (
        <Card tone="sunken">
          <p className="text-ink-soft">
            {filtered
              ? 'No hay prédicas con ese filtro. '
              : 'Pronto publicaremos las prédicas aquí. '}
            {filtered && (
              <Link href="/predicas" className="font-semibold text-brand-strong underline">
                Ver todas
              </Link>
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
        <section aria-labelledby="mas-predicas" className="flex flex-col gap-4">
          <h2 id="mas-predicas" className="text-h2 font-semibold text-ink">
            {filtered ? 'Resultados' : 'Más prédicas'}
          </h2>
          <ul className="grid gap-x-8 gap-y-5 xl:grid-cols-2">
            {rest.map((p) => (
              <li key={p.id}>
                <Link href={query(p.youtube_id)} scroll className="group flex gap-4 rounded-xl">
                  <span className="relative aspect-video w-[clamp(7.5rem,32vw,11rem)] shrink-0 overflow-hidden rounded-xl bg-sunken">
                    {p.miniatura_url && (
                      <Image
                        src={p.miniatura_url}
                        alt=""
                        fill
                        sizes="176px"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-display text-h3 leading-snug font-semibold text-ink group-hover:text-brand-strong group-hover:underline">
                      {p.titulo}
                    </span>
                    <Meta p={p} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
