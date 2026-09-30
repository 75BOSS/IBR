import type { Metadata } from 'next';
import { FormAlert } from '@/components/FormAlert';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'Resumen' };

const notices = new Map([
  [
    'sin-permiso',
    'Esa sección es solo para administradores. Si la necesitas, pídele acceso a un administrador.',
  ],
]);

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  const admin = await requireAdmin();
  const { aviso } = await searchParams;
  const notice = aviso ? notices.get(aviso) : undefined;
  const firstName = admin.nombre.split(/\s+/)[0];

  return (
    <section className="flex flex-col gap-6 container-panel">
      {notice && <FormAlert tone="warning">{notice}</FormAlert>}
      <PageHeader
        eyebrow="Resumen"
        title={`Hola, ${firstName}`}
        intro="Aquí verás los registros nuevos de la semana, solicitudes de grupos, peticiones de oración y próximos eventos. Los módulos se habilitan durante la fase 1."
      />
    </section>
  );
}
