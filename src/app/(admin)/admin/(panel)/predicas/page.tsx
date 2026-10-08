import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { deletePredica } from '@/actions/predicas';
import { ButtonLink } from '@/components/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { type Column, DataTable } from '@/components/DataTable';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { FlashToast } from '@/components/Toast';
import { requireAdmin } from '@/lib/auth';
import { formatDateOnly } from '@/lib/dates';
import { type Predica, listPredicas } from '@/lib/predicas';

export const metadata: Metadata = { title: 'Prédicas' };

export default async function PredicasAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  await requireAdmin();
  const { aviso } = await searchParams;
  const sermons = await listPredicas({ soloPublicadas: false });
  const columns: Column<Predica>[] = [
    {
      key: 'titulo',
      header: 'Prédica',
      primary: true,
      cell: (p) => (
        <Link href={`/admin/predicas/${p.id}`} className="flex items-center gap-3 link-quiet">
          <span className="relative hidden aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-sunken xs:block">
            {p.miniatura_url && (
              <Image src={p.miniatura_url} alt="" fill sizes="96px" className="object-cover" />
            )}
          </span>
          {p.titulo}
        </Link>
      ),
    },
    {
      key: 'fecha',
      header: 'Fecha',
      cell: (p) => formatDateOnly(p.fecha, { dateStyle: 'medium' }),
      className: '@4xl:w-36',
    },
    { key: 'predicador', header: 'Predicador', cell: (p) => p.predicador ?? '—' },
    {
      key: 'estado',
      header: 'Estado',
      cell: (p) => (
        <span className="flex flex-wrap gap-1.5">
          {p.publicada ? <Tag tone="success">Publicada</Tag> : <Tag>Borrador</Tag>}
          {p.destacada && <Tag tone="accent">Destacada</Tag>}
          {p.serie && <Tag tone="brand">{p.serie}</Tag>}
        </span>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      hideLabelOnMobile: true,
      className: '@4xl:w-56',
      cell: (p) => (
        <span className="flex flex-wrap gap-1">
          <ButtonLink
            href={`/admin/predicas/${p.id}`}
            variant="ghost"
            size="sm"
            icon={<Icon name="pencil" className="size-4" />}
          >
            Editar
          </ButtonLink>
          <ConfirmDialog
            action={deletePredica}
            fields={{ id: String(p.id) }}
            title={`¿Quitar «${p.titulo}» del sitio?`}
            description="Se borra del sitio; el video sigue en YouTube. Para ocultarla sin borrarla, edítala y desmarca «Publicada»."
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
        title="Prédicas"
        intro="Pega el enlace de YouTube y listo: el título y la miniatura se completan solos."
        actions={
          <ButtonLink href="/admin/predicas/nueva" icon={<Icon name="plus" className="size-4" />}>
            Agregar prédica
          </ButtonLink>
        }
      />
      <DataTable
        caption="Prédicas publicadas y borradores"
        columns={columns}
        rows={sermons}
        rowKey={(p) => p.id}
        empty="Aún no hay prédicas. Agrega la del último domingo."
      />
    </div>
  );
}
