'use client';

import { Button } from '@/components/Button';
import { useToast } from '@/components/Toast';

export function ToastDemo() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={() => toast({ message: 'Guardado' })}>
        Toast de éxito
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ tone: 'info', message: 'El evento se publicará a las 18:00.' })}
      >
        Toast informativo
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({ tone: 'error', message: 'No se pudo guardar. Revisa tu conexión y reintenta.' })
        }
      >
        Toast de error
      </Button>
    </div>
  );
}
