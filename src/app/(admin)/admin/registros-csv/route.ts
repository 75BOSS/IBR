import { getCurrentAdmin } from '@/lib/auth';
import { csvResponse } from '@/lib/csv';
import { todayInChurchTz, formatDateTime } from '@/lib/dates';
import { listRegistros } from '@/lib/registros';
import { ORIGENES, REGISTRO_ESTADOS, SITUACIONES } from '@/lib/validators/registros';

export const dynamic = 'force-dynamic';

const labels = (list: readonly { value: string; label: string }[]) =>
  new Map<string, string>(list.map((i) => [i.value, i.label]));

/** Exporta los registros del filtro actual (separador «;» y BOM: se abre bien en Excel en español). */
export async function GET(request: Request) {
  if (!(await getCurrentAdmin()))
    return new Response('Inicia sesión en el panel para exportar.', { status: 401 });
  const params = new URL(request.url).searchParams;
  const estado = REGISTRO_ESTADOS.some((e) => e.value === params.get('estado'))
    ? params.get('estado')
    : null;
  const origen = ORIGENES.some((o) => o.value === params.get('origen'))
    ? params.get('origen')
    : null;
  const rows = await listRegistros({ estado, origen, limit: 10000 });
  const situacion = labels(SITUACIONES);
  const estados = labels(REGISTRO_ESTADOS);
  const origenes = labels(ORIGENES);
  const header = [
    'Fecha',
    'Nombres',
    'Apellidos',
    'Teléfono',
    'Correo',
    'Edad',
    'Sector',
    'Origen',
    'Situación',
    'Petición',
    'Estado',
    'Notas',
    'Acepta datos',
  ];
  const lines = rows.map((r) => [
    formatDateTime(r.creado_en, { dateStyle: 'short', timeStyle: 'short' }),
    r.nombres,
    r.apellidos,
    r.telefono,
    r.email,
    r.rango_edad,
    r.sector,
    origenes.get(r.origen) ?? r.origen,
    r.situacion ? situacion.get(r.situacion) : '',
    r.peticion,
    estados.get(r.estado) ?? r.estado,
    r.notas_admin,
    r.acepta_datos ? 'Sí' : 'No',
  ]);
  return csvResponse(`registros-${todayInChurchTz()}.csv`, header, lines);
}
