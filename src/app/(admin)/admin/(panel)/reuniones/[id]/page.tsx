import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { rangoOptions, ubicacionOptions } from '@/lib/catalogs';
import { queryOne } from '@/lib/db';
import { id as idSchema } from '@/lib/validators/common';
import { ReunionForm, type ReunionFormData } from '../ReunionForm';

export const metadata: Metadata = { title: 'Editar reunión' };

export default async function EditarReunionPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const parsed = idSchema.safeParse((await params).id);
  if (!parsed.success) notFound();
  const [meeting, ubicaciones, rangos] = await Promise.all([
    queryOne<ReunionFormData>(
      `SELECT id, nombre, descripcion, dia_semana, hora_inicio, hora_fin, ubicacion_id, rango_edad_id, en_linea, orden, activo
         FROM reuniones WHERE id = ?`,
      [parsed.data],
    ),
    ubicacionOptions(),
    rangoOptions(),
  ]);
  if (!meeting) notFound();
  return (
    <div className="container-panel">
      <PageHeader eyebrow="Reuniones" title={`Editar: ${meeting.nombre}`} />
      <ReunionForm meeting={meeting} ubicaciones={ubicaciones} rangos={rangos} />
    </div>
  );
}
