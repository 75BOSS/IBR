import type { Metadata } from 'next';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { EventCard } from '@/components/site/EventCard';
import { listPastEventos, listUpcomingEventos } from '@/lib/eventos';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Eventos',
  description: 'Próximos eventos y actividades de la Iglesia Bíblica Riobamba.',
  openGraph: { title: 'Eventos · Iglesia Bíblica Riobamba' },
};

export default async function EventosPage() {
  const [upcoming, past] = await Promise.all([listUpcomingEventos(30), listPastEventos(6)]);
  const [first, ...rest] = upcoming;
  return (
    <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,3rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <PageHeader
        eyebrow="Agenda"
        title="Eventos"
        intro="Lo que viene en la iglesia. ¡Trae a alguien contigo!"
      />
      {first ? (
        <div className="grid gap-[clamp(1rem,3vw,1.5rem)] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
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
