import type { Metadata } from 'next';
import Link from 'next/link';
import { updateSolicitud } from '@/actions/grupos';
import { type Column, DataTable } from '@/components/DataTable';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { ContactLinks } from '@/components/admin/ContactLinks';
import { FilterTabs } from '@/components/admin/FilterTabs';
import { StatusForm } from '@/components/admin/StatusForm';
import { requireAdmin } from '@/lib/auth';
import { formatDateTime } from '@/lib/dates';
import { query } from '@/lib/db';
import { SOLICITUD_ESTADOS } from '@/lib/validators/grupos';

export const metadata: Metadata = { title: 'Solicitudes de grupos' };

type Solicitud = {
  id: number;
  grupo_id: number;
  grupo: string;
  nombre: string;
  telefono: string;
  mensaje: string | null;
  estado: string;
  notas: string | null;
  creado_en: Date;
};

export default async function SolicitudesPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  await requireAdmin();
  const { estado: raw } = await searchParams;
  const estado = SOLICITUD_ESTADOS.some((e) => e.value === raw) ? raw! : 'pendiente';
  const [rows, counts] = await Promise.all([
    query<Solicitud>(
      `SELECT s.id, s.grupo_id, g.nombre AS grupo, s.nombre, s.telefono, s.mensaje, s.estado, s.notas, s.creado_en
         FROM solicitudes_grupo s JOIN grupos g ON g.id = s.grupo_id
        WHERE s.estado = ? ORDER BY s.creado_en DESC LIMIT 200`,
      [estado],
    ),
    query<{ estado: string; n: number }>(
      'SELECT estado, COUNT(*) AS n FROM solicitudes_grupo GROUP BY estado',
    ),
  ]);
  const countOf = new Map(counts.map((c) => [c.estado, Number(c.n)]));

  const columns: Column<Solicitud>[] = [
    {
      key: 'persona',
      header: 'Persona',
      primary: true,
      cell: (s) => (
        <ContactLinks
          nombre={s.nombre}
          telefono={s.telefono}
          saludo={`Hola ${s.nombre}, te escribo de la Iglesia Bíblica Riobamba por el grupo «${s.grupo}».`}
        />
      ),
    },
    {
      key: 'grupo',
      header: 'Grupo',
      cell: (s) => (
        <Link href={`/admin/grupos/${s.grupo_id}`} className="text-brand-strong hover:underline">
          {s.grupo}
        </Link>
      ),
    },
    {
      key: 'fecha',
      header: 'Llegó',
      cell: (s) => formatDateTime(s.creado_en, { dateStyle: 'medium', timeStyle: 'short' }),
    },
    { key: 'mensaje', header: 'Mensaje', cell: (s) => s.mensaje ?? '—' },
    {
      key: 'estado',
      header: 'Estado',
      hideLabelOnMobile: true,
      className: 'md:w-64',
      cell: (s) => (
        <StatusForm
          action={updateSolicitud}
          id={s.id}
          estado={s.estado}
          estados={SOLICITUD_ESTADOS}
          notas={s.notas}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 container-panel">
      <Link
        href="/admin/grupos"
        className="inline-flex items-center gap-1 self-start font-semibold text-brand-strong hover:underline"
      >
        <Icon name="chevronLeft" className="size-4" /> Grupos
      </Link>
      <PageHeader
        eyebrow="Grupos"
        title="Solicitudes para unirse"
        intro="Personas que pidieron unirse desde el sitio. Escríbeles por WhatsApp y marca el avance."
      />
      <FilterTabs
        label="Filtrar solicitudes por estado"
        tabs={SOLICITUD_ESTADOS.map((e) => ({
          label: e.label,
          href: `/admin/grupos/solicitudes?estado=${e.value}`,
          count: countOf.get(e.value) ?? 0,
          active: e.value === estado,
        }))}
      />
      <DataTable
        caption={`Solicitudes: ${estado}`}
        columns={columns}
        rows={rows}
        rowKey={(s) => s.id}
        empty={
          estado === 'pendiente'
            ? '¡Al día! No hay solicitudes pendientes.'
            : 'No hay solicitudes en este estado.'
        }
      />
    </div>
  );
}
