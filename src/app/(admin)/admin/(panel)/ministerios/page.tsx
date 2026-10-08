import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink } from '@/components/Button';
import { type Column, DataTable } from '@/components/DataTable';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { FlashToast } from '@/components/Toast';
import { requireAdmin } from '@/lib/auth';
import { type Ministerio, edadText, listMinisterios, ministerioName } from '@/lib/ministerios';

export const metadata: Metadata = { title: 'Ministerios' };

export default async function MinisteriosAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  await requireAdmin();
  const { aviso } = await searchParams;
  const rows = await listMinisterios({ soloActivos: false });

  const columns: Column<Ministerio>[] = [
    {
      key: 'nombre',
      header: 'Ministerio',
      primary: true,
      cell: (m) => (
        <Link
          href={`/admin/ministerios/${m.id}`}
          className="flex items-center gap-3 font-semibold text-brand-strong hover:underline"
        >
          <span
            aria-hidden="true"
            className="size-4 shrink-0 rounded-full ring-1 ring-line"
            style={{ background: m.color ?? 'var(--color-sunken)' }}
          />
          <span className="flex flex-col">
            {ministerioName(m)}
            {m.nombre_ministerio && (
              <span className="text-sm font-normal text-ink-soft">{m.nombre}</span>
            )}
          </span>
        </Link>
      ),
    },
    { key: 'edad', header: 'Edades', cell: (m) => edadText(m) ?? '—' },
    {
      key: 'uso',
      header: 'En el sitio',
      cell: (m) => (
        <span className="flex flex-wrap gap-1.5">
          {!m.activo ? (
            <Tag>Inactivo</Tag>
          ) : m.con_contenido ? (
            <Tag tone="success">Activo</Tag>
          ) : (
            <Tag tone="accent">
              No aparece en el sitio: falta descripción, foto, grupo o reunión
            </Tag>
          )}
          <Tag>
            {m.reuniones} {m.reuniones === 1 ? 'reunión' : 'reuniones'}
          </Tag>
          <Tag>
            {m.grupos} {m.grupos === 1 ? 'grupo público' : 'grupos públicos'}
          </Tag>
        </span>
      ),
    },
    { key: 'orden', header: 'Orden', className: 'md:w-20', cell: (m) => m.orden },
    {
      key: 'acciones',
      header: 'Acciones',
      hideLabelOnMobile: true,
      className: 'md:w-48',
      cell: (m) => (
        <span className="flex flex-wrap gap-1">
          <ButtonLink
            href={`/admin/ministerios/${m.id}`}
            variant="ghost"
            size="sm"
            icon={<Icon name="pencil" className="size-4" />}
          >
            Editar
          </ButtonLink>
          {m.activo && Boolean(m.con_contenido) && (
            <ButtonLink
              href={`/ministerios/${m.slug}`}
              variant="ghost"
              size="sm"
              icon={<Icon name="external" className="size-4" />}
            >
              Ver
            </ButtonLink>
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
        title="Ministerios"
        intro="Un ministerio por rango de edad. Su nombre, color y foto se ven en el sitio, en los grupos y en «Soy nuevo»."
        actions={
          <ButtonLink
            href="/admin/ministerios/nuevo"
            icon={<Icon name="plus" className="size-4" />}
          >
            Nuevo ministerio
          </ButtonLink>
        }
      />
      <DataTable
        caption="Ministerios por rango de edad"
        columns={columns}
        rows={rows}
        rowKey={(m) => m.id}
        empty="Todavía no hay ministerios. Se cargan al importar el sistema anterior o con «Nuevo ministerio»."
      />
    </div>
  );
}
