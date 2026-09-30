import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { deleteEquipo } from '@/actions/equipo';
import { ButtonLink } from '@/components/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { type Column, DataTable } from '@/components/DataTable';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { FlashToast } from '@/components/Toast';
import { requireAdmin } from '@/lib/auth';
import { query } from '@/lib/db';
import type { EquipoRow } from './EquipoForm';

export const metadata: Metadata = { title: 'Equipo' };

export default async function EquipoPage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  await requireAdmin();
  const { aviso } = await searchParams;
  const people = await query<EquipoRow>(
    'SELECT id, nombre, rol, bio, foto_url, es_pastor, orden, visible FROM equipo ORDER BY orden, nombre',
  );

  const columns: Column<EquipoRow>[] = [
    {
      key: 'nombre',
      header: 'Nombre',
      primary: true,
      cell: (p) => (
        <Link
          href={`/admin/equipo/${p.id}`}
          className="flex items-center gap-3 font-semibold text-brand-strong hover:underline"
        >
          <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-sunken text-ink-soft">
            {p.foto_url ? (
              <Image src={p.foto_url} alt="" fill sizes="40px" className="object-cover" />
            ) : (
              <Icon name="users" className="size-5" />
            )}
          </span>
          {p.nombre}
        </Link>
      ),
    },
    { key: 'rol', header: 'Rol', cell: (p) => p.rol },
    {
      key: 'estado',
      header: 'En el sitio',
      cell: (p) => (
        <span className="flex flex-wrap gap-1.5">
          {p.es_pastor && <Tag tone="accent">Pastor</Tag>}
          {p.visible ? <Tag tone="success">Visible</Tag> : <Tag>Oculto</Tag>}
        </span>
      ),
    },
    { key: 'orden', header: 'Orden', cell: (p) => p.orden, className: 'md:w-20' },
    {
      key: 'acciones',
      header: 'Acciones',
      hideLabelOnMobile: true,
      className: 'md:w-56',
      cell: (p) => (
        <span className="flex flex-wrap gap-1">
          <ButtonLink
            href={`/admin/equipo/${p.id}`}
            variant="ghost"
            size="sm"
            icon={<Icon name="pencil" className="size-4" />}
          >
            Editar
          </ButtonLink>
          <ConfirmDialog
            action={deleteEquipo}
            fields={{ id: String(p.id) }}
            title={`¿Eliminar a ${p.nombre}?`}
            description="Se quitará del sitio y del panel, junto con su foto. Esta acción no se puede deshacer. Si solo quieres ocultarlo, edítalo y desmarca «Visible»."
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
        title="Equipo"
        intro="Pastores y líderes que aparecen en el inicio y en «Nosotros»."
        actions={
          <ButtonLink href="/admin/equipo/nuevo" icon={<Icon name="userPlus" className="size-4" />}>
            Agregar persona
          </ButtonLink>
        }
      />
      <DataTable
        caption="Equipo de la iglesia"
        columns={columns}
        rows={people}
        rowKey={(p) => p.id}
        empty="Aún no hay nadie en el equipo. Usa «Agregar persona» para empezar por los pastores."
      />
    </div>
  );
}
