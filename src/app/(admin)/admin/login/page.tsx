import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { BrandMark } from '@/components/BrandMark';
import { Card } from '@/components/Card';
import { FormAlert } from '@/components/FormAlert';
import { getCurrentAdmin } from '@/lib/auth';
import { safeAdminPath } from '@/lib/validators/auth';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Iniciar sesión' };

const notices = new Map([['salida', 'Cerraste sesión en todos tus dispositivos. ¡Hasta pronto!']]);

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; aviso?: string }>;
}) {
  const { next, aviso } = await searchParams;
  if (await getCurrentAdmin()) redirect(safeAdminPath(next));

  const notice = aviso ? notices.get(aviso) : undefined;
  const target = next ? safeAdminPath(next) : undefined;

  return (
    <main className="grid min-h-dvh grid-rows-[auto_1fr] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:grid-rows-1">
      <section className="flex flex-col justify-between gap-6 bg-sidebar px-[clamp(1.25rem,5vw,4rem)] py-[clamp(1.25rem,5vw,4rem)] text-sidebar-ink on-dark">
        <div className="flex items-center gap-3">
          <BrandMark size="lg" />
          <span className="text-sm leading-tight font-semibold tracking-wide text-sidebar-muted uppercase">
            Iglesia Bíblica
            <br />
            Riobamba
          </span>
        </div>
        <div className="hidden max-w-md md:block">
          <p className="font-display text-h2 leading-snug">
            «Nadie tiene mayor amor que este, que uno ponga su vida por sus amigos.»
          </p>
          <p className="mt-3 text-sidebar-muted">Juan 15:13</p>
        </div>
        <p className="hidden text-sm text-sidebar-muted md:block">Panel de administración</p>
      </section>

      <section className="flex items-start justify-center px-[clamp(1rem,5vw,4rem)] py-[clamp(1.5rem,6vw,5rem)] lg:items-center">
        <Card emphasis="featured" className="w-full max-w-md">
          <h1 className="text-h1 font-semibold text-brand-strong">Iniciar sesión</h1>
          <p className="mt-2 text-ink-soft">
            {target
              ? 'Inicia sesión para continuar donde estabas.'
              : 'Entra con el correo que te registró el equipo.'}
          </p>
          {notice && (
            <FormAlert tone="success" className="mt-4">
              {notice}
            </FormAlert>
          )}
          <div className="mt-6">
            <LoginForm next={target} />
          </div>
          <p className="mt-6 text-sm text-ink-soft">
            ¿Olvidaste tu contraseña? Pide a un administrador que la restablezca.
          </p>
        </Card>
      </section>
    </main>
  );
}
