import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { isCloudinaryConfigured } from '@/lib/cloudinary';
import { MinisterioForm } from '../MinisterioForm';

export const metadata: Metadata = { title: 'Nuevo ministerio' };

export default async function NuevoMinisterioPage() {
  await requireAdmin();
  return (
    <div className="flex flex-col gap-6 container-panel">
      <PageHeader eyebrow="Ministerios" title="Nuevo ministerio" />
      <MinisterioForm uploadsEnabled={isCloudinaryConfigured()} />
    </div>
  );
}
