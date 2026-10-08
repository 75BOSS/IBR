import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { getUsuario } from '@/lib/usuarios';
import { id as idSchema } from '@/lib/validators/common';
import { UsuarioForm } from '../UsuarioForm';

export const metadata: Metadata = { title: 'Editar usuario' };

export default async function EditarUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireAdmin({ role: 'admin' });
  const parsed = idSchema.safeParse((await params).id);
  if (!parsed.success) notFound();
  const user = await getUsuario(parsed.data);
  if (!user) notFound();
  const isSelf = user.id === me.id;
  return (
    <div className="container-panel">
      <PageHeader
        eyebrow="Usuarios"
        title={`Editar: ${user.nombre}`}
        intro={
          isSelf
            ? 'Es tu cuenta: tu rol y el estado solo los puede cambiar otro administrador.'
            : undefined
        }
      />
      <UsuarioForm user={user} isSelf={isSelf} />
    </div>
  );
}
