import Link from 'next/link';
import { buttonClasses } from '@/components/button-styles';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { CountUp } from '@/components/site/CountUp';
import { PersonCard } from '@/components/site/PersonCard';
import { PhotoFrame } from '@/components/site/PhotoFrame';
import { SectionHeading } from '@/components/site/SectionHeading';
import { getSiteConfig } from '@/lib/config';
import { parseCreencias } from '@/lib/config-fields';
import { listEquipoVisible } from '@/lib/equipo';
import { pageMetadata } from '@/lib/seo';
import { directionsUrl } from '@/lib/maps';
import { getSiteContent } from '@/lib/site-content';
import { getChurchStats } from '@/lib/stats';
import { paragraphs } from '@/lib/text';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Nosotros',
  description:
    'Quiénes somos: la historia, la visión y lo que cree la Iglesia Bíblica Riobamba, y las personas que la sirven.',
  path: '/nosotros',
});

export default async function NosotrosPage() {
  const [config, team, stats, content] = await Promise.all([
    getSiteConfig(),
    listEquipoVisible(),
    getChurchStats(),
    getSiteContent(),
  ]);
  const directions = directionsUrl(config.maps_url, config.direccion);
  const historia = paragraphs(config.nosotros_historia);
  const creencias = parseCreencias(config.nosotros_creencias);
  const pastores = team.filter((p) => p.es_pastor);
  const lideres = team.filter((p) => !p.es_pastor);
  const years = config.anio_fundacion
    ? new Date().getFullYear() - Number(config.anio_fundacion)
    : 0;
  const figures = [
    { value: years, label: years === 1 ? 'año en Riobamba' : 'años en Riobamba' },
    { value: stats.grupos, label: stats.grupos === 1 ? 'grupo en casa' : 'grupos en casas' },
    {
      value: stats.ministerios,
      label: stats.ministerios === 1 ? 'ministerio por edad' : 'ministerios por edad',
    },
    {
      value: stats.areas,
      label: stats.areas === 1 ? 'área de servicio' : 'áreas de servicio',
    },
  ].filter((f) => f.value > 0);

  return (
    <div className="container-page page-sections">
      <PageHeader
        size="display"
        eyebrow="Nosotros"
        title={
          <>
            Quiénes <em>somos</em>
          </>
        }
        intro={`${config.nombre_iglesia}: una familia que se reúne en Riobamba para conocer a Dios por medio de la Biblia y vivirla juntos.`}
      />

      {figures.length > 0 && (
        <section aria-label="La iglesia en cifras">
          <ul className="grid grid-cols-2 gap-y-8 rounded-(--radius-frame) bg-surface p-[clamp(1.5rem,4vw,3rem)] ring-1 ring-line/70 md:auto-cols-fr md:grid-flow-col md:grid-cols-none">
            {figures.map((f, i) => (
              <li
                key={f.label}
                className={`flex flex-col gap-1 px-[clamp(0.75rem,2vw,2rem)] ${
                  i % 2 === 1 ? 'border-l border-line' : ''
                } ${i > 0 ? 'md:border-l md:border-line' : ''}`}
              >
                <CountUp
                  value={f.value}
                  className="font-headline text-[clamp(2.5rem,1.9rem+2.4vw,4rem)] leading-none text-brand-strong"
                />
                <span className="text-ink-soft">{f.label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section
        aria-labelledby="historia"
        className="grid gap-[clamp(1.5rem,4vw,3.5rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start"
      >
        <div className="flex flex-col gap-3 lg:sticky lg:top-28">
          <PhotoFrame
            image={config.nosotros_imagen}
            alt={`Congregación de ${config.nombre_iglesia}`}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[16/10] reveal md:aspect-[21/9] lg:aspect-[5/4]"
          />
          {config.vision && (
            <div className="rounded-(--radius-frame) bg-brand-strong p-[clamp(1.25rem,3vw,2rem)] text-surface on-dark">
              <p className="eyebrow text-peach">Visión</p>
              <p className="mt-3 font-script text-[clamp(2rem,1.6rem+1.6vw,2.75rem)] leading-tight">
                {config.vision}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-5">
          <SectionHeading
            id="historia"
            eyebrow={config.anio_fundacion ? `Desde ${config.anio_fundacion}` : 'Historia'}
            title={
              <>
                Nuestra <em>historia</em>
              </>
            }
          />
          <div className="flex max-w-prose flex-col gap-4 text-lg leading-relaxed text-ink">
            {historia.length > 0 ? (
              historia.map((p, i) => (
                <p
                  key={i}
                  className={`whitespace-pre-line ${
                    i === 0
                      ? 'first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-[4.5rem] first-letter:leading-[0.8] first-letter:text-accent-strong'
                      : ''
                  }`}
                >
                  {p}
                </p>
              ))
            ) : (
              <p>
                {config.nombre_iglesia} se reúne
                {config.anio_fundacion ? ` desde ${config.anio_fundacion}` : ''} en Riobamba. Cada
                semana nos encontramos para adorar a Dios, estudiar la Biblia y acompañarnos como
                familia, en el auditorio y en grupos en casas por toda la ciudad.
              </p>
            )}
          </div>
          {config.nosotros_mision && (
            <div className="mt-2 rounded-(--radius-frame) bg-accent-soft p-[clamp(1.25rem,3vw,2rem)]">
              <p className="eyebrow text-accent-strong">Misión</p>
              <p className="mt-3 font-display text-h2 leading-snug whitespace-pre-line text-ink">
                {config.nosotros_mision}
              </p>
            </div>
          )}
        </div>
      </section>

      {creencias.length > 0 && (
        <section aria-labelledby="creencias" className="section-flow">
          <SectionHeading
            id="creencias"
            eyebrow="Fe"
            title={
              <>
                En qué <em>creemos</em>
              </>
            }
          />
          <ol className="grid gap-x-[clamp(1.5rem,4vw,3.5rem)] md:grid-cols-2">
            {creencias.map((c, i) => (
              <li key={i} className="flex reveal gap-5 border-t border-line py-6">
                <span
                  aria-hidden="true"
                  className="w-[2.2ch] shrink-0 font-display text-[clamp(2rem,1.5rem+2vw,3rem)] leading-none font-extrabold tracking-tighter text-accent tabular-nums"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex flex-col gap-2">
                  {c.titulo && <h3 className="font-headline text-h2 text-ink">{c.titulo}</h3>}
                  <p className="whitespace-pre-line text-ink-soft">{c.texto}</p>
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {team.length > 0 && (
        <section aria-labelledby="equipo" className="section-flow">
          <SectionHeading
            id="equipo"
            eyebrow="Equipo"
            title={
              <>
                Quienes <em>sirven</em>
              </>
            }
          />
          {pastores.length > 0 && (
            <ul className="grid gap-[clamp(1rem,3vw,2rem)] lg:grid-cols-2">
              {pastores.map((p) => (
                <PersonCard key={p.id} person={p} featured />
              ))}
            </ul>
          )}
          {lideres.length > 0 && (
            <ul className="grid gap-3 xs:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]">
              {lideres.map((p) => (
                <PersonCard key={p.id} person={p} />
              ))}
            </ul>
          )}
        </section>
      )}

      <section
        aria-labelledby="visitanos"
        className="relative isolate flex reveal flex-col gap-6 overflow-hidden rounded-(--radius-frame) bg-accent p-[clamp(1.75rem,5vw,3.5rem)] text-surface on-dark lg:flex-row lg:items-end lg:justify-between"
      >
        <span
          aria-hidden="true"
          className="absolute -right-20 -bottom-32 -z-10 size-96 rounded-full bg-accent-strong"
        />
        <div className="flex max-w-xl flex-col gap-3">
          <h2 id="visitanos" className="font-headline text-section">
            Ven a <em>conocernos</em>
          </h2>
          <p className="text-lead text-surface/90">
            No necesitas nada especial para visitarnos. Te esperamos.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            href="/soy-nuevo"
            className={buttonClasses({ variant: 'primary', size: 'lg', shape: 'pill' })}
          >
            Es mi primera vez
          </Link>
          {content.horarios ? (
            <Link
              href="/reuniones"
              className={buttonClasses({ variant: 'inverseOutline', size: 'lg', shape: 'pill' })}
            >
              <Icon name="clock" className="size-5" /> Horarios
            </Link>
          ) : (
            directions && (
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({ variant: 'inverseOutline', size: 'lg', shape: 'pill' })}
              >
                <Icon name="mapPin" className="size-5" /> Cómo llegar
                <span className="sr-only"> (abre Google Maps en una pestaña nueva)</span>
              </a>
            )
          )}
        </div>
      </section>
    </div>
  );
}
