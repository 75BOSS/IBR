import type { Metadata } from 'next';
import Link from 'next/link';
import { deleteVoluntario, updateVoluntario } from '@/actions/servir';
import { buttonClasses } from '@/components/button-styles';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { type Column, DataTable } from '@/components/DataTable';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Tag } from '@/components/Tag';
import { ContactLinks } from '@/components/admin/ContactLinks';
import { FilterTabs } from '@/components/FilterTabs';
import { StatusForm } from '@/components/admin/StatusForm';
import { requireAdmin } from '@/lib/auth';
import { formatDateTime } from '@/lib/dates';
import {
  type Voluntario,
  countVoluntariosPorEstado,
  listAreas,
  listVoluntarios,
} from '@/lib/servir';
import { VOLUNTARIO_ESTADOS } from '@/lib/validators/servir';

export const metadata: Metadata = { title: 'Voluntarios' };

export default async function VoluntariosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; area?: string }>;
}) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const estado = VOLUNTARIO_ESTADOS.some((e) => e.value === params.estado)
    ? params.estado!
    : 'nuevo';
  const areas = await listAreas({ soloActivas: false });
  const area = areas.find((a) => String(a.id) === params.area) ?? null;
  const [rows, counts] = await Promise.all([
    listVoluntarios({ estado, areaId: area?.id }),
    countVoluntariosPorEstado(area?.id ?? null),
  ]);
  const qs = (extra: Record<string, string | null>) => {
    const q = new URLSearchParams();
    const merged = { estado, area: area ? String(area.id) : null, ...extra };
    for (const [k, v] of Object.entries(merged)) if (v) q.set(k, v);
    return q.toString();
  };

  const columns: Column<Voluntario>[] = [
    {
      key: 'persona',
      header: 'Persona',
      primary: true,
      cell: (v) => (
        <ContactLinks
          nombre={v.nombre}
          telefono={v.telefono}
          email={v.email}
          saludo={`Hola ${v.nombre}, gracias por querer servir en ${v.area}. Te escribimos de la Iglesia Bíblica Riobamba.`}
        />
      ),
    },
    {
      key: 'detalle',
      header: 'Detalle',
      cell: (v) => (
        <span className="flex flex-col gap-1.5">
          <span>
            <Tag tone="accent">{v.area}</Tag>
          </span>
          {v.disponibilidad && (
            <span className="text-sm text-ink-soft">Puede: {v.disponibilidad}</span>
          )}
          {v.mensaje && <span className="text-sm text-ink-soft">«{v.mensaje}»</span>}
        </span>
      ),
    },
    {
      key: 'fecha',
      header: 'Llegó',
      className: 'md:w-36',
      cell: (v) => formatDateTime(v.creado_en, { dateStyle: 'medium' }),
    },
    {
      key: 'estado',
      header: 'Seguimiento',
      hideLabelOnMobile: true,
      className: 'md:w-64',
      cell: (v) => (
        <span className="flex w-full flex-col gap-1">
          <StatusForm
            action={updateVoluntario}
            id={v.id}
            estado={v.estado}
            estados={VOLUNTARIO_ESTADOS}
            notas={v.notas}
            notasLabel="Notas de seguimiento"
          />
          {admin.rol === 'admin' && (
            <ConfirmDialog
              action={deleteVoluntario}
              fields={{ id: String(v.id) }}
              title={`¿Borrar los datos de ${v.nombre}?`}
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
      <Link
        href="/admin/servir"
        className="inline-flex items-center gap-1 self-start font-semibold text-brand-strong hover:underline"
      >
        <Icon name="chevronLeft" className="size-4" /> Áreas de servicio
      </Link>
      <PageHeader
        eyebrow="Servir"
        title={area ? `Voluntarios de ${area.nombre}` : 'Voluntarios'}
        intro="Personas que se ofrecieron desde la página «Servir». Escríbeles y marca el seguimiento."
        actions={
          area && (
            <Link
              href={`/admin/servir/voluntarios?${qs({ area: null })}`}
              className={buttonClasses({ variant: 'secondary' })}
            >
              Ver todas las áreas
            </Link>
          )
        }
      />
      <FilterTabs
        label="Filtrar por estado"
        tabs={VOLUNTARIO_ESTADOS.map((e) => ({
          label: e.label,
          href: `/admin/servir/voluntarios?${qs({ estado: e.value })}`,
          count: counts.get(e.value) ?? 0,
          active: e.value === estado,
        }))}
      />
      <DataTable
        caption={`Voluntarios en estado ${estado}`}
        columns={columns}
        rows={rows}
        rowKey={(v) => v.id}
        empty={
          estado === 'nuevo'
            ? '¡Al día! No hay voluntarios nuevos sin contactar.'
            : 'No hay voluntarios en este estado.'
        }
      />
    </div>
  );
}
