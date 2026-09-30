import { getCurrentAdmin } from '@/lib/auth';
import { csvResponse } from '@/lib/csv';
import { formatDateTime } from '@/lib/dates';
import { getEvento } from '@/lib/eventos';
import { INSCRIPCION_ESTADOS, listInscripciones } from '@/lib/inscripciones';
import { slugify } from '@/lib/slug';
import { id as idSchema } from '@/lib/validators/common';

export const dynamic = 'force-dynamic';

const estados = new Map<string, string>(INSCRIPCION_ESTADOS.map((e) => [e.value, e.label]));

/** Lista de inscritos de un evento para imprimir o llevar a la puerta. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getCurrentAdmin()))
    return new Response('Inicia sesión en el panel para exportar.', { status: 401 });
  const parsed = idSchema.safeParse((await params).id);
  const event = parsed.success ? await getEvento({ id: parsed.data }) : null;
  if (!event) return new Response('Evento no encontrado.', { status: 404 });
  const rows = await listInscripciones(event.id);
  return csvResponse(
    `inscritos-${slugify(event.titulo, 60)}.csv`,
    ['Nombre', 'WhatsApp', 'Correo', 'Personas', 'Código', 'Estado', 'Se inscribió'],
    rows.map((i) => [
      i.nombre,
      i.telefono,
      i.email,
      i.personas,
      i.codigo,
      estados.get(i.estado) ?? i.estado,
      formatDateTime(i.creado_en, { dateStyle: 'short', timeStyle: 'short' }),
    ]),
  );
}
