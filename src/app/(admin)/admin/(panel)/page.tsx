import { requireAdmin } from '@/lib/auth';

export default async function DashboardPage() {
  const admin = await requireAdmin();
  return (
    <main className="container-page py-10">
      <h1 className="text-h1 font-semibold text-brand-strong">Hola, {admin.nombre}</h1>
      <p className="mt-2 text-ink-soft">El resumen de la semana llega en la fase 1.</p>
    </main>
  );
}
