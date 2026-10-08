import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { isCloudinaryConfigured } from '@/lib/cloudinary';
import { listEquipo } from '@/lib/equipo';
import { AreaForm } from '../AreaForm';

export const metadata: Metadata = { title: 'Nueva área de servicio' };

export default async function NuevaAreaPage() {
  await requireAdmin();
  const equipo = await listEquipo();
  return (
    <div className="container-panel">
      <PageHeader eyebrow="Servir" title="Nueva área de servicio" />
      <AreaForm
        equipo={equipo.map((p) => ({ value: String(p.id), label: `${p.nombre} · ${p.rol}` }))}
        uploadsEnabled={isCloudinaryConfigured()}
      />
    </div>
  );
}
