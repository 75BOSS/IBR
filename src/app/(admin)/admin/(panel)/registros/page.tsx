import type { Metadata } from 'next';
import { deleteRegistro, updateRegistroEstado } from '@/actions/registros';
import { ButtonLink } from '@/components/Button';
import { buttonClasses } from '@/components/button-styles';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { type Column, DataTable } from '@/components/DataTable';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { FlashToast } from '@/components/Toast';
import { FilterTabs } from '@/components/admin/FilterTabs';
import { StatusForm } from '@/components/admin/StatusForm';
import { requireAdmin } from '@/lib/auth';
import { formatDateTime } from '@/lib/dates';
import { type Registro, countRegistrosPorEstado, listRegistros } from '@/lib/registros';
import { ORIGENES, REGISTRO_ESTADOS, SITUACIONES } from '@/lib/validators/registros';
import { formatPhoneEc, whatsappHref } from '@/lib/whatsapp';

export const metadata: Metadata = { title: 'Registros' };

const situacionLabel = new Map<string, string>(SITUACIONES.map((s) => [s.value, s.label]));
const origenLabel = new Map<string, string>(ORIGENES.map((o) => [o.value, o.label]));

export default async function RegistrosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; origen?: string; aviso?: string }>;
}) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const estado = REGISTRO_ESTADOS.some((e) => e.value === params.estado) ? params.estado! : 'nuevo';
  const origen = ORIGENES.some((o) => o.value === params.origen) ? params.origen! : null;
  const [rows, counts] = await Promise.all([
    listRegistros({ estado, origen }),
    countRegistrosPorEstado(origen),
  ]);
  const qs = (extra: Record<string, string | null>) => {
    const q = new URLSearchParams();
    const merged = { estado, origen, ...extra };
    for (const [k, v] of Object.entries(merged)) if (v) q.set(k, v);
    return q.toString();
  };

  const columns: Column<Registro>[] = [
    {
      key: 'persona',
      header: 'Persona',
      primary: true,
      cell: (r) => (
        <span className="flex flex-col gap-1">
          <span className="font-semibold">
            {r.nombres} {r.apellidos}
          </span>
          {r.telefono && (
            <a
              href={
                whatsappHref(
                  r.telefono,
                  `Hola ${r.nombres}, te saludamos de la Iglesia Bíblica Riobamba.`,
                ) ?? `tel:${r.telefono}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-whatsapp hover:underline"
            >
              <Icon name="whatsapp" className="size-4" /> {formatPhoneEc(r.telefono)}
              <span className="sr-only"> (abrir WhatsApp)</span>
            </a>
          )}
          {r.email && <span className="text-sm break-all text-ink-soft">{r.email}</span>}
        </span>
      ),
    },
    {
      key: 'detalle',
      header: 'Detalle',
      cell: (r) => (
        <span className="flex flex-col gap-1.5">
          <span className="flex flex-wrap gap-1.5">
            {r.situacion && <Tag tone="accent">{situacionLabel.get(r.situacion)}</Tag>}
            {r.rango_edad && <Tag color={r.rango_color}>{r.rango_edad}</Tag>}
            <Tag>{origenLabel.get(r.origen) ?? r.origen}</Tag>
          </span>
          {r.sector && <span className="text-sm text-ink-soft">Sector: {r.sector}</span>}
          {r.peticion && <span className="text-sm text-ink-soft">Petición: «{r.peticion}»</span>}
        </span>
      ),
    },
    {
      key: 'fecha',
      header: 'Llegó',
      className: 'md:w-36',
      cell: (r) => formatDateTime(r.creado_en, { dateStyle: 'medium' }),
    },
    {
      key: 'estado',
      header: 'Seguimiento',
      hideLabelOnMobile: true,
      className: 'md:w-64',
      cell: (r) => (
        <span className="flex w-full flex-col gap-1">
          <StatusForm
            action={updateRegistroEstado}
            id={r.id}
            estado={r.estado}
            estados={REGISTRO_ESTADOS}
            notas={r.notas_admin}
            notasLabel="Notas de seguimiento"
          />
          {admin.rol === 'admin' && (
            <ConfirmDialog
              action={deleteRegistro}
              fields={{ id: String(r.id) }}
              title={`¿Borrar los datos de ${r.nombres}?`}
              description="Úsalo cuando la persona pida que borremos sus datos. Se elimina por completo y no se puede deshacer."
              triggerLabel="Borrar datos"
            />
          )}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 container-panel">
      <FlashToast code={params.aviso} />
      <PageHeader
        eyebrow="Panel"
        title="Registros"
        intro="Personas nuevas: del formulario «Soy nuevo» y las que se registran en persona. Escríbeles y marca el seguimiento."
        actions={
          <>
            <a
              href={`/admin/registros-csv?${qs({})}`}
              className={buttonClasses({ variant: 'secondary' })}
            >
              <Icon name="download" className="size-4" /> Exportar CSV
            </a>
            <ButtonLink
              href="/admin/registros/nuevo"
              icon={<Icon name="userPlus" className="size-4" />}
            >
              Agregar persona
            </ButtonLink>
          </>
        }
      />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <FilterTabs
          label="Filtrar por estado"
          tabs={REGISTRO_ESTADOS.map((e) => ({
            label: e.label,
            href: `/admin/registros?${qs({ estado: e.value })}`,
            count: counts.get(e.value) ?? 0,
            active: e.value === estado,
          }))}
        />
        <FilterTabs
          label="Filtrar por origen"
          tabs={[
            {
              label: 'Todo origen',
              href: `/admin/registros?${qs({ origen: null })}`,
              active: origen === null,
            },
            ...ORIGENES.slice(0, 2).map((o) => ({
              label: o.label,
              href: `/admin/registros?${qs({ origen: o.value })}`,
              active: o.value === origen,
            })),
          ]}
        />
      </div>
      <DataTable
        caption={`Registros en estado ${estado}`}
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        empty={
          estado === 'nuevo'
            ? '¡Al día! No hay personas nuevas sin contactar.'
            : 'No hay registros en este estado.'
        }
      />
    </div>
  );
}
