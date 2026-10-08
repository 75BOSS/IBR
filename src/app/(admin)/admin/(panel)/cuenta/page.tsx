import type { Metadata } from 'next';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { EmailText } from '@/components/EmailText';
import { requireAdmin } from '@/lib/auth';
import { CambioClaveForm } from './CambioClaveForm';

export const metadata: Metadata = { title: 'Mi cuenta' };

export default async function CuentaPage() {
  const me = await requireAdmin();
  return (
    <div className="container-panel">
      <PageHeader eyebrow="Panel" title="Mi cuenta" />
      <Card tone="sunken" className="max-w-2xl">
        <dl className="grid gap-x-6 gap-y-2 md:grid-cols-[auto_1fr]">
          <dt className="text-ink-soft">Nombre</dt>
          <dd className="font-semibold">{me.nombre}</dd>
          <dt className="text-ink-soft">Correo</dt>
          <dd className="font-semibold">
            <EmailText email={me.email} />
          </dd>
          <dt className="text-ink-soft">Rol</dt>
          <dd className="font-semibold">{me.rol === 'admin' ? 'Administrador' : 'Editor'}</dd>
        </dl>
        <p className="mt-3 text-sm text-ink-soft">
          Para cambiar tu nombre, correo o rol, pídeselo a un administrador.
        </p>
      </Card>
      <CambioClaveForm />
    </div>
  );
}
