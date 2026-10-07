import Link from 'next/link';
import { buttonClasses } from '@/components/button-styles';
import { Card } from '@/components/Card';
import { Field } from '@/components/Field';
import { PageHeader } from '@/components/PageHeader';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { GroupCard } from '@/components/site/GroupCard';
import { rangoOptions } from '@/lib/catalogs';
import { getSiteConfig } from '@/lib/config';
import { DAY_OPTIONS } from '@/lib/dates';
import { grupoFacets, listGruposPublicos } from '@/lib/grupos';
import type { GrupoPublico } from '@/lib/grupos-public';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Grupos',
  description:
    'Encuentra un grupo pequeño cerca de tu casa y para tu edad en la Iglesia Bíblica Riobamba.',
  path: '/grupos',
});

type Params = Record<string, string | string[] | undefined>;
const text = (v: string | string[] | undefined) =>
  typeof v === 'string' && v.trim() ? v.trim() : null;
const num = (v: string | string[] | undefined) => {
  const n = Number(text(v));
  return Number.isInteger(n) && n > 0 ? n : null;
};

export default async function GruposPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const filter = {
    zona: text(params.zona),
    dia: num(params.dia),
    rango: num(params.edad),
    tipo: text(params.tipo),
  };
  const [groups, facets, rangos, config] = await Promise.all([
    listGruposPublicos(filter),
    grupoFacets(),
    rangoOptions(),
    getSiteConfig(),
  ]);
  const filtered = Object.values(filter).some((v) => v !== null);
  const sections = new Map<string, { color: string | null; items: GrupoPublico[] }>();
  for (const g of groups) {
    const key = g.rango_edad ?? 'Para todas las edades';
    const section = sections.get(key) ?? { color: g.rango_color, items: [] };
    section.items.push(g);
    sections.set(key, section);
  }

  return (
    <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,3rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <PageHeader
        size="display"
        eyebrow="Comunidad"
        title={
          <>
            Grupos <em>en casa</em>
          </>
        }
        intro="La iglesia también se vive en casa. Busca un grupo cerca de ti y para tu edad, y únete."
      />

      <form
        method="get"
        action="/grupos"
        className="grid items-end gap-3 rounded-2xl bg-sunken/70 p-4 md:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]"
      >
        <Field
          as="select"
          label="Edad"
          name="edad"
          emptyOption="Todas"
          options={rangos}
          defaultValue={filter.rango ? String(filter.rango) : ''}
        />
        <Field
          as="select"
          label="Zona"
          name="zona"
          emptyOption="Todas"
          options={facets.zonas.map((z) => ({ value: z, label: z }))}
          defaultValue={filter.zona ?? ''}
        />
        <Field
          as="select"
          label="Día"
          name="dia"
          emptyOption="Cualquiera"
          options={DAY_OPTIONS}
          defaultValue={filter.dia ? String(filter.dia) : ''}
        />
        <Field
          as="select"
          label="Tipo"
          name="tipo"
          emptyOption="Todos"
          options={facets.tipos.map((t) => ({ value: t, label: t }))}
          defaultValue={filter.tipo ?? ''}
        />
        <div className="flex gap-2 md:col-span-2 xl:col-span-1">
          <button type="submit" className={buttonClasses({ className: 'flex-1 xl:flex-none' })}>
            Buscar
          </button>
          {filtered && (
            <Link href="/grupos" className={buttonClasses({ variant: 'ghost' })}>
              Limpiar
            </Link>
          )}
        </div>
      </form>

      {groups.length === 0 ? (
        <Card tone="sunken">
          <div className="flex flex-col items-start gap-3">
            <p className="text-lg text-ink">
              {filtered
                ? 'No encontramos grupos con esos filtros.'
                : 'Pronto publicaremos los grupos.'}{' '}
              Escríbenos y te ayudamos a encontrar uno.
            </p>
            <WhatsAppButton
              number={config.whatsapp}
              message="Hola, quiero unirme a un grupo. ¿Me ayudan a encontrar uno?"
            />
          </div>
        </Card>
      ) : (
        [...sections.entries()].map(([title, section]) => (
          <section key={title} aria-labelledby={`seccion-${title}`} className="flex flex-col gap-4">
            <h2
              id={`seccion-${title}`}
              className="flex items-center gap-3 font-headline text-h1 text-ink"
            >
              <span
                className="h-8 w-1.5 rounded-full"
                style={{ backgroundColor: section.color ?? 'var(--color-brand)' }}
                aria-hidden="true"
              />
              {title}
              <span className="font-sans text-base font-normal text-ink-soft">
                ({section.items.length})
              </span>
            </h2>
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {section.items.map((g) => (
                <li key={g.id}>
                  <GroupCard group={g} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
