import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { FormDialog } from '@/components/site/FormDialog';
import { FormPanel } from '@/components/site/FormPanel';
import { listAreas } from '@/lib/servir';
import { pageMetadata } from '@/lib/seo';
import { paragraphs } from '@/lib/text';
import { ServirForm } from './ServirForm';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Servir',
  description:
    'Pon tus dones al servicio de otros en la Iglesia Bíblica Riobamba: alabanza, niños, bienvenida y más.',
  path: '/servir',
});

export default async function ServirPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}) {
  const [areas, { area: areaSlug }] = await Promise.all([
    listAreas({ soloActivas: true }),
    searchParams,
  ]);
  const preselected = areas.find((a) => a.slug === areaSlug);
  const [featured, ...rest] = areas;

  return (
    <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,3rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <PageHeader
        size="display"
        eyebrow="Servir"
        title={
          <>
            Hay un lugar <em>para ti</em>
          </>
        }
        intro="Servir es una forma de amar a Dios y a los demás. No necesitas experiencia: te acompañamos mientras aprendes."
      />

      {featured ? (
        <section aria-labelledby="areas" className="flex flex-col gap-4">
          <h2 id="areas" className="font-headline text-h1 text-brand-strong">
            Dónde puedes servir
          </h2>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
            <Card as="article" tone="brand" emphasis="featured">
              {featured.imagen_url && (
                <div className="relative -mx-[clamp(1.25rem,4vw,2rem)] -mt-[clamp(1.25rem,4vw,2rem)] mb-4 aspect-[16/9] overflow-hidden rounded-t-2xl">
                  <Image
                    src={featured.imagen_url}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <h3 className="font-headline text-h1">{featured.nombre}</h3>
              {paragraphs(featured.descripcion).map((p, i) => (
                <p key={i} className="mt-2 text-surface/85">
                  {p}
                </p>
              ))}
              {featured.responsable && featured.responsable_visible && (
                <p className="mt-3 text-sm text-accent-soft">A cargo de {featured.responsable}</p>
              )}
              <a
                href={`/servir?area=${featured.slug}#quiero-servir`}
                className="mt-4 inline-flex items-center font-semibold underline decoration-accent-soft underline-offset-4"
              >
                Quiero servir aquí
              </a>
            </Card>
            {rest.length > 0 && (
              <ul className="flex flex-col gap-3">
                {rest.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-2xl border-l-4 border-accent bg-surface p-4 ring-1 ring-line/70"
                  >
                    <h3 className="font-display text-h3 font-medium text-ink">{a.nombre}</h3>
                    {a.descripcion && (
                      <p className="mt-1 line-clamp-3 text-ink-soft">{a.descripcion}</p>
                    )}
                    <a
                      href={`/servir?area=${a.slug}#quiero-servir`}
                      className="mt-2 inline-flex text-sm font-semibold text-brand-strong underline underline-offset-4"
                    >
                      Quiero servir aquí
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ) : (
        <Card tone="sunken">
          <p className="text-ink-soft">
            Estamos organizando las áreas de servicio.{' '}
            <Link href="/contacto#mensaje" className="font-semibold text-brand-strong underline">
              Escríbenos un mensaje
            </Link>{' '}
            contándonos qué te gustaría hacer y te avisamos.
          </p>
        </Card>
      )}

      {areas.length > 0 && (
        <FormPanel
          titleId="quiero-servir-titulo"
          eyebrow="Da el paso"
          title={
            <>
              Quiero <em>servir</em>
            </>
          }
          text="Déjanos tus datos y el área que te interesa. Te escribiremos para conocerte y contarte los siguientes pasos."
        >
          <FormDialog
            id="quiero-servir"
            eyebrow="Servir"
            title={
              <>
                Quiero <em>servir</em>
              </>
            }
            description="No necesitas experiencia: te acompañamos mientras aprendes."
            triggerLabel="Quiero servir"
            triggerVariant="primary"
          >
            {/* key: al elegir otra área desde un enlace, el formulario arranca con esa área. */}
            <ServirForm
              key={preselected?.id ?? 'ninguna'}
              areas={areas.map((a) => ({ value: String(a.id), label: a.nombre }))}
              preselected={preselected ? String(preselected.id) : undefined}
            />
          </FormDialog>
        </FormPanel>
      )}
    </div>
  );
}
