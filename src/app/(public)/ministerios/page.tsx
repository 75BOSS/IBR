import Link from 'next/link';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { MinisteriosGrid } from '@/components/site/MinisterioCard';
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
    <div className="container-page page-flow">
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
            <Link href="/contacto#mensaje" className="link">
              Escríbenos
            </Link>{' '}
            y te contamos qué hay para tu edad.
          </p>
        </Card>
      ) : (
        <MinisteriosGrid ministerios={ministerios} />
      )}
    </div>
  );
}
