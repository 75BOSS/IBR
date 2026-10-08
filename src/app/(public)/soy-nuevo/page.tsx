import Link from 'next/link';
import { Card } from '@/components/Card';
import { Icon, type IconName } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { FormDialog } from '@/components/site/FormDialog';
import { FormPanel } from '@/components/site/FormPanel';
import { MinisteriosGrid } from '@/components/site/MinisterioCard';
import { SectionHeading } from '@/components/site/SectionHeading';
import { rangoOptions } from '@/lib/catalogs';
import { getSiteConfig } from '@/lib/config';
import { directionsUrl } from '@/lib/maps';
import { listMinisterios } from '@/lib/ministerios';
import { pageMetadata } from '@/lib/seo';
import { getSiteContent } from '@/lib/site-content';
import { SoyNuevoForm } from './SoyNuevoForm';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Soy nuevo',
  description:
    '¿Es tu primera vez en la Iglesia Bíblica Riobamba? Te contamos qué esperar y cómo conectar.',
  path: '/soy-nuevo',
});

const EXPECT: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'handHeart',
    title: 'Te recibimos',
    text: 'Alguien del equipo te dará la bienvenida en la puerta. Ven tal como eres.',
  },
  {
    icon: 'clock',
    title: 'Cerca de dos horas',
    text: 'Cantamos, oramos y escuchamos una prédica de la Biblia aplicada a la vida diaria.',
  },
  {
    icon: 'users',
    title: 'Hay lugar para tu familia',
    text: 'Los niños tienen su propio espacio con maestros mientras los adultos están en el culto.',
  },
];

export default async function SoyNuevoPage() {
  const [rangos, ministerios, content, config] = await Promise.all([
    rangoOptions(),
    listMinisterios({ soloActivos: true, conContenido: true }),
    getSiteContent(),
    getSiteConfig(),
  ]);
  const directions = directionsUrl(config.maps_url, config.direccion);
  const nextSteps = [
    ...(content.horarios ? [{ href: '/reuniones', label: 'Ver los horarios' }] : []),
    ...(content.grupos ? [{ href: '/grupos', label: 'Buscar un grupo cerca' }] : []),
  ];
  const linkClass = 'link mt-6 inline-flex items-center gap-1.5';
  return (
    <div className="container-page page-flow">
      <PageHeader
        size="display"
        eyebrow="Bienvenido"
        title={
          <>
            ¿Es tu <em>primera vez</em>?
          </>
        }
        intro="Nos alegra que estés aquí. Esto es lo que puedes esperar, y abajo puedes dejarnos tus datos para acompañarte."
      />

      <section aria-labelledby="que-esperar" className="grid gap-4 lg:grid-cols-aside-main">
        <h2 id="que-esperar" className="sr-only">
          Qué esperar
        </h2>
        <Card tone="brand" emphasis="featured">
          <p className="font-display text-h2 leading-snug font-semibold">
            «Nadie tiene mayor amor que este, que uno ponga su vida por sus amigos.»
          </p>
          <p className="mt-3 text-surface/80">Juan 15:13</p>
          {content.horarios ? (
            <Link href="/reuniones" className={linkClass}>
              Ver horarios y cómo llegar <Icon name="arrowRight" className="size-4" />
            </Link>
          ) : (
            directions && (
              <a href={directions} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Cómo llegar <Icon name="external" className="size-4" />
                <span className="sr-only"> (abre Google Maps en una pestaña nueva)</span>
              </a>
            )
          )}
        </Card>
        {/* Tablet: las tres en fila, con el ícono arriba; escritorio: en la columna de al lado. */}
        <ul className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
          {EXPECT.map((item) => (
            <li
              key={item.title}
              className="flex gap-4 rounded-2xl bg-surface p-4 ring-1 ring-line/70 md:max-lg:flex-col md:max-lg:gap-3"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong">
                <Icon name={item.icon} />
              </span>
              <span>
                <span className="block font-semibold text-ink">{item.title}</span>
                <span className="text-ink-soft">{item.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {ministerios.length > 0 && (
        <section aria-labelledby="ministerios" className="section-flow">
          <SectionHeading
            id="ministerios"
            eyebrow="Ministerios"
            title={
              <>
                Un lugar para <em>cada edad</em>
              </>
            }
          />
          <MinisteriosGrid ministerios={ministerios} />
        </section>
      )}

      <FormPanel
        titleId="dejanos-tus-datos"
        eyebrow="Te acompañamos"
        title={
          <>
            Queremos <em>conocerte</em>
          </>
        }
        text="Déjanos tus datos y alguien de la iglesia te escribirá para darte la bienvenida, resolver tus dudas y ayudarte a encontrar un grupo. No te enviaremos publicidad."
      >
        <FormDialog
          id="mis-datos"
          eyebrow="Soy nuevo"
          title={
            <>
              Queremos <em>conocerte</em>
            </>
          }
          description="Solo el nombre y el WhatsApp son obligatorios."
          triggerLabel="Dejar mis datos"
          triggerVariant="primary"
        >
          <SoyNuevoForm rangos={rangos} nextSteps={nextSteps} />
        </FormDialog>
      </FormPanel>
    </div>
  );
}
