import type { Metadata } from 'next';
import { deleteContacto, toggleContactoLeido } from '@/actions/mensajes';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { type Column, DataTable } from '@/components/DataTable';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { ActionButton } from '@/components/ActionButton';
import { ContactLinks } from '@/components/admin/ContactLinks';
import { FilterTabs } from '@/components/admin/FilterTabs';
import { requireAdmin } from '@/lib/auth';
import { formatDateTime } from '@/lib/dates';
import { type Contacto, countContactos, listContactos } from '@/lib/mensajes';

export const metadata: Metadata = { title: 'Mensajes' };

export default async function MensajesPage({
  searchParams,
}: {
  searchParams: Promise<{ ver?: string }>;
}) {
  const admin = await requireAdmin();
  const leidos = (await searchParams).ver === 'leidos';
  const [rows, counts] = await Promise.all([listContactos(leidos), countContactos()]);

  const columns: Column<Contacto>[] = [
    {
      key: 'mensaje',
      header: 'Mensaje',
      primary: true,
      cell: (c) => <span className="whitespace-pre-line">{c.mensaje}</span>,
    },
    {
      key: 'persona',
      header: 'De',
      className: 'md:w-56',
      cell: (c) => (
        <ContactLinks
          nombre={c.nombre}
          telefono={c.telefono}
          email={c.email}
          saludo={`Hola ${c.nombre}, te respondemos de la Iglesia Bíblica Riobamba.`}
        />
      ),
    },
    {
      key: 'fecha',
      header: 'Llegó',
      className: 'md:w-40',
      cell: (c) => formatDateTime(c.creado_en, { dateStyle: 'medium', timeStyle: 'short' }),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      hideLabelOnMobile: true,
      className: 'md:w-48',
      cell: (c) => (
        <span className="flex flex-wrap items-start gap-2">
          <ActionButton
            action={toggleContactoLeido}
            fields={{ id: String(c.id), leido: c.leido ? '0' : '1' }}
            variant={c.leido ? 'ghost' : 'secondary'}
            icon={<Icon name={c.leido ? 'mail' : 'mailOpen'} className="size-4" />}
          >
            {c.leido ? 'Marcar no leído' : 'Marcar leído'}
          </ActionButton>
          {admin.rol === 'admin' && (
            <ConfirmDialog
              action={deleteContacto}
              fields={{ id: String(c.id) }}
              title={`¿Eliminar el mensaje de ${c.nombre}?`}
              description="Se borra por completo, con sus datos de contacto. No se puede deshacer."
              triggerLabel="Eliminar"
            />
          )}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 container-panel">
      <PageHeader
        eyebrow="Panel"
        title="Mensajes"
        intro="Lo que llega desde la página «Contacto». Responde por WhatsApp o correo y márcalo como leído."
      />
      <FilterTabs
        label="Filtrar mensajes"
        tabs={[
          { label: 'Sin leer', href: '/admin/mensajes', count: counts.no, active: !leidos },
          {
            label: 'Leídos',
            href: '/admin/mensajes?ver=leidos',
            count: counts.si,
            active: leidos,
          },
        ]}
      />
      <DataTable
        caption={leidos ? 'Mensajes leídos' : 'Mensajes sin leer'}
        columns={columns}
        rows={rows}
        rowKey={(c) => c.id}
        empty={leidos ? 'Todavía no hay mensajes leídos.' : '¡Al día! No hay mensajes sin leer.'}
      />
    </div>
  );
}
