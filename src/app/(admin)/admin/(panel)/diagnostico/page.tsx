import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { getClientIp } from '@/lib/request';
import { SseTest } from './SseTest';

export const metadata: Metadata = { title: 'Diagnóstico' };

const PROXY_HEADERS = [
  'x-forwarded-for',
  'x-real-ip',
  'x-forwarded-proto',
  'x-forwarded-host',
  'via',
  'cf-connecting-ip',
];

/**
 * Pruebas de infraestructura de F0 en Hostinger: SSE detrás del proxy y cabeceras que
 * determinan la IP del visitante. Temporal: se borra al cerrar F0 junto con /api/ping-sse.
 */
export default async function DiagnosticsPage() {
  await requireAdmin({ role: 'admin' });
  const h = await headers();
  const detectedIp = await getClientIp();

  return (
    <div className="flex flex-col gap-6 container-panel">
      <PageHeader
        eyebrow="Temporal · F0"
        title="Diagnóstico del hosting"
        intro="Abre esta página en dev.ibriglesia.com y anota los resultados en ESTADO.md."
      />
      <Card title="1 · SSE detrás del proxy">
        <SseTest />
      </Card>
      <Card title="2 · Cabeceras del proxy (IP del visitante)">
        <dl className="grid gap-x-6 gap-y-2 text-sm md:grid-cols-[max-content_minmax(0,1fr)]">
          {PROXY_HEADERS.map((name) => (
            <div key={name} className="contents">
              <dt className="font-semibold">{name}</dt>
              <dd className="break-all text-ink-soft">{h.get(name) ?? '— (no llega)'}</dd>
            </div>
          ))}
          <dt className="font-semibold text-brand-strong">IP que usa el sitio</dt>
          <dd className="font-semibold text-brand-strong">{detectedIp}</dd>
        </dl>
      </Card>
    </div>
  );
}
