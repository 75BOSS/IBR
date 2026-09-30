'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@/components/Button';

/** Error inesperado en el panel (BD caída, variable faltante…): qué pasó y cómo seguir. */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [retrying, startRetry] = useTransition();

  // reset() solo re-renderiza lo ya recibido; refresh() vuelve a pedirle los datos al servidor.
  const retry = () =>
    startRetry(() => {
      router.refresh();
      reset();
    });

  return (
    <main className="container-page flex min-h-[60dvh] flex-col items-start justify-center gap-4 py-12">
      <p className="text-sm font-semibold tracking-widest text-danger uppercase">Algo falló</p>
      <h1 className="text-h1 font-semibold text-ink">No pudimos cargar esta pantalla</h1>
      <p className="max-w-prose text-ink-soft">
        Puede ser un problema momentáneo de conexión con la base de datos. Pulsa «Reintentar»; si
        vuelve a pasar, avisa a Pixelia con este código:{' '}
        <code className="rounded bg-sunken px-1.5 py-0.5 text-sm">
          {error.digest ?? 'sin código'}
        </code>
      </p>
      <Button onClick={retry} pending={retrying} pendingLabel="Reintentando…">
        Reintentar
      </Button>
    </main>
  );
}
