import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { EventCard } from '@/components/site/EventCard';
import { listEventosByCategoria } from '@/lib/eventos';
import { pageMetadata } from '@/lib/seo';
import { CATEGORIAS, CategoriaTabs, categoriaTitle } from '../../CategoriaTabs';

export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIAS.map((c) => ({ categoria: c.value }));
}

type Props = { params: Promise<{ categoria: string }> };

export async function generateMetadata({ params }: Props) {
  const { categoria } = await params;
  const c = CATEGORIAS.find((x) => x.value === categoria);
  if (!c) return { title: 'Categoría no encontrada' };
  return pageMetadata({
    title: categoriaTitle(c),
    description: `${categoriaTitle(c)} de la Iglesia Bíblica Riobamba.`,
    path: `/eventos/categoria/${c.value}`,
  });
}

export default async function CategoriaPage({ params }: Props) {
  const { categoria } = await params;
  const c = CATEGORIAS.find((x) => x.value === categoria);
  if (!c) notFound();
  const [first, ...rest] = await listEventosByCategoria(c.value, 30);
  return (
    <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,3rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <PageHeader size="display" eyebrow="Eventos y noticias" title={categoriaTitle(c)} />
      <CategoriaTabs active={c.value} />
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
