import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { isCloudinaryConfigured } from '@/lib/cloudinary';
import { getEquipo } from '@/lib/equipo';
import { id as idSchema } from '@/lib/validators/common';
import { EquipoForm } from '../EquipoForm';

export const metadata: Metadata = { title: 'Editar equipo' };

export default async function EditarEquipoPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const parsed = idSchema.safeParse((await params).id);
  if (!parsed.success) notFound();
  const person = await getEquipo(parsed.data);
  if (!person) notFound();
  return (
    <div className="container-panel">
      <PageHeader eyebrow="Equipo" title={`Editar: ${person.nombre}`} />
      <EquipoForm person={person} uploadsEnabled={isCloudinaryConfigured()} />
    </div>
  );
}
