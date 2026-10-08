import type { Metadata } from 'next';
import Link from 'next/link';
import { deleteReunion } from '@/actions/reuniones';
import { ButtonLink } from '@/components/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { type Column, DataTable } from '@/components/DataTable';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { FlashToast } from '@/components/Toast';
import { requireAdmin } from '@/lib/auth';
import { DAY_NAMES, formatTime } from '@/lib/dates';
import { type Reunion, listReuniones } from '@/lib/reuniones';

export const metadata: Metadata = { title: 'Reuniones' };

export default async function ReunionesPage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  await requireAdmin();
  const { aviso } = await searchParams;
  const meetings = await listReuniones({ soloActivas: false });
  const columns: Column<Reunion>[] = [
    {
      key: 'nombre',
      header: 'Reunión',
      primary: true,
      cell: (m) => (
        <Link href={`/admin/reuniones/${m.id}`} className="link-quiet">
          {m.nombre}
        </Link>
      ),
    },
    {
      key: 'cuando',
      header: 'Cuándo',
      cell: (m) =>
        `${DAY_NAMES[m.dia_semana]} ${formatTime(m.hora_inicio)}${m.hora_fin ? `–${formatTime(m.hora_fin)}` : ''}`,
    },
    { key: 'lugar', header: 'Lugar', cell: (m) => m.ubicacion ?? (m.en_linea ? 'En línea' : '—') },
    {
      key: 'estado',
      header: 'Estado',
      cell: (m) => (
        <span className="flex flex-wrap gap-1.5">
          {m.activo ? <Tag tone="success">Activa</Tag> : <Tag>Oculta</Tag>}
          {m.en_linea && <Tag tone="accent">En línea</Tag>}
          {m.rango_edad && <Tag color={m.rango_color}>{m.rango_edad}</Tag>}
        </span>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      hideLabelOnMobile: true,
      className: '@4xl:w-56',
      cell: (m) => (
        <span className="flex flex-wrap gap-1">
          <ButtonLink
            href={`/admin/reuniones/${m.id}`}
            variant="ghost"
            size="sm"
            icon={<Icon name="pencil" className="size-4" />}
          >
            Editar
          </ButtonLink>
          <ConfirmDialog
            action={deleteReunion}
            fields={{ id: String(m.id) }}
            title={`¿Eliminar «${m.nombre}»?`}
            description="Dejará de aparecer en los horarios del sitio. Si es algo temporal, mejor edítala y desmarca «Activa»."
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
        title="Reuniones"
        intro="Horarios fijos de la semana. Aparecen en el inicio y en la página «Reuniones»."
        actions={
          <ButtonLink href="/admin/reuniones/nueva" icon={<Icon name="plus" className="size-4" />}>
            Agregar reunión
          </ButtonLink>
        }
      />
      <DataTable
        caption="Reuniones semanales"
        columns={columns}
        rows={meetings}
        rowKey={(m) => m.id}
        empty="Aún no hay reuniones. Empieza por el culto del domingo."
      />
    </div>
  );
}
