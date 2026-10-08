import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { confirmarSuscripcion, darseDeBaja } from '@/actions/agenda';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { ActionButton } from '@/components/ActionButton';
import { EmailText } from '@/components/EmailText';
import { getSuscriptorByToken } from '@/lib/agenda';

export const dynamic = 'force-dynamic';

// Página personal (el enlace funciona como llave): no se indexa.
export const metadata: Metadata = {
  title: 'Mi suscripción a la agenda',
  robots: { index: false, follow: false },
};

/**
 * Confirmar o darse de baja se hace con un botón y no al abrir el enlace: algunos programas de
 * correo abren los enlaces solos para revisarlos, y eso no debe suscribir ni dar de baja a nadie.
 */
export default async function SuscripcionPage({ params }: { params: Promise<{ token: string }> }) {
  const s = await getSuscriptorByToken((await params).token);
  if (!s) notFound();
  const pending = !s.activo && !s.baja_en;

  return (
    <div className="container-page page-flow">
      <PageHeader
        size="display"
        eyebrow="Agenda semanal"
        title={
          <>
            Tu <em>suscripción</em>
          </>
        }
      />
      <Card emphasis="featured" className="max-w-xl">
        <p className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">
            <EmailText email={s.email} />
          </span>
          {s.activo ? (
            <Tag tone="success">Suscrito</Tag>
          ) : pending ? (
            <Tag tone="warning">Falta confirmar</Tag>
          ) : (
            <Tag>Dado de baja</Tag>
          )}
        </p>
        <p className="mt-3 text-ink-soft">
          {s.activo
            ? 'Recibes la agenda de la iglesia cada semana.'
            : pending
              ? 'Confirma que quieres recibir la agenda de la iglesia cada semana.'
              : 'Ya no recibes la agenda. Si quieres volver, suscríbete de nuevo aquí.'}
        </p>
        <div className="mt-5">
          {s.activo ? (
            <ActionButton action={darseDeBaja} fields={{ token: s.token }} variant="secondary">
              Dejar de recibir la agenda
            </ActionButton>
          ) : (
            <ActionButton
              action={confirmarSuscripcion}
              fields={{ token: s.token }}
              variant="primary"
            >
              {pending ? 'Confirmar suscripción' : 'Volver a suscribirme'}
            </ActionButton>
          )}
        </div>
      </Card>
    </div>
  );
}
