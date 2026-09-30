import type { Metadata } from 'next';
import Link from 'next/link';
import { resetUsuarioPassword } from '@/actions/usuarios';
import { ButtonLink } from '@/components/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { type Column, DataTable } from '@/components/DataTable';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { FlashToast } from '@/components/Toast';
import { requireAdmin } from '@/lib/auth';
import { formatDateTime } from '@/lib/dates';
import { type Usuario, listUsuarios } from '@/lib/usuarios';

export const metadata: Metadata = { title: 'Usuarios' };

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  const me = await requireAdmin({ role: 'admin' });
  const { aviso } = await searchParams;
  const users = await listUsuarios();

  const columns: Column<Usuario>[] = [
    {
      key: 'nombre',
      header: 'Persona',
      primary: true,
      cell: (u) => (
        <span className="flex min-w-0 flex-col">
          <Link
            href={`/admin/usuarios/${u.id}`}
            className="font-semibold text-brand-strong hover:underline"
          >
            {u.nombre}
            {u.id === me.id && <span className="font-normal text-ink-soft"> (tú)</span>}
          </Link>
          <span className="text-sm break-all text-ink-soft">{u.email}</span>
        </span>
      ),
    },
    {
      key: 'rol',
      header: 'Rol',
      cell: (u) => (
        <span className="flex flex-wrap gap-1.5">
          {u.rol === 'admin' ? <Tag tone="accent">Administrador</Tag> : <Tag>Editor</Tag>}
          {!u.activo && <Tag tone="danger">Desactivado</Tag>}
        </span>
      ),
    },
    {
      key: 'ultimo',
      header: 'Último ingreso',
      className: 'md:w-44',
      cell: (u) =>
        u.ultimo_login ? (
          formatDateTime(u.ultimo_login, { dateStyle: 'medium', timeStyle: 'short' })
        ) : (
          <span className="text-ink-soft">Nunca</span>
        ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      hideLabelOnMobile: true,
      className: 'md:w-64',
      cell: (u) => (
        <span className="flex flex-wrap gap-1">
          <ButtonLink
            href={`/admin/usuarios/${u.id}`}
            variant="ghost"
            size="sm"
            icon={<Icon name="pencil" className="size-4" />}
          >
            Editar
          </ButtonLink>
          {u.id !== me.id && (
            <ConfirmDialog
              action={resetUsuarioPassword}
              fields={{ id: String(u.id) }}
              title={`¿Generar una contraseña nueva para ${u.nombre}?`}
              description="La contraseña actual deja de servir y se cierran sus sesiones abiertas. Te mostraremos la nueva una sola vez para que se la pases."
              triggerLabel="Nueva contraseña"
              triggerIcon="lock"
              triggerVariant="ghost"
              confirmLabel="Sí, generar"
              pendingLabel="Generando…"
              tone="primary"
            />
          )}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 container-panel">
      <FlashToast code={aviso} />
      <PageHeader
        eyebrow="Panel"
        title="Usuarios"
        intro="Quién puede entrar al panel. Los pastores van como Administrador (leen las peticiones privadas); los voluntarios, como Editor."
        actions={
          <ButtonLink
            href="/admin/usuarios/nuevo"
            icon={<Icon name="userPlus" className="size-4" />}
          >
            Nuevo usuario
          </ButtonLink>
        }
      />
      <DataTable
        caption="Usuarios del panel"
        columns={columns}
        rows={users}
        rowKey={(u) => u.id}
        empty="Todavía no hay usuarios."
      />
    </div>
  );
}
