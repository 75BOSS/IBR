import type { Metadata } from 'next';
import Link from 'next/link';
import { deleteArea } from '@/actions/servir';
import { ButtonLink } from '@/components/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { type Column, DataTable } from '@/components/DataTable';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { FlashToast } from '@/components/Toast';
import { requireAdmin } from '@/lib/auth';
import { type Area, listAreas } from '@/lib/servir';

export const metadata: Metadata = { title: 'Servir' };

export default async function ServirAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  await requireAdmin();
  const { aviso } = await searchParams;
  const areas = await listAreas({ soloActivas: false });

  const columns: Column<Area>[] = [
    {
      key: 'nombre',
      header: 'Área',
      primary: true,
      cell: (a) => (
        <Link
          href={`/admin/servir/${a.id}`}
          className="font-semibold text-brand-strong hover:underline"
        >
          {a.nombre}
        </Link>
      ),
    },
    { key: 'responsable', header: 'Responsable', cell: (a) => a.responsable ?? '—' },
    {
      key: 'voluntarios',
      header: 'Voluntarios',
      cell: (a) => (
        <Link
          href={`/admin/servir/voluntarios?area=${a.id}`}
          className="inline-flex items-center gap-1.5 text-brand-strong hover:underline"
        >
          {a.voluntarios}
          {Number(a.nuevos) > 0 && <Tag tone="accent">{a.nuevos} sin contactar</Tag>}
        </Link>
      ),
    },
    {
      key: 'estado',
      header: 'En el sitio',
      className: 'md:w-28',
      cell: (a) => (a.activo ? <Tag tone="success">Activa</Tag> : <Tag>Inactiva</Tag>),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      hideLabelOnMobile: true,
      className: 'md:w-52',
      cell: (a) => (
        <span className="flex flex-wrap gap-1">
          <ButtonLink
            href={`/admin/servir/${a.id}`}
            variant="ghost"
            size="sm"
            icon={<Icon name="pencil" className="size-4" />}
          >
            Editar
          </ButtonLink>
          <ConfirmDialog
            action={deleteArea}
            fields={{ id: String(a.id) }}
            title={`¿Eliminar el área «${a.nombre}»?`}
            description="Se quita del sitio y del panel. Solo se puede si no tiene voluntarios; si tiene, desactívala."
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
        title="Servir"
        intro="Áreas donde alguien puede servir. Aparecen en la página «Servir» con un formulario para ofrecerse."
        actions={
          <>
            <ButtonLink
              href="/admin/servir/voluntarios"
              variant="secondary"
              icon={<Icon name="users" className="size-4" />}
            >
              Voluntarios
            </ButtonLink>
            <ButtonLink href="/admin/servir/nueva" icon={<Icon name="plus" className="size-4" />}>
              Nueva área
            </ButtonLink>
          </>
        }
      />
      <DataTable
        caption="Áreas de servicio"
        columns={columns}
        rows={areas}
        rowKey={(a) => a.id}
        empty="Todavía no hay áreas. Crea la primera, ej. Alabanza o Bienvenida."
      />
    </div>
  );
}
