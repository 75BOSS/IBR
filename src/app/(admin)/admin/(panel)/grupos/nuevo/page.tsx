import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { rangoOptions, ubicacionOptions } from '@/lib/catalogs';
import { isCloudinaryConfigured } from '@/lib/cloudinary';
import { FRECUENCIAS } from '@/lib/grupos';
import { GrupoForm } from '../GrupoForm';

export const metadata: Metadata = { title: 'Crear grupo' };

export default async function NuevoGrupoPage() {
  await requireAdmin();
  const [ubicaciones, rangos] = await Promise.all([ubicacionOptions(), rangoOptions()]);
  return (
    <div className="container-panel">
      <PageHeader eyebrow="Grupos" title="Crear grupo" />
      <GrupoForm
        ubicaciones={ubicaciones}
        rangos={rangos}
        frecuencias={FRECUENCIAS}
        uploadsEnabled={isCloudinaryConfigured()}
      />
    </div>
  );
}
