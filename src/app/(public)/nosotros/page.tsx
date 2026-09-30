import Image from 'next/image';
import Link from 'next/link';
import { buttonClasses } from '@/components/button-styles';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { getSiteConfig } from '@/lib/config';
import { parseCreencias } from '@/lib/config-fields';
import { type EquipoRow, listEquipoVisible } from '@/lib/equipo';
import { pageMetadata } from '@/lib/seo';
import { paragraphs } from '@/lib/text';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Nosotros',
  description:
    'Quiénes somos: la historia, la visión y lo que cree la Iglesia Bíblica Riobamba, y las personas que la sirven.',
  path: '/nosotros',
});

function Person({ person, featured }: { person: EquipoRow; featured: boolean }) {
  return (
    <li
      className={`flex gap-4 rounded-2xl bg-surface ring-1 ring-line/70 ${
        featured ? 'flex-col p-[clamp(1rem,3vw,1.5rem)] xs:flex-row' : 'items-center p-3'
      }`}
    >
      <span
        className={`relative shrink-0 overflow-hidden rounded-full bg-brand-soft ${
          featured ? 'size-[clamp(5rem,20vw,7rem)]' : 'size-14'
        }`}
      >
        {person.foto_url ? (
          <Image
            src={person.foto_url}
            alt=""
            fill
            sizes={featured ? '112px' : '56px'}
            className="object-cover"
          />
        ) : (
          <span className="grid size-full place-items-center font-display text-h2 text-brand-strong">
            {person.nombre.charAt(0)}
          </span>
        )}
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className={`font-display font-semibold text-ink ${featured ? 'text-h3' : ''}`}>
          {person.nombre}
        </span>
        <span className="text-sm font-semibold text-accent-strong">{person.rol}</span>
        {featured && person.bio && <span className="text-ink-soft">{person.bio}</span>}
      </span>
    </li>
  );
}

export default async function NosotrosPage() {
  const [config, team] = await Promise.all([getSiteConfig(), listEquipoVisible()]);
  const historia = paragraphs(config.nosotros_historia);
  const creencias = parseCreencias(config.nosotros_creencias);
  const pastores = team.filter((p) => p.es_pastor);
  const lideres = team.filter((p) => !p.es_pastor);
  const years = config.anio_fundacion
    ? new Date().getFullYear() - Number(config.anio_fundacion)
    : null;

  return (
    <div className="container-page flex flex-col gap-[clamp(2rem,6vw,4rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <PageHeader
        eyebrow="Nosotros"
        title="Quiénes somos"
        intro={`${config.nombre_iglesia}: una familia que se reúne en Riobamba para conocer a Dios por medio de la Biblia y vivirla juntos.`}
      />

      <section
        aria-labelledby="historia"
        className="grid gap-[clamp(1.25rem,3vw,2.5rem)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start"
      >
        <div className="flex flex-col gap-4">
          {config.nosotros_imagen && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sunken">
              <Image
                src={config.nosotros_imagen}
                alt={`Congregación de ${config.nombre_iglesia}`}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
          <Card tone="brand" emphasis="featured">
            {years !== null && years > 0 && (
              <p className="font-display text-display leading-none font-semibold">
                {years} <span className="text-h2">años</span>
              </p>
            )}
            {config.anio_fundacion && (
              <p className="mt-1 text-surface/80">Desde {config.anio_fundacion} en Riobamba</p>
            )}
            {config.vision && (
              <>
                <p className="mt-5 text-sm font-semibold tracking-widest text-accent-soft uppercase">
                  Visión
                </p>
                <p className="mt-1 font-display text-h3 leading-snug">«{config.vision}»</p>
              </>
            )}
          </Card>
        </div>
        <div className="flex max-w-prose flex-col gap-4">
          <h2 id="historia" className="text-h2 font-semibold text-brand-strong">
            Nuestra historia
          </h2>
          {historia.length > 0 ? (
            historia.map((p, i) => (
              <p key={i} className="whitespace-pre-line text-ink">
                {p}
              </p>
            ))
          ) : (
            <p className="text-ink">
              {config.nombre_iglesia} se reúne
              {config.anio_fundacion ? ` desde ${config.anio_fundacion}` : ''} en Riobamba. Cada
              semana nos encontramos para adorar a Dios, estudiar la Biblia y acompañarnos como
              familia, en el auditorio y en grupos en casas por toda la ciudad.
            </p>
          )}
          {config.nosotros_mision && (
            <Card tone="accent">
              <p className="text-sm font-semibold tracking-widest text-accent-strong uppercase">
                Misión
              </p>
              <p className="mt-1 whitespace-pre-line">{config.nosotros_mision}</p>
            </Card>
          )}
        </div>
      </section>

      {creencias.length > 0 && (
        <section aria-labelledby="creencias" className="flex flex-col gap-4">
          <h2 id="creencias" className="text-h2 font-semibold text-brand-strong">
            En qué creemos
          </h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {creencias.map((c, i) => (
              <li
                key={i}
                className={`rounded-2xl p-[clamp(1rem,3vw,1.5rem)] ${
                  i === 0
                    ? 'bg-sunken md:col-span-2'
                    : 'border-l-4 border-accent bg-surface ring-1 ring-line/70'
                }`}
              >
                {c.titulo && (
                  <h3
                    className={`font-display font-semibold text-ink ${i === 0 ? 'text-h2' : 'text-h3'}`}
                  >
                    {c.titulo}
                  </h3>
                )}
                <p className={`whitespace-pre-line text-ink-soft ${c.titulo ? 'mt-1' : ''}`}>
                  {c.texto}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {team.length > 0 && (
        <section aria-labelledby="equipo" className="flex flex-col gap-4">
          <h2 id="equipo" className="text-h2 font-semibold text-brand-strong">
            Quienes sirven
          </h2>
          {pastores.length > 0 && (
            <ul className="grid gap-4 lg:grid-cols-2">
              {pastores.map((p) => (
                <Person key={p.id} person={p} featured />
              ))}
            </ul>
          )}
          {lideres.length > 0 && (
            <ul className="grid gap-3 xs:grid-cols-2 lg:grid-cols-4">
              {lideres.map((p) => (
                <Person key={p.id} person={p} featured={false} />
              ))}
            </ul>
          )}
        </section>
      )}

      <section
        aria-labelledby="visitanos"
        className="flex flex-col gap-4 rounded-3xl bg-brand-strong p-[clamp(1.5rem,5vw,3rem)] text-surface on-dark md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2 id="visitanos" className="font-display text-h2 font-semibold">
            Ven a conocernos
          </h2>
          <p className="mt-1 text-surface/85">
            No necesitas nada especial para visitarnos. Te esperamos.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/soy-nuevo" className={buttonClasses({ variant: 'accent' })}>
            Es mi primera vez
          </Link>
          <Link href="/reuniones" className={buttonClasses({ variant: 'inverseOutline' })}>
            <Icon name="clock" className="size-4" /> Horarios
          </Link>
        </div>
      </section>
    </div>
  );
}
