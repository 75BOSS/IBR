import Link from 'next/link';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { MinisterioCard, ministerioSpan } from '@/components/site/MinisterioCard';
import { listMinisterios } from '@/lib/ministerios';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Ministerios',
  description:
    'Un lugar para cada edad en la Iglesia Bíblica Riobamba: niños, adolescentes, jóvenes, adultos y adultos mayores.',
  path: '/ministerios',
});

export default async function MinisteriosPage() {
  const ministerios = await listMinisterios({ soloActivos: true, conContenido: true });
  return (
    <div className="container-page flex flex-col gap-[clamp(2rem,5vw,3.5rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <PageHeader
        size="display"
        eyebrow="Ministerios"
        title={
          <>
            Un lugar para <em>cada edad</em>
          </>
        }
        intro="Desde los más pequeños hasta los abuelos: cada edad tiene un espacio para crecer en la fe junto a otros."
      />
      {ministerios.length === 0 ? (
        <Card tone="sunken">
          <p className="text-ink-soft">
            Pronto contaremos aquí sobre cada ministerio.{' '}
            <Link href="/contacto#mensaje" className="font-semibold text-brand-strong underline">
              Escríbenos
            </Link>{' '}
            y te contamos qué hay para tu edad.
          </p>
        </Card>
      ) : (
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-6">
          {ministerios.map((m, i) => (
            <li key={m.id} className={`reveal ${ministerioSpan(i, ministerios.length)}`}>
              <MinisterioCard
                ministerio={m}
                featured={i < 2}
                sizes={i < 2 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 33vw, 50vw'}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
