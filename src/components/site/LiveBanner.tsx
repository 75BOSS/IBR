'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';

type Status = { activo: boolean; channel_id: string | null; canal_url: string | null };

const POLL_MS = 60_000;

/**
 * Aviso «En vivo»: consulta /api/en-vivo cada minuto (polling: este hosting no permite
 * WebSockets) y aparece solo mientras hay transmisión.
 */
export function LiveBanner() {
  const [status, setStatus] = useState<Status | null>(null);
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        const res = await fetch('/api/en-vivo', { cache: 'no-store' });
        if (res.ok && active) setStatus((await res.json()) as Status);
      } catch {
        // Sin conexión: se reintenta en el próximo ciclo; el aviso simplemente no aparece.
      }
    };
    check();
    const timer = setInterval(check, POLL_MS);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  if (!status?.activo) return null;
  return (
    <section
      role="status"
      aria-label="Transmisión en vivo"
      className="flex flex-col gap-4 rounded-2xl bg-accent-strong p-[clamp(1rem,3vw,1.5rem)] text-surface on-dark"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-display text-h3 font-medium">
          <span className="relative flex size-3">
            <span className="absolute inline-flex size-full rounded-full bg-surface opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex size-3 rounded-full bg-surface" />
          </span>
          Estamos en vivo ahora
        </p>
        {status.channel_id ? (
          <Button
            variant="inverse"
            onClick={() => setWatching((w) => !w)}
            icon={<Icon name="radio" className="size-5" />}
          >
            {watching ? 'Ocultar transmisión' : 'Ver transmisión'}
          </Button>
        ) : (
          status.canal_url && (
            <a
              href={status.canal_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 font-semibold hover:bg-surface/10"
            >
              <Icon name="youtube" className="size-5" /> Ver en YouTube
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          )
        )}
      </div>
      {watching && status.channel_id && (
        <YouTubeEmbed channelId={status.channel_id} title="Transmisión en vivo" startPlaying />
      )}
    </section>
  );
}
