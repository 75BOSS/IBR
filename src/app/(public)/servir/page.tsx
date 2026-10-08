import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { FormDialog } from '@/components/site/FormDialog';
import { FormPanel } from '@/components/site/FormPanel';
import { SectionHeading } from '@/components/site/SectionHeading';
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
    <div className="container-page page-flow">
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
        <section aria-labelledby="areas" className="section-flow">
          <SectionHeading
            id="areas"
            title={
              <>
                Dónde puedes <em>servir</em>
              </>
            }
          />
          {/* La destacada ocupa 2×2 y las demás llenan alrededor: sin columnas de alto distinto
              que dejen un hueco al lado. En tablet, si al final queda una sola, ocupa la fila. */}
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-flow-dense lg:grid-cols-3 md:max-lg:[&>li:last-child:nth-child(even)]:col-span-2">
            <li className="md:col-span-2 lg:row-span-2">
              <Card
                as="article"
                tone="brand"
                emphasis="featured"
                className="flex h-full flex-col justify-end"
              >
                {featured.imagen_url && (
                  <div className="relative -mx-[clamp(1.25rem,4vw,2.5rem)] -mt-[clamp(1.25rem,4vw,2.5rem)] mb-4 aspect-[16/9] overflow-hidden">
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
                  <p key={i} className="mt-2 max-w-prose text-surface/85">
                    {p}
                  </p>
                ))}
                {featured.responsable && featured.responsable_visible && (
                  <p className="mt-3 text-sm text-accent-soft">A cargo de {featured.responsable}</p>
                )}
                <a
                  href={`/servir?area=${featured.slug}#quiero-servir`}
                  className="mt-4 inline-flex items-center link"
                >
                  Quiero servir aquí
                </a>
              </Card>
            </li>
            {rest.map((a) => (
              <li key={a.id}>
                <Card as="article" accentColor="var(--color-accent)" className="h-full">
                  <h3 className="card-title">{a.nombre}</h3>
                  {a.descripcion && (
                    <p className="mt-1 line-clamp-3 text-ink-soft">{a.descripcion}</p>
                  )}
                  <a
                    href={`/servir?area=${a.slug}#quiero-servir`}
                    className="mt-2 inline-flex text-sm link"
                  >
                    Quiero servir aquí
                  </a>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <Card tone="sunken">
          <p className="text-ink-soft">
            Estamos organizando las áreas de servicio.{' '}
            <Link href="/contacto#mensaje" className="link">
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
