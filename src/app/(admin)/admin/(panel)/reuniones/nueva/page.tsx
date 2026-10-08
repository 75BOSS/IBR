import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { rangoOptions, ubicacionOptions } from '@/lib/catalogs';
import { ReunionForm } from '../ReunionForm';

export const metadata: Metadata = { title: 'Agregar reunión' };

export default async function NuevaReunionPage() {
  await requireAdmin();
  const [ubicaciones, rangos] = await Promise.all([ubicacionOptions(), rangoOptions()]);
  return (
    <div className="container-panel">
      <PageHeader eyebrow="Reuniones" title="Agregar reunión" />
      <ReunionForm ubicaciones={ubicaciones} rangos={rangos} />
    </div>
  );
}
