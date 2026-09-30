import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setInscripcionEstado } from '@/actions/inscripciones';
import { buttonClasses } from '@/components/button-styles';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { type Column, DataTable } from '@/components/DataTable';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { ActionButton } from '@/components/admin/ActionButton';
import { ContactLinks } from '@/components/admin/ContactLinks';
import { eventWhen } from '@/components/site/EventCard';
import { requireAdmin } from '@/lib/auth';
import { cupoStatus, disponiblesText } from '@/lib/cupo';
import { formatDateTime } from '@/lib/dates';
import { getEvento } from '@/lib/eventos';
import { type Inscripcion, listInscripciones } from '@/lib/inscripciones';
import { id as idSchema } from '@/lib/validators/common';

export const metadata: Metadata = { title: 'Inscritos' };

const ESTADO = {
  confirmada: <Tag tone="success">Confirmada</Tag>,
  asistio: <Tag tone="brand">Asistió</Tag>,
  cancelada: <Tag tone="danger">Cancelada</Tag>,
};

export default async function InscritosPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const parsed = idSchema.safeParse((await params).id);
  if (!parsed.success) notFound();
  const [event, rows] = await Promise.all([
    getEvento({ id: parsed.data }),
    listInscripciones(parsed.data),
  ]);
  if (!event) notFound();
  const status = cupoStatus(event);

  const columns: Column<Inscripcion>[] = [
    {
      key: 'persona',
      header: 'Persona',
      primary: true,
      cell: (i) => (
        <ContactLinks
          nombre={i.nombre}
          telefono={i.telefono}
          email={i.email}
          saludo={`Hola ${i.nombre}, te escribimos de la Iglesia Bíblica Riobamba por tu inscripción a «${event.titulo}».`}
        />
      ),
    },
    { key: 'personas', header: 'Personas', className: 'md:w-24', cell: (i) => i.personas },
    {
      key: 'codigo',
      header: 'Código',
      className: 'md:w-32',
      cell: (i) => <span className="font-mono font-semibold tracking-wider">{i.codigo}</span>,
    },
    { key: 'estado', header: 'Estado', className: 'md:w-32', cell: (i) => ESTADO[i.estado] },
    {
      key: 'fecha',
      header: 'Se inscribió',
      className: 'md:w-36',
      cell: (i) => formatDateTime(i.creado_en, { dateStyle: 'medium' }),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      hideLabelOnMobile: true,
      className: 'md:w-60',
      cell: (i) => (
        <span className="flex flex-wrap gap-2">
          {i.estado === 'confirmada' && (
            <ActionButton
              action={setInscripcionEstado}
              fields={{ id: String(i.id), estado: 'asistio' }}
              icon={<Icon name="check" className="size-4" />}
            >
              Asistió
            </ActionButton>
          )}
          {i.estado !== 'confirmada' && (
            <ActionButton
              action={setInscripcionEstado}
              fields={{ id: String(i.id), estado: 'confirmada' }}
              variant="ghost"
            >
              Volver a confirmada
            </ActionButton>
          )}
          {i.estado === 'confirmada' && (
            <ConfirmDialog
              action={setInscripcionEstado}
              fields={{ id: String(i.id), estado: 'cancelada' }}
              title={`¿Cancelar la inscripción de ${i.nombre}?`}
              description={`Se liberan ${i.personas === 1 ? '1 lugar' : `${i.personas} lugares`}. Avísale por WhatsApp si no lo pidió.`}
              triggerLabel="Cancelar"
              triggerIcon="close"
              confirmLabel="Sí, cancelar"
              pendingLabel="Cancelando…"
            />
          )}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 container-panel">
      <Link
        href="/admin/eventos"
        className="inline-flex items-center gap-1 self-start font-semibold text-brand-strong hover:underline"
      >
        <Icon name="chevronLeft" className="size-4" /> Eventos
      </Link>
      <PageHeader
        eyebrow={`Inscritos · ${eventWhen(event)}`}
        title={event.titulo}
        intro={
          event.requiere_inscripcion
            ? `${status.inscritos} ${status.inscritos === 1 ? 'lugar ocupado' : 'lugares ocupados'}${event.cupo !== null ? ` de ${event.cupo}` : ''} · ${disponiblesText(status)}${status.abierto ? '' : ` · ${status.motivo}`}`
            : 'Este evento ya no pide inscripción en el sitio; abajo quedan las que llegaron antes.'
        }
        actions={
          rows.length > 0 && (
            <a
              href={`/admin/eventos-inscritos-csv/${event.id}`}
              className={buttonClasses({ variant: 'secondary' })}
            >
              <Icon name="download" className="size-4" /> Exportar CSV
            </a>
          )
        }
      />
      <DataTable
        caption={`Inscritos a ${event.titulo}`}
        columns={columns}
        rows={rows}
        rowKey={(i) => i.id}
        empty="Todavía no se inscribe nadie. Comparte el enlace del evento por WhatsApp."
      />
    </div>
  );
}
