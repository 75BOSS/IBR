import type { Metadata } from 'next';
import Link from 'next/link';
import { deleteEvento } from '@/actions/eventos';
import { ButtonLink } from '@/components/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { type Column, DataTable } from '@/components/DataTable';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { FlashToast } from '@/components/Toast';
import { requireAdmin } from '@/lib/auth';
import { formatDateTime } from '@/lib/dates';
import { type Evento, listAllEventos } from '@/lib/eventos';
import { EVENTO_CATEGORIAS } from '@/lib/validators/eventos';

export const metadata: Metadata = { title: 'Eventos' };

const categoryLabel = new Map<string, string>(EVENTO_CATEGORIAS.map((c) => [c.value, c.label]));

export default async function EventosAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  await requireAdmin();
  const { aviso } = await searchParams;
  const events = await listAllEventos();
  const now = Date.now();
  const columns: Column<Evento>[] = [
    {
      key: 'titulo',
      header: 'Evento',
      primary: true,
      cell: (e) => (
        <Link href={`/admin/eventos/${e.id}`} className="link-quiet">
          {e.titulo}
        </Link>
      ),
    },
    {
      key: 'fecha',
      header: 'Cuándo',
      cell: (e) =>
        formatDateTime(
          e.fecha_inicio,
          e.todo_el_dia ? { dateStyle: 'medium' } : { dateStyle: 'medium', timeStyle: 'short' },
        ),
    },
    {
      key: 'categoria',
      header: 'Categoría',
      cell: (e) => categoryLabel.get(e.categoria) ?? e.categoria,
    },
    {
      key: 'estado',
      header: 'Estado',
      cell: (e) => (
        <span className="flex flex-wrap gap-1.5">
          {e.publicado ? <Tag tone="success">Publicado</Tag> : <Tag tone="warning">Borrador</Tag>}
          {(e.fecha_fin ?? e.fecha_inicio).getTime() < now && <Tag>Ya pasó</Tag>}
          {e.destacado && <Tag tone="accent">Destacado</Tag>}
        </span>
      ),
    },
    {
      key: 'inscritos',
      header: 'Inscritos',
      className: '@4xl:w-32',
      cell: (e) =>
        e.requiere_inscripcion ? (
          <Link
            href={`/admin/eventos/${e.id}/inscritos`}
            className="inline-flex items-center gap-1.5 link-quiet"
          >
            <Icon name="users" className="size-4" />
            {e.inscritos}
            {e.cupo !== null && <span className="font-normal text-ink-soft">/ {e.cupo}</span>}
          </Link>
        ) : (
          <span className="text-ink-soft">—</span>
        ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      hideLabelOnMobile: true,
      className: '@4xl:w-56',
      cell: (e) => (
        <span className="flex flex-wrap gap-1">
          <ButtonLink
            href={`/admin/eventos/${e.id}`}
            variant="ghost"
            size="sm"
            icon={<Icon name="pencil" className="size-4" />}
          >
            Editar
          </ButtonLink>
          <ConfirmDialog
            action={deleteEvento}
            fields={{ id: String(e.id) }}
            title={`¿Eliminar «${e.titulo}»?`}
            description={`Se borra del sitio junto con su imagen${
              Number(e.inscritos) > 0 ? ` y sus ${e.inscritos} inscripciones` : ''
            }, y el enlace compartido dejará de funcionar. No se puede deshacer.`}
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
        title="Eventos"
        intro="Actividades y noticias. Los próximos tres aparecen en el inicio."
        actions={
          <ButtonLink href="/admin/eventos/nuevo" icon={<Icon name="plus" className="size-4" />}>
            Crear evento
          </ButtonLink>
        }
      />
      <DataTable
        caption="Eventos"
        columns={columns}
        rows={events}
        rowKey={(e) => e.id}
        empty="Aún no hay eventos. Crea el próximo."
      />
    </div>
  );
}
