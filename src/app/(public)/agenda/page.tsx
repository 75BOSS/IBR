import { Card } from '@/components/Card';
import { Icon, type IconName } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { FormDialog } from '@/components/site/FormDialog';
import { FormPanel } from '@/components/site/FormPanel';
import { pageMetadata } from '@/lib/seo';
import { getSiteContent } from '@/lib/site-content';
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

export default async function AgendaPage() {
  // Sin correo saliente la confirmación no llegaría: se avisa en vez de ofrecer el formulario.
  const { agenda: canSend } = await getSiteContent();
  return (
    <div className="container-page page-flow">
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
      <div className="grid gap-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-aside-main lg:items-start">
        <Card tone="sunken" as="section">
          <h2 className="card-title">Qué vas a recibir</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {POINTS.map((p) => (
              <li key={p.text} className="flex gap-3 text-ink-soft">
                <Icon name={p.icon} className="mt-0.5 size-5 shrink-0 text-brand-strong" />
                {p.text}
              </li>
            ))}
          </ul>
        </Card>
        <FormPanel
          titleId="suscribirme-titulo"
          eyebrow="Gratis"
          title={
            <>
              Recíbela <em>cada semana</em>
            </>
          }
          text={
            canSend
              ? 'Solo tu correo. Te llega un mensaje para confirmar y listo.'
              : 'Muy pronto podrás suscribirte: estamos preparando el envío por correo.'
          }
        >
          {canSend && (
            <FormDialog
              id="suscribirme"
              eyebrow="Agenda semanal"
              title={
                <>
                  Lo que viene, <em>en tu correo</em>
                </>
              }
              triggerLabel="Quiero recibirla"
              triggerIcon="mail"
              triggerVariant="primary"
            >
              <SuscripcionForm />
            </FormDialog>
          )}
        </FormPanel>
      </div>
    </div>
  );
}
