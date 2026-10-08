import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { isCloudinaryConfigured } from '@/lib/cloudinary';
import { getMinisterio, ministerioName } from '@/lib/ministerios';
import { id as idSchema } from '@/lib/validators/common';
import { MinisterioForm } from '../MinisterioForm';

export const metadata: Metadata = { title: 'Editar ministerio' };

export default async function EditarMinisterioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const parsed = idSchema.safeParse((await params).id);
  if (!parsed.success) notFound();
  const ministerio = await getMinisterio(parsed.data);
  if (!ministerio) notFound();
  return (
    <div className="container-panel">
      <PageHeader eyebrow="Ministerios" title={`Editar: ${ministerioName(ministerio)}`} />
      <MinisterioForm ministerio={ministerio} uploadsEnabled={isCloudinaryConfigured()} />
    </div>
  );
}
