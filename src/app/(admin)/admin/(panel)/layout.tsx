import { logout } from '@/actions/auth';
import { Button } from '@/components/Button';
import { requireAdmin } from '@/lib/auth';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-dvh">
      <header className="flex items-center justify-between gap-4 bg-sidebar px-4 py-3 text-sidebar-ink">
        <span className="font-display font-semibold">Panel IBR</span>
        <form action={logout} className="flex items-center gap-3">
          <span className="text-sm text-sidebar-muted">{admin.nombre}</span>
          <Button type="submit" variant="secondary" size="sm">
            Cerrar sesión
          </Button>
        </form>
      </header>
      {children}
    </div>
  );
}
