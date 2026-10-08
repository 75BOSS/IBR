import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { rangoOptions } from '@/lib/catalogs';
import { RegistroForm } from './RegistroForm';

export const metadata: Metadata = { title: 'Agregar persona' };

export default async function NuevoRegistroPage() {
  await requireAdmin();
  return (
    <div className="container-panel">
      <PageHeader
        eyebrow="Registros"
        title="Agregar persona"
        intro="Para quien llegó en persona o en un evento."
      />
      <RegistroForm rangos={await rangoOptions()} />
    </div>
  );
}
