import Link from 'next/link';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { EventCard } from '@/components/site/EventCard';
import { listPastEventos, listUpcomingEventos } from '@/lib/eventos';
import { getSiteConfig } from '@/lib/config';
import { socialLinks } from '@/lib/nav';
import { pageMetadata } from '@/lib/seo';
import { getSiteContent } from '@/lib/site-content';
import { CategoriaTabs } from './CategoriaTabs';

export const metadata = pageMetadata({
  title: 'Eventos y noticias',
  description:
    'Próximos eventos, noticias y actividades de la Iglesia Bíblica Riobamba: oración, comunidad, música y capacitación.',
  path: '/eventos',
});

export const revalidate = 300;

export default async function EventosPage() {
  const [upcoming, past, content, config] = await Promise.all([
    listUpcomingEventos(30),
    listPastEventos(6),
    getSiteContent(),
    getSiteConfig(),
  ]);
  // Sin horarios ni agenda por correo, las redes son donde se avisa lo próximo.
  const [social] = content.horarios || content.agenda ? [] : socialLinks(config);
  const [first, ...rest] = upcoming;
  return (
    <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,3rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <PageHeader
        size="display"
        eyebrow="Eventos y noticias"
        title={
          <>
            Lo que <em>viene</em>
          </>
        }
        intro="Lo que viene en la iglesia. ¡Trae a alguien contigo!"
        actions={
          content.agenda && (
            <Link
              href="/agenda"
              className="inline-flex items-center gap-1.5 font-semibold text-brand-strong underline decoration-accent decoration-2 underline-offset-4"
            >
              <Icon name="mail" className="size-4" /> Recibir la agenda por correo
            </Link>
          )
        }
      />
      <CategoriaTabs active={null} />
      {first ? (
        <div className="grid gap-[clamp(1rem,3vw,1.5rem)] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
          <EventCard event={first} variant="featured" />
          <div className="flex flex-col gap-4">
            {rest.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>
      ) : (
        <Card tone="sunken">
          <p className="text-ink-soft">
            No hay eventos programados por ahora.
            {content.horarios && (
              <>
                {' '}
                Mientras tanto, te esperamos en las{' '}
                <Link href="/reuniones" className="font-semibold text-brand-strong underline">
                  reuniones de cada semana
                </Link>
                .
              </>
            )}
            {content.agenda && (
              <>
                {' '}
                <Link
                  href="/agenda#suscribirme"
                  className="font-semibold text-brand-strong underline"
                >
                  Suscríbete a la agenda
                </Link>{' '}
                y te avisamos cuando haya algo nuevo.
              </>
            )}
            {social && (
              <>
                {' '}
                Para enterarte primero, síguenos en{' '}
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-strong underline"
                >
                  {social.label}
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
                .
              </>
            )}
          </p>
        </Card>
      )}
      {past.length > 0 && (
        <section
          aria-labelledby="eventos-pasados"
          className="mt-[clamp(1rem,4vw,3rem)] flex flex-col gap-6"
        >
          <h2 id="eventos-pasados" className="font-headline text-section text-brand-strong">
            Lo que <em>vivimos</em>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {past.map((e) => (
              <EventCard key={e.id} event={e} variant="tile" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
