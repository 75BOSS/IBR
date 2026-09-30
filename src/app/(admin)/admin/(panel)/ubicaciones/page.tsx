import type { Metadata } from 'next';
import Link from 'next/link';
import { deleteUbicacion } from '@/actions/ubicaciones';
import { ButtonLink } from '@/components/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { type Column, DataTable } from '@/components/DataTable';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { FlashToast } from '@/components/Toast';
import { requireAdmin } from '@/lib/auth';
import { UBICACION_TIPOS } from '@/lib/catalogs';
import { query } from '@/lib/db';
import type { UbicacionRow } from './UbicacionForm';

export const metadata: Metadata = { title: 'Lugares' };

const tipoLabel = new Map(UBICACION_TIPOS.map((t) => [t.value, t.label]));

export default async function UbicacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  await requireAdmin();
  const { aviso } = await searchParams;
  const places = await query<UbicacionRow>(
    `SELECT id, nombre, tipo, direccion, referencia, zona, maps_url, publica, activo
       FROM ubicaciones ORDER BY activo DESC, tipo = 'sede' DESC, nombre`,
  );
  const columns: Column<UbicacionRow>[] = [
    {
      key: 'nombre',
      header: 'Lugar',
      primary: true,
      cell: (p) => (
        <Link
          href={`/admin/ubicaciones/${p.id}`}
          className="font-semibold text-brand-strong hover:underline"
        >
          {p.nombre}
        </Link>
      ),
    },
    { key: 'tipo', header: 'Tipo', cell: (p) => tipoLabel.get(p.tipo) ?? p.tipo },
    { key: 'zona', header: 'Zona', cell: (p) => p.zona ?? '—' },
    {
      key: 'estado',
      header: 'Estado',
      cell: (p) => (
        <span className="flex flex-wrap gap-1.5">
          {p.activo ? <Tag tone="success">Activo</Tag> : <Tag>Inactivo</Tag>}
          {p.publica ? <Tag tone="brand">Dirección pública</Tag> : <Tag>Solo zona</Tag>}
        </span>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      hideLabelOnMobile: true,
      className: 'md:w-56',
      cell: (p) => (
        <span className="flex flex-wrap gap-1">
          <ButtonLink
            href={`/admin/ubicaciones/${p.id}`}
            variant="ghost"
            size="sm"
            icon={<Icon name="pencil" className="size-4" />}
          >
            Editar
          </ButtonLink>
          <ConfirmDialog
            action={deleteUbicacion}
            fields={{ id: String(p.id) }}
            title={`¿Eliminar «${p.nombre}»?`}
            description="Solo se puede eliminar si ningún grupo, reunión o evento lo usa. Esta acción no se puede deshacer."
            triggerLabel="Eliminar"
          />
        </span>
      ),
    },
  ];
  return (
    <div className="flex flex-col gap-6 container-panel">
      <FlashToast code={aviso} />
      <PageHeader
        eyebrow="Panel"
        title="Lugares"
        intro="Auditorio, casas y lugares donde se reúnen las reuniones y los grupos."
        actions={
          <ButtonLink
            href="/admin/ubicaciones/nuevo"
            icon={<Icon name="plus" className="size-4" />}
          >
            Agregar lugar
          </ButtonLink>
        }
      />
      <DataTable
        caption="Lugares de reunión"
        columns={columns}
        rows={places}
        rowKey={(p) => p.id}
        empty="Aún no hay lugares. Agrega primero el auditorio."
      />
    </div>
  );
}
