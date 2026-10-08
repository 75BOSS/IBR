import Link from 'next/link';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { MapEmbed } from '@/components/MapEmbed';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { getSiteConfig } from '@/lib/config';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import { type Reunion, listReuniones } from '@/lib/reuniones';
import { pageMetadata } from '@/lib/seo';
import { getSiteContent } from '@/lib/site-content';
import { whatsappHref } from '@/lib/whatsapp';
import { youTubeLiveUrl } from '@/lib/youtube';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Reuniones y horarios',
  description:
    'Horarios de culto y reuniones de la Iglesia Bíblica Riobamba, dirección y cómo llegar.',
  path: '/reuniones',
});

function timeRange(m: Reunion) {
  return `${formatTime(m.hora_inicio)}${m.hora_fin ? ` – ${formatTime(m.hora_fin)}` : ''}`;
}

export default async function ReunionesPublicPage() {
  const [config, content, meetings] = await Promise.all([
    getSiteConfig(),
    getSiteContent(),
    listReuniones({ soloActivas: true }),
  ]);
  const whatsapp = whatsappHref(config.whatsapp, 'Hola, quiero saber los horarios de la iglesia.');
  const main = meetings.find((m) => m.dia_semana === 7) ?? meetings[0];
  const byDay = new Map<number, Reunion[]>();
  for (const m of meetings) byDay.set(m.dia_semana, [...(byDay.get(m.dia_semana) ?? []), m]);
  const online = meetings.filter((m) => m.en_linea);

  return (
    <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,3rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <PageHeader
        size="display"
        eyebrow="Te esperamos"
        title={
          <>
            Reuniones y <em>horarios</em>
          </>
        }
        intro={
          meetings.length > 0
            ? 'Ven tal como eres. Aquí están los días, las horas y cómo llegar.'
            : 'Ven tal como eres. Aquí está cómo llegar; muy pronto publicaremos los horarios.'
        }
      />

      <div className="grid gap-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="flex flex-col gap-[clamp(1.25rem,3vw,2rem)]">
          {main && (
            <Card tone="brand" emphasis="featured">
              <p className="text-sm font-semibold tracking-widest text-accent-soft uppercase">
                Reunión principal
              </p>
              <h2 className="mt-2 font-headline text-h1">{main.nombre}</h2>
              <p className="mt-2 font-display text-[clamp(1.75rem,1.2rem+2.5vw,2.75rem)] leading-none">
                {DAY_NAMES[main.dia_semana]} · {timeRange(main)}
              </p>
              {main.descripcion && (
                <p className="mt-3 max-w-prose text-surface/85">{main.descripcion}</p>
              )}
              <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-surface/90">
                {main.ubicacion && (
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="mapPin" className="size-5" />
                    {main.ubicacion}
                  </span>
                )}
                {main.en_linea && (
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="radio" className="size-5" />
                    También en línea
                  </span>
                )}
              </p>
            </Card>
          )}

          <Card title="Durante la semana" as="section">
            {meetings.length === 0 ? (
              <p className="text-ink-soft">
                Pronto publicaremos los horarios. Mientras tanto,{' '}
                {whatsapp ? (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-strong underline"
                  >
                    escríbenos por WhatsApp
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                ) : (
                  <Link
                    href="/contacto#mensaje"
                    className="font-semibold text-brand-strong underline"
                  >
                    escríbenos un mensaje
                  </Link>
                )}{' '}
                y te contamos.
              </p>
            ) : (
              <ol className="flex flex-col divide-y divide-line/60">
                {[...byDay.entries()].map(([day, items]) => (
                  <li
                    key={day}
                    className="grid gap-2 py-4 first:pt-0 last:pb-0 md:grid-cols-[8rem_minmax(0,1fr)]"
                  >
                    <h3 className="font-sans text-sm font-bold tracking-wider text-brand uppercase">
                      {DAY_NAMES[day]}
                    </h3>
                    <ul className="flex flex-col gap-3">
                      {items.map((m) => (
                        <li key={m.id} className="flex flex-col gap-1">
                          <p className="flex flex-wrap items-baseline gap-x-3">
                            <span className="font-display text-h3 font-medium text-ink">
                              {timeRange(m)}
                            </span>
                            <span className="font-semibold">{m.nombre}</span>
                          </p>
                          {m.descripcion && <p className="text-ink-soft">{m.descripcion}</p>}
                          <p className="flex flex-wrap gap-1.5">
                            {m.rango_edad && <Tag color={m.rango_color}>{m.rango_edad}</Tag>}
                            {m.ubicacion && <Tag tone="brand">{m.ubicacion}</Tag>}
                            {m.en_linea && <Tag tone="accent">En línea</Tag>}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-[clamp(1.25rem,3vw,2rem)]">
          <Card title="Cómo llegar" as="section" tone="sunken">
            <div className="flex flex-col gap-4">
              {config.direccion ? (
                <address className="not-italic">
                  <p className="font-semibold">{config.direccion}</p>
                  {config.referencia_llegada && (
                    <p className="mt-1 text-ink-soft">{config.referencia_llegada}</p>
                  )}
                </address>
              ) : (
                // Con el enlace de Google Maps el mapa ya muestra dónde es; el aviso sobra.
                !config.maps_url && (
                  <p className="text-ink-soft">Pronto publicaremos la dirección del auditorio.</p>
                )
              )}
              <MapEmbed
                embedUrl={config.maps_embed_url}
                mapsUrl={config.maps_url}
                address={config.direccion}
                title="Mapa del auditorio"
              />
              <WhatsAppButton
                number={config.whatsapp}
                message="Hola, quiero saber cómo llegar a la iglesia."
                label="Pregúntanos por WhatsApp"
              />
            </div>
          </Card>

          {online.length > 0 && (
            <Card title="En línea" as="section" accentColor="var(--color-accent)">
              <p className="text-ink-soft">
                ¿No puedes venir? Transmitimos{' '}
                {online.map((m) => m.nombre.toLowerCase()).join(', ')} por YouTube.
              </p>
              <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2 empty:hidden">
                {config.youtube && (
                  <a
                    href={youTubeLiveUrl(config.youtube)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-brand-strong underline decoration-accent decoration-2 underline-offset-4"
                  >
                    <Icon name="youtube" className="size-5" />
                    Ver la transmisión en YouTube
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                )}
                {content.predicas && (
                  <Link
                    href="/predicas"
                    className="inline-flex items-center gap-1.5 font-semibold text-brand-strong underline decoration-accent decoration-2 underline-offset-4"
                  >
                    Prédicas anteriores
                    <Icon name="arrowRight" className="size-4" />
                  </Link>
                )}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
