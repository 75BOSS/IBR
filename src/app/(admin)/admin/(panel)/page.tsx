import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'Resumen' };

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const firstName = admin.nombre.split(/\s+/)[0];
  return (
    <section className="px-[clamp(1rem,4vw,2.5rem)] py-[clamp(1.5rem,5vw,3rem)]">
      <p className="text-sm font-semibold tracking-widest text-accent uppercase">Resumen</p>
      <h1 className="mt-2 text-h1 font-semibold text-brand-strong">Hola, {firstName}</h1>
      <p className="mt-2 max-w-prose text-ink-soft">
        Aquí verás los registros nuevos de la semana, solicitudes de grupos, peticiones de oración y
        próximos eventos. Los módulos se habilitan durante la fase 1.
      </p>
    </section>
  );
}
