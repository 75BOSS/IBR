import type { Metadata } from 'next';
import { deletePeticion, togglePeticionAtendida } from '@/actions/mensajes';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { type Column, DataTable } from '@/components/DataTable';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { ActionButton } from '@/components/admin/ActionButton';
import { ContactLinks } from '@/components/admin/ContactLinks';
import { FilterTabs } from '@/components/admin/FilterTabs';
import { requireAdmin } from '@/lib/auth';
import { formatDateTime } from '@/lib/dates';
import { type Peticion, countPeticiones, listPeticiones } from '@/lib/mensajes';

export const metadata: Metadata = { title: 'Peticiones de oración' };

export default async function PeticionesPage({
  searchParams,
}: {
  searchParams: Promise<{ ver?: string }>;
}) {
  const admin = await requireAdmin();
  const atendidas = (await searchParams).ver === 'atendidas';
  const [rows, counts] = await Promise.all([
    listPeticiones(atendidas, admin.rol === 'admin'),
    countPeticiones(),
  ]);

  const columns: Column<Peticion>[] = [
    {
      key: 'peticion',
      header: 'Petición',
      primary: true,
      cell: (p) => (
        <span className="flex flex-col gap-2">
          {p.texto !== null ? (
            <span className="whitespace-pre-line">{p.texto}</span>
          ) : (
            <span className="text-ink-soft italic">
              Petición privada: solo la pueden leer los pastores (administradores).
            </span>
          )}
          <span className="flex flex-wrap gap-1.5">
            {p.es_privada ? (
              <Tag tone="accent">
                <Icon name="lock" className="size-3.5" /> Solo pastores
              </Tag>
            ) : (
              <Tag tone="brand">Se puede compartir</Tag>
            )}
          </span>
        </span>
      ),
    },
    {
      key: 'persona',
      header: 'De',
      className: 'md:w-56',
      cell: (p) =>
        p.texto === null ? (
          <span className="text-ink-soft">Reservado</span>
        ) : p.nombre || p.telefono || p.email ? (
          <ContactLinks
            nombre={p.nombre}
            telefono={p.telefono}
            email={p.email}
            saludo={`Hola${p.nombre ? ` ${p.nombre}` : ''}, te escribimos de la Iglesia Bíblica Riobamba por tu petición de oración.`}
          />
        ) : (
          <span className="text-ink-soft">Anónima</span>
        ),
    },
    {
      key: 'fecha',
      header: atendidas ? 'Atendida' : 'Llegó',
      className: 'md:w-40',
      cell: (p) =>
        atendidas && p.atendida_en ? (
          <span className="flex flex-col">
            {formatDateTime(p.atendida_en, { dateStyle: 'medium' })}
            {p.atendida_por && <span className="text-sm text-ink-soft">por {p.atendida_por}</span>}
          </span>
        ) : (
          formatDateTime(p.creado_en, { dateStyle: 'medium', timeStyle: 'short' })
        ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      hideLabelOnMobile: true,
      className: 'md:w-48',
      cell: (p) => (
        <span className="flex flex-wrap items-start gap-2">
          <ActionButton
            action={togglePeticionAtendida}
            fields={{ id: String(p.id), atendida: p.atendida ? '0' : '1' }}
            variant={p.atendida ? 'ghost' : 'secondary'}
            icon={<Icon name="check" className="size-4" />}
          >
            {p.atendida ? 'Volver a pendientes' : 'Marcar atendida'}
          </ActionButton>
          {admin.rol === 'admin' && (
            <ConfirmDialog
              action={deletePeticion}
              fields={{ id: String(p.id) }}
              title="¿Eliminar esta petición?"
              description="Se borra por completo, con los datos de quien la envió. No se puede deshacer."
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
        title="Peticiones de oración"
        intro="Lo que llega desde «Pedir oración». Las privadas solo las leen los pastores (cuentas de administrador). Marca cada una cuando ya se oró o se dio seguimiento."
      />
      <FilterTabs
        label="Filtrar peticiones"
        tabs={[
          {
            label: 'Sin atender',
            href: '/admin/peticiones',
            count: counts.no,
            active: !atendidas,
          },
          {
            label: 'Atendidas',
            href: '/admin/peticiones?ver=atendidas',
            count: counts.si,
            active: atendidas,
          },
        ]}
      />
      <DataTable
        caption={atendidas ? 'Peticiones atendidas' : 'Peticiones sin atender'}
        columns={columns}
        rows={rows}
        rowKey={(p) => p.id}
        empty={
          atendidas
            ? 'Todavía no hay peticiones atendidas.'
            : '¡Al día! No hay peticiones sin atender.'
        }
      />
    </div>
  );
}
