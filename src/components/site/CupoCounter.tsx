'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/Icon';
import { type CupoStatus, disponiblesText } from '@/lib/cupo';

const POLL_MS = 15_000;

/**
 * Lugares disponibles de un evento, al día: consulta /api/eventos/[id]/cupo cada 15 s
 * (polling: este hosting no permite WebSockets). Empieza con el valor que trae la página y
 * consulta apenas carga, porque la página puede venir de la caché (hasta 5 min). Quien lo usa le
 * pone `key` con el conteo, así un valor nuevo del servidor lo reinicia.
 */
export function CupoCounter({ eventoId, initial }: { eventoId: number; initial: CupoStatus }) {
  const [status, setStatus] = useState(initial);

  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        const res = await fetch(`/api/eventos/${eventoId}/cupo`, { cache: 'no-store' });
        if (res.ok && active) setStatus((await res.json()) as CupoStatus);
      } catch {
        // Sin conexión: se reintenta en el próximo ciclo y queda el último valor conocido.
      }
    };
    check();
    const timer = setInterval(check, POLL_MS);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [eventoId]);

  const full = status.disponibles === 0;
  const percent =
    status.cupo && status.cupo > 0 ? Math.min(100, (status.inscritos / status.cupo) * 100) : null;
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-2">
      <p
        className={`flex items-center gap-2 font-semibold ${full ? 'text-danger' : 'text-success'}`}
      >
        <Icon name={full ? 'warning' : 'users'} className="size-5" />
        {disponiblesText(status)}
      </p>
      {percent !== null && (
        <div
          className="h-2 overflow-hidden rounded-full bg-sunken"
          aria-hidden="true"
          title={`${status.inscritos} de ${status.cupo} lugares ocupados`}
        >
          <div
            className={`h-full rounded-full ${full ? 'bg-danger' : 'bg-success'}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
      {!status.abierto && status.motivo && status.disponibles !== 0 && (
        <p className="text-sm text-ink-soft">{status.motivo}</p>
      )}
    </div>
  );
}
