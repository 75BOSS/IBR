import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { UsuarioForm } from '../UsuarioForm';

export const metadata: Metadata = { title: 'Nuevo usuario' };

export default async function NuevoUsuarioPage() {
  await requireAdmin({ role: 'admin' });
  return (
    <div className="flex flex-col gap-6 container-panel">
      <PageHeader eyebrow="Usuarios" title="Nuevo usuario del panel" />
      <UsuarioForm />
    </div>
  );
}
