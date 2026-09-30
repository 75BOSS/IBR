import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { rangoOptions, ubicacionOptions } from '@/lib/catalogs';
import { isCloudinaryConfigured } from '@/lib/cloudinary';
import { EventoForm } from '../EventoForm';

export const metadata: Metadata = { title: 'Crear evento' };

export default async function NuevoEventoPage() {
  await requireAdmin();
  const [ubicaciones, rangos] = await Promise.all([ubicacionOptions(), rangoOptions()]);
  return (
    <div className="flex flex-col gap-6 container-panel">
      <PageHeader eyebrow="Eventos" title="Crear evento" />
      <EventoForm
        ubicaciones={ubicaciones}
        rangos={rangos}
        uploadsEnabled={isCloudinaryConfigured()}
      />
    </div>
  );
}
