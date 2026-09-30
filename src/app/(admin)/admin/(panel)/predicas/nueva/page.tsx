import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { predicaFacets } from '@/lib/predicas';
import { PredicaForm } from '../PredicaForm';

export const metadata: Metadata = { title: 'Agregar prédica' };

export default async function NuevaPredicaPage() {
  await requireAdmin();
  const { series, predicadores } = await predicaFacets(false);
  return (
    <div className="flex flex-col gap-6 container-panel">
      <PageHeader eyebrow="Prédicas" title="Agregar prédica" />
      <PredicaForm series={series} predicadores={predicadores} />
    </div>
  );
}
