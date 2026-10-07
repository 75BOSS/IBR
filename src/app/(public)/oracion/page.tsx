import Link from 'next/link';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { FormDialog } from '@/components/site/FormDialog';
import { FormPanel } from '@/components/site/FormPanel';
import { OracionForm } from './OracionForm';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Pedir oración',
  description:
    'Cuéntanos por qué quieres que oremos. Los pastores de la Iglesia Bíblica Riobamba leen cada petición.',
  path: '/oracion',
});

export default function OracionPage() {
  return (
    <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,3rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <PageHeader
        size="display"
        eyebrow="Oración"
        title={
          <>
            ¿Cómo podemos <em>orar por ti</em>?
          </>
        }
        intro="Escríbenos lo que tengas en el corazón. Los pastores leen cada petición y oramos por ella."
      />
      <div className="grid gap-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <FormPanel
          titleId="escribir-peticion"
          eyebrow="Tu petición"
          title={
            <>
              Escríbenos, <em>oramos contigo</em>
            </>
          }
          text="Puedes enviarla con tu nombre o sin él. Si quieres, te escribimos para acompañarte."
          tone="brand"
          stacked
        >
          <FormDialog
            id="peticion"
            eyebrow="Oración"
            title={
              <>
                ¿Cómo podemos <em>orar por ti</em>?
              </>
            }
            description="Privada por defecto: solo la leen los pastores."
            triggerLabel="Escribir mi petición"
            triggerIcon="handHeart"
          >
            <OracionForm />
          </FormDialog>
        </FormPanel>
        <aside className="flex flex-col gap-4">
          <Card tone="brand" emphasis="featured">
            <p className="font-display text-h2 leading-snug font-semibold">
              «Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.»
            </p>
            <p className="mt-3 text-surface/80">1 Pedro 5:7</p>
          </Card>
          <Card tone="sunken">
            <ul className="flex flex-col gap-3 text-ink-soft">
              <li className="flex gap-3">
                <Icon name="lock" className="mt-0.5 size-5 shrink-0 text-brand-strong" />
                <span>
                  <strong className="text-ink">Privada por defecto.</strong> Solo la leen los
                  pastores, salvo que nos digas que se puede compartir.
                </span>
              </li>
              <li className="flex gap-3">
                <Icon name="users" className="mt-0.5 size-5 shrink-0 text-brand-strong" />
                <span>
                  <strong className="text-ink">No estás solo.</strong> En los{' '}
                  <Link href="/grupos" className="font-semibold text-brand-strong underline">
                    grupos en casas
                  </Link>{' '}
                  también oramos unos por otros.
                </span>
              </li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
