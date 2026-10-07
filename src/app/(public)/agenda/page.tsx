import { Card } from '@/components/Card';
import { Icon, type IconName } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { pageMetadata } from '@/lib/seo';
import { SuscripcionForm } from './SuscripcionForm';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Agenda semanal',
  description:
    'Recibe cada semana por correo los eventos y reuniones de la Iglesia Bíblica Riobamba.',
  path: '/agenda',
});

const POINTS: { icon: IconName; text: string }[] = [
  { icon: 'calendar', text: 'Los eventos de los próximos 7 días, con fecha, hora y lugar.' },
  { icon: 'clock', text: 'Los horarios de las reuniones de cada semana.' },
  { icon: 'mail', text: 'Un correo por semana, como máximo. Te das de baja con un clic.' },
];

export default function AgendaPage() {
  return (
    <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,3rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <PageHeader
        size="display"
        eyebrow="Agenda semanal"
        title={
          <>
            Lo que viene, <em>en tu correo</em>
          </>
        }
        intro="Suscríbete y te contamos cada semana qué pasa en la iglesia, para que no te pierdas nada."
      />
      <div className="grid gap-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start">
        <Card tone="sunken" as="section">
          <h2 className="font-display text-h3 font-medium text-ink">Qué vas a recibir</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {POINTS.map((p) => (
              <li key={p.text} className="flex gap-3 text-ink-soft">
                <Icon name={p.icon} className="mt-0.5 size-5 shrink-0 text-brand-strong" />
                {p.text}
              </li>
            ))}
          </ul>
        </Card>
        <Card emphasis="featured">
          <SuscripcionForm />
        </Card>
      </div>
    </div>
  );
}
