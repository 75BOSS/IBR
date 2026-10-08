import type { Metadata } from 'next';
import Link from 'next/link';
import { deleteGrupo } from '@/actions/grupos';
import { ButtonLink } from '@/components/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { type Column, DataTable } from '@/components/DataTable';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { FlashToast } from '@/components/Toast';
import { requireAdmin } from '@/lib/auth';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import { type Grupo, listGruposAdmin } from '@/lib/grupos';

export const metadata: Metadata = { title: 'Grupos' };

export default async function GruposAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  await requireAdmin();
  const { aviso } = await searchParams;
  const groups = await listGruposAdmin();
  const pending = groups.reduce((n, g) => n + Number(g.solicitudes_pendientes), 0);
  const columns: Column<Grupo>[] = [
    {
      key: 'nombre',
      header: 'Grupo',
      primary: true,
      cell: (g) => (
        <Link href={`/admin/grupos/${g.id}`} className="link-quiet">
          {g.nombre}
        </Link>
      ),
    },
    {
      key: 'cuando',
      header: 'Cuándo',
      cell: (g) =>
        g.dia_semana ? `${DAY_NAMES[g.dia_semana]} ${formatTime(g.hora)}` : 'Por definir',
    },
    {
      key: 'lugar',
      header: 'Lugar',
      cell: (g) => (g.zona ? `${g.ubicacion} · ${g.zona}` : (g.ubicacion ?? '—')),
    },
    { key: 'lider', header: 'Líder', cell: (g) => g.lider_nombre ?? '—' },
    {
      key: 'estado',
      header: 'Estado',
      cell: (g) => (
        <span className="flex flex-wrap gap-1.5">
          {!g.activo ? (
            <Tag>Inactivo</Tag>
          ) : g.publico ? (
            <Tag tone="success">Público</Tag>
          ) : (
            <Tag tone="warning">Oculto</Tag>
          )}
          {g.rango_edad && <Tag color={g.rango_color}>{g.rango_edad}</Tag>}
          {Number(g.solicitudes_pendientes) > 0 && (
            <Tag tone="accent">{g.solicitudes_pendientes} solicitud(es)</Tag>
          )}
        </span>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      hideLabelOnMobile: true,
      className: '@4xl:w-56',
      cell: (g) => (
        <span className="flex flex-wrap gap-1">
          <ButtonLink
            href={`/admin/grupos/${g.id}`}
            variant="ghost"
            size="sm"
            icon={<Icon name="pencil" className="size-4" />}
          >
            Editar
          </ButtonLink>
          <ConfirmDialog
            action={deleteGrupo}
            fields={{ id: String(g.id) }}
            title={`¿Eliminar el grupo «${g.nombre}»?`}
            description="También se borran sus solicitudes. Si el grupo solo descansa por un tiempo, mejor edítalo y desmarca «Activo»."
            triggerLabel="Eliminar"
          />
        </span>
      ),
    },
  ];
  return (
    <div className="container-panel">
      <FlashToast code={aviso} />
      <PageHeader
        eyebrow="Panel"
        title="Grupos"
        intro="Grupos pequeños por casas. Los públicos y activos aparecen en el directorio del sitio."
        actions={
          <>
            <ButtonLink
              href="/admin/grupos/solicitudes"
              variant="secondary"
              icon={<Icon name="clipboard" className="size-4" />}
            >
              Solicitudes{pending > 0 ? ` (${pending})` : ''}
            </ButtonLink>
            <ButtonLink href="/admin/grupos/nuevo" icon={<Icon name="plus" className="size-4" />}>
              Crear grupo
            </ButtonLink>
          </>
        }
      />
      <DataTable
        caption="Grupos"
        columns={columns}
        rows={groups}
        rowKey={(g) => g.id}
        empty="Aún no hay grupos. Crea el primero."
      />
    </div>
  );
}
