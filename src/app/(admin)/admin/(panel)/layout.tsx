import { AdminNav } from '@/components/admin/AdminNav';
import { requireAdmin } from '@/lib/auth';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
      <AdminNav user={{ nombre: admin.nombre, rol: admin.rol }} />
      <main id="contenido" className="min-w-0">
        {children}
      </main>
    </div>
  );
}
