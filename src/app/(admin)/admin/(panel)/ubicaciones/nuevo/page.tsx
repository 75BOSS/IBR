import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { UBICACION_TIPOS } from '@/lib/catalogs';
import { UbicacionForm } from '../UbicacionForm';

export const metadata: Metadata = { title: 'Agregar lugar' };

export default async function NuevaUbicacionPage() {
  await requireAdmin();
  return (
    <div className="flex flex-col gap-6 container-panel">
      <PageHeader eyebrow="Lugares" title="Agregar lugar" />
      <UbicacionForm tipos={UBICACION_TIPOS} />
    </div>
  );
}
