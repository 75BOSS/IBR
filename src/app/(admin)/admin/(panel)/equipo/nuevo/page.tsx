import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { isCloudinaryConfigured } from '@/lib/cloudinary';
import { EquipoForm } from '../EquipoForm';

export const metadata: Metadata = { title: 'Agregar al equipo' };

export default async function NuevoEquipoPage() {
  await requireAdmin();
  return (
    <div className="flex flex-col gap-6 container-panel">
      <PageHeader eyebrow="Equipo" title="Agregar persona" />
      <EquipoForm uploadsEnabled={isCloudinaryConfigured()} />
    </div>
  );
}
