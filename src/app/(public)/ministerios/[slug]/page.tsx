import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BackLink } from '@/components/BackLink';
import { buttonClasses } from '@/components/button-styles';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { EventCard } from '@/components/site/EventCard';
import { GroupCard } from '@/components/site/GroupCard';
import { PhotoFrame } from '@/components/site/PhotoFrame';
import { SectionHeading } from '@/components/site/SectionHeading';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import { listUpcomingEventos } from '@/lib/eventos';
import { listGruposPublicos } from '@/lib/grupos';
import { edadText, getMinisterioPublico, ministerioName } from '@/lib/ministerios';
import { listReuniones } from '@/lib/reuniones';
import { pageMetadata } from '@/lib/seo';
import { getSiteContent } from '@/lib/site-content';
import { paragraphs } from '@/lib/text';

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const m = await getMinisterioPublico((await params).slug);
  if (!m) return { title: 'Ministerio no encontrado' };
  return pageMetadata({
    title: ministerioName(m),
    description:
      m.descripcion?.slice(0, 160) ??
      `${ministerioName(m)}${edadText(m) ? ` (${edadText(m)})` : ''}: reuniones, grupos y eventos en la Iglesia Bíblica Riobamba.`,
    path: `/ministerios/${m.slug}`,
    image: m.imagen_url,
  });
}

export default async function MinisterioPage({ params }: Props) {
  const m = await getMinisterioPublico((await params).slug);
  if (!m) notFound();
  const [content, reuniones, grupos, eventos] = await Promise.all([
    getSiteContent(),
    listReuniones({ soloActivas: true, rangoId: m.id }),
    listGruposPublicos({ rango: m.id }),
    listUpcomingEventos(3, { rangoId: m.id }),
  ]);
  const edad = edadText(m);

  return (
    <div className="container-page page-flow">
      <BackLink href="/ministerios">Todos los ministerios</BackLink>

      <PageHeader
        size="display"
        eyebrow={[m.nombre_ministerio ? m.nombre : 'Ministerio', edad].filter(Boolean).join(' · ')}
        title={ministerioName(m)}
        intro={paragraphs(m.descripcion).map((p, i) => (
          <p key={i} className="whitespace-pre-line [&+&]:mt-3">
            {p}
          </p>
        ))}
        actions={
          <>
            <Link
              href="/soy-nuevo#mis-datos"
              className={buttonClasses({ variant: 'accent', shape: 'pill' })}
            >
              Quiero conectarme
            </Link>
            {grupos.length > 0 && (
              <Link
                href={`/grupos?edad=${m.id}`}
                className={buttonClasses({ variant: 'secondary', shape: 'pill' })}
              >
                Ver sus grupos
              </Link>
            )}
          </>
        }
      />
      {m.imagen_url && (
        <PhotoFrame
          image={m.imagen_url}
          priority
          sizes="(min-width: 1216px) 1216px, 100vw"
          className="aspect-[16/10] md:aspect-[21/9]"
        />
      )}

      <div className="grid gap-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-aside-main lg:items-start">
        <Card title="Cuándo nos reunimos" as="section" tone="sunken">
          {reuniones.length > 0 ? (
            <ul className="flex flex-col divide-y divide-line/60">
              {reuniones.map((r) => (
                <li key={r.id} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0">
                  <span className="font-semibold text-ink">{r.nombre}</span>
                  <span className="text-ink-soft">
                    {DAY_NAMES[r.dia_semana]} · {formatTime(r.hora_inicio)}
                    {r.hora_fin ? ` – ${formatTime(r.hora_fin)}` : ''}
                    {r.ubicacion ? ` · ${r.ubicacion}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-soft">
              <Link href="/contacto#mensaje" className="link">
                Escríbenos
              </Link>{' '}
              y te contamos cuándo se reúne este ministerio.
              {content.horarios && (
                <>
                  {' '}
                  También puedes{' '}
                  <Link href="/reuniones" className="link">
                    ver todos los horarios
                  </Link>
                  .
                </>
              )}
            </p>
          )}
        </Card>

        {eventos.length > 0 && (
          <section aria-labelledby="eventos-ministerio" className="flex flex-col gap-4">
            <SectionHeading
              id="eventos-ministerio"
              title={
                <>
                  Próximos <em>eventos</em>
                </>
              }
            />
            {eventos.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </section>
        )}
      </div>

      {grupos.length > 0 && (
        <section aria-labelledby="grupos-ministerio" className="flex flex-col gap-4">
          <SectionHeading
            id="grupos-ministerio"
            title={
              <>
                Grupos <em>en casa</em>
              </>
            }
          />
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {grupos.map((g) => (
              <li key={g.id}>
                <GroupCard group={g} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
