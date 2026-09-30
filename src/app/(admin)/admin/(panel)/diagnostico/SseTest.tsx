'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';

type Ping = { n: number; retrasoMs: number; recibidoEn: number };
type Verdict = 'idle' | 'running' | 'ok' | 'buffered' | 'error';

const EXPECTED = 10;

/** Abre /api/ping-sse y mide si los eventos llegan espaciados (SSE ok) o todos juntos. */
export function SseTest() {
  const [pings, setPings] = useState<Ping[]>([]);
  const [verdict, setVerdict] = useState<Verdict>('idle');
  const source = useRef<EventSource | null>(null);

  function start() {
    source.current?.close();
    setPings([]);
    setVerdict('running');
    const received: Ping[] = [];
    const es = new EventSource('/api/ping-sse');
    source.current = es;
    es.addEventListener('ping', (event) => {
      const data = JSON.parse((event as MessageEvent<string>).data) as {
        n: number;
        enviadoEn: number;
      };
      const now = Date.now();
      received.push({ n: data.n, retrasoMs: now - data.enviadoEn, recibidoEn: now });
      setPings([...received]);
    });
    es.addEventListener('fin', () => {
      es.close();
      const first = received[0];
      const last = received.at(-1);
      // Si 10 eventos enviados en 18 s llegan en menos de 4 s, el proxy los retuvo.
      const spread = first && last ? last.recibidoEn - first.recibidoEn : 0;
      setVerdict(received.length === EXPECTED && spread > 12000 ? 'ok' : 'buffered');
    });
    es.onerror = () => {
      if (es.readyState === EventSource.CLOSED) return;
      es.close();
      setVerdict((current) => (current === 'running' ? 'error' : current));
    };
  }

  const messages: Record<
    Verdict,
    { tone: 'neutral' | 'brand' | 'success' | 'warning' | 'danger'; text: string }
  > = {
    idle: { tone: 'neutral', text: 'Sin probar' },
    running: { tone: 'brand', text: `Recibiendo… ${pings.length}/${EXPECTED}` },
    ok: { tone: 'success', text: 'SSE funciona: los eventos llegan en tiempo real' },
    buffered: { tone: 'warning', text: 'El proxy retiene la respuesta: usar polling' },
    error: { tone: 'danger', text: 'La conexión falló: usar polling y revisar el log' },
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={start} pending={verdict === 'running'} pendingLabel="Probando (20 s)…">
          Probar SSE
        </Button>
        <Tag tone={messages[verdict].tone}>{messages[verdict].text}</Tag>
      </div>
      {pings.length > 0 && (
        <ol className="grid grid-cols-2 gap-2 text-sm md:grid-cols-5">
          {pings.map((p) => (
            <li key={p.n} className="rounded-lg bg-sunken px-3 py-2">
              #{p.n} · {p.retrasoMs} ms
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
