import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buttonClasses } from '@/components/button-styles';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { EventCard } from '@/components/site/EventCard';
import { GroupCard } from '@/components/site/GroupCard';
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
  const color = m.color ?? 'var(--color-brand)';
  const edad = edadText(m);

  return (
    <div className="container-page flex flex-col gap-[clamp(1.5rem,5vw,3rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <Link
        href="/ministerios"
        className="inline-flex items-center gap-1.5 self-start font-semibold text-brand-strong hover:underline"
      >
        <Icon name="chevronLeft" className="size-4" /> Todos los ministerios
      </Link>

      <header
        className="grid gap-[clamp(1.25rem,3vw,2.5rem)] border-l-[6px] pl-[clamp(1rem,3vw,1.75rem)] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center"
        style={{ borderColor: color }}
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold tracking-widest text-accent-strong uppercase">
            {[m.nombre_ministerio ? m.nombre : 'Ministerio', edad].filter(Boolean).join(' · ')}
          </p>
          <h1 className="text-h1 font-semibold text-brand-strong">{ministerioName(m)}</h1>
          {paragraphs(m.descripcion).map((p, i) => (
            <p key={i} className="max-w-prose text-lg whitespace-pre-line text-ink-soft">
              {p}
            </p>
          ))}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/soy-nuevo#mis-datos" className={buttonClasses({ variant: 'accent' })}>
              Quiero conectarme
            </Link>
            {grupos.length > 0 && (
              <Link
                href={`/grupos?edad=${m.id}`}
                className={buttonClasses({ variant: 'secondary' })}
              >
                Ver sus grupos
              </Link>
            )}
          </div>
        </div>
        {m.imagen_url && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sunken">
            <Image
              src={m.imagen_url}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </header>

      <div className="grid gap-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start">
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
              <Link href="/contacto#mensaje" className="font-semibold text-brand-strong underline">
                Escríbenos
              </Link>{' '}
              y te contamos cuándo se reúne este ministerio.
              {content.horarios && (
                <>
                  {' '}
                  También puedes{' '}
                  <Link href="/reuniones" className="font-semibold text-brand-strong underline">
                    ver todos los horarios
                  </Link>
                  .
                </>
              )}
            </p>
          )}
        </Card>

        {eventos.length > 0 && (
          <section aria-labelledby="eventos-ministerio" className="flex flex-col gap-3">
            <h2 id="eventos-ministerio" className="font-headline text-h1 text-brand-strong">
              Próximos eventos
            </h2>
            {eventos.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </section>
        )}
      </div>

      {grupos.length > 0 && (
        <section aria-labelledby="grupos-ministerio" className="flex flex-col gap-4">
          <h2 id="grupos-ministerio" className="font-headline text-h1 text-brand-strong">
            Grupos en casas
          </h2>
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
