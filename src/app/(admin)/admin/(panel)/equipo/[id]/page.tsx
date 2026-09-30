import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { isCloudinaryConfigured } from '@/lib/cloudinary';
import { queryOne } from '@/lib/db';
import { id as idSchema } from '@/lib/validators/common';
import { EquipoForm, type EquipoRow } from '../EquipoForm';

export const metadata: Metadata = { title: 'Editar equipo' };

export default async function EditarEquipoPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const parsed = idSchema.safeParse((await params).id);
  if (!parsed.success) notFound();
  const person = await queryOne<EquipoRow>(
    'SELECT id, nombre, rol, bio, foto_url, es_pastor, orden, visible FROM equipo WHERE id = ?',
    [parsed.data],
  );
  if (!person) notFound();
  return (
    <div className="flex flex-col gap-6 container-panel">
      <PageHeader eyebrow="Equipo" title={`Editar: ${person.nombre}`} />
      <EquipoForm person={person} uploadsEnabled={isCloudinaryConfigured()} />
    </div>
  );
}
