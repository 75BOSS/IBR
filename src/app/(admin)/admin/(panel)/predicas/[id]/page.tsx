import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { queryOne } from '@/lib/db';
import { predicaFacets } from '@/lib/predicas';
import { id as idSchema } from '@/lib/validators/common';
import { PredicaForm, type PredicaFormData } from '../PredicaForm';

export const metadata: Metadata = { title: 'Editar prédica' };

export default async function EditarPredicaPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const parsed = idSchema.safeParse((await params).id);
  if (!parsed.success) notFound();
  const [sermon, { series, predicadores }] = await Promise.all([
    queryOne<PredicaFormData>(
      'SELECT id, titulo, youtube_id, serie, predicador, fecha, descripcion, pasaje, destacada, publicada FROM predicas WHERE id = ?',
      [parsed.data],
    ),
    predicaFacets(false),
  ]);
  if (!sermon) notFound();
  return (
    <div className="flex flex-col gap-6 container-panel">
      <PageHeader eyebrow="Prédicas" title="Editar prédica" />
      <PredicaForm sermon={sermon} series={series} predicadores={predicadores} />
    </div>
  );
}
