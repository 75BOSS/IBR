import Link from 'next/link';
import { Card } from '@/components/Card';
import { FilterTabs } from '@/components/FilterTabs';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { EventCard } from '@/components/site/EventCard';
import { listEventosByCategoria, listPastEventos, listUpcomingEventos } from '@/lib/eventos';
import { pageMetadata } from '@/lib/seo';
import { EVENTO_CATEGORIAS } from '@/lib/validators/eventos';

export const metadata = pageMetadata({
  title: 'Eventos y noticias',
  description:
    'Próximos eventos, noticias y actividades de la Iglesia Bíblica Riobamba: oración, comunidad, música y capacitación.',
  path: '/eventos',
});

/** Pestañas: «Próximos» (todo lo que viene) y una por categoría, excepto «Evento» genérico. */
const CATEGORIAS = EVENTO_CATEGORIAS.filter((c) => c.value !== 'evento');

export default async function EventosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria: raw } = await searchParams;
  const categoria = CATEGORIAS.find((c) => c.value === raw) ?? null;
  const tabs = (
    <FilterTabs
      label="Filtrar por categoría"
      tabs={[
        { label: 'Próximos', href: '/eventos', active: categoria === null },
        ...CATEGORIAS.map((c) => ({
          label: c.value === 'noticia' ? 'Noticias' : c.label,
          href: `/eventos?categoria=${c.value}`,
          active: categoria?.value === c.value,
        })),
      ]}
    />
  );

  if (categoria) {
    const items = await listEventosByCategoria(categoria.value, 30);
    const [first, ...rest] = items;
    return (
      <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,3rem)] py-[clamp(2rem,6vw,4.5rem)]">
        <PageHeader
          eyebrow="Eventos y noticias"
          title={categoria.value === 'noticia' ? 'Noticias' : categoria.label}
        />
        {tabs}
        {first ? (
          <div className="grid gap-[clamp(1rem,3vw,1.5rem)] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
            <EventCard event={first} featured />
            <div className="flex flex-col gap-4">
              {rest.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        ) : (
          <Card tone="sunken">
            <p className="text-ink-soft">
              Todavía no hay publicaciones en esta categoría.{' '}
              <Link href="/eventos" className="font-semibold text-brand-strong underline">
                Ver lo próximo
              </Link>
            </p>
          </Card>
        )}
      </div>
    );
  }

  const [upcoming, past] = await Promise.all([listUpcomingEventos(30), listPastEventos(6)]);
  const [first, ...rest] = upcoming;
  return (
    <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,3rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <PageHeader
        eyebrow="Eventos y noticias"
        title="Lo que viene"
        intro="Lo que viene en la iglesia. ¡Trae a alguien contigo!"
        actions={
          <Link
            href="/agenda"
            className="inline-flex items-center gap-1.5 font-semibold text-brand-strong underline decoration-accent decoration-2 underline-offset-4"
          >
            <Icon name="mail" className="size-4" /> Recibir la agenda por correo
          </Link>
        }
      />
      {tabs}
      {first ? (
        <div className="grid gap-[clamp(1rem,3vw,1.5rem)] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
          <EventCard event={first} featured />
          <div className="flex flex-col gap-4">
            {rest.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>
      ) : (
        <Card tone="sunken">
          <p className="text-ink-soft">
            No hay eventos programados por ahora. Revisa las reuniones de cada semana.
          </p>
        </Card>
      )}
      {past.length > 0 && (
        <section aria-labelledby="eventos-pasados" className="flex flex-col gap-4">
          <h2 id="eventos-pasados" className="text-h2 font-semibold text-ink-soft">
            Eventos pasados
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {past.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
