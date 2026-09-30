'use client';

import { startTransition, useActionState, useCallback, useEffect, useRef, useState } from 'react';
import { checkIn } from '@/actions/inscripciones';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Field } from '@/components/Field';
import { Icon } from '@/components/Icon';
import type { CheckinStats } from '@/lib/checkin';
import { type FormState, initialFormState } from '@/lib/form-state';

const POLL_MS = 10_000;
const SCAN_MS = 350;
/** El mismo QR frente a la cámara no se registra dos veces seguidas. */
const SAME_CODE_PAUSE_MS = 4000;

// BarcodeDetector existe en Chrome/Edge de Android y escritorio; aún no está en los tipos de TS.
type Detector = { detect(source: HTMLVideoElement): Promise<{ rawValue: string }[]> };
type DetectorCtor = new (options: { formats: string[] }) => Detector;
const getDetector = (): DetectorCtor | undefined =>
  (globalThis as unknown as { BarcodeDetector?: DetectorCtor }).BarcodeDetector;

const timeText = (iso: string) =>
  new Intl.DateTimeFormat('es-EC', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Guayaquil',
  }).format(new Date(iso));

/**
 * Tablero de la puerta para ujieres: registra llegadas escaneando el QR con la cámara o
 * escribiendo el código, y muestra cuántos llegaron (se actualiza cada 10 s: polling, no
 * WebSockets). El último resultado queda grande en pantalla para verlo de un vistazo.
 */
export function CheckinBoard({ eventoId, initial }: { eventoId: number; initial: CheckinStats }) {
  const [stats, setStats] = useState(initial);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState(0);
  const video = useRef<HTMLVideoElement>(null);
  const lastScan = useRef<{ code: string; at: number } | null>(null);
  // QR que ya entraron en esta pantalla: si la persona deja el QR frente a la cámara, no se
  // vuelve a enviar (y el «Bienvenido» no cambia a «ya registró su llegada»).
  const admitted = useRef(new Set<string>());

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/admin/eventos-checkin/${eventoId}`, { cache: 'no-store' });
      if (res.ok) setStats((await res.json()) as CheckinStats);
    } catch {
      // Sin conexión: se reintenta en el próximo ciclo; queda el último conteo.
    }
  }, [eventoId]);

  const [result, formAction, pending] = useActionState<FormState, FormData>(
    async (prev, formData) => {
      const next = await checkIn(prev, formData);
      if (next.status === 'success') {
        setInputKey((k) => k + 1);
        const scanned = formData.get('escaneado');
        if (typeof scanned === 'string') admitted.current.add(scanned);
      }
      await refresh();
      return next;
    },
    initialFormState,
  );

  useEffect(() => {
    const timer = setInterval(refresh, POLL_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  const submitCode = useCallback(
    (code: string) => {
      const fd = new FormData();
      fd.set('evento_id', String(eventoId));
      fd.set('codigo', code);
      fd.set('escaneado', code);
      startTransition(() => formAction(fd));
    },
    [eventoId, formAction],
  );

  // Cámara + lector de QR mientras «scanning» esté activo.
  useEffect(() => {
    if (!scanning) return;
    const Ctor = getDetector();
    if (!Ctor) {
      setCameraError(
        'Este navegador no puede leer códigos QR. Usa Chrome en Android o escribe el código.',
      );
      setScanning(false);
      return;
    }
    let stream: MediaStream | null = null;
    let timer: ReturnType<typeof setInterval> | undefined;
    let stopped = false;
    const detector = new Ctor({ formats: ['qr_code'] });
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then(async (s) => {
        if (stopped) return s.getTracks().forEach((t) => t.stop());
        stream = s;
        if (!video.current) return;
        video.current.srcObject = s;
        await video.current.play();
        timer = setInterval(async () => {
          if (!video.current || video.current.readyState < 2) return;
          const [found] = await detector.detect(video.current).catch(() => []);
          if (!found) return;
          const now = Date.now();
          if (admitted.current.has(found.rawValue)) return;
          const last = lastScan.current;
          if (last && last.code === found.rawValue && now - last.at < SAME_CODE_PAUSE_MS) return;
          lastScan.current = { code: found.rawValue, at: now };
          submitCode(found.rawValue);
        }, SCAN_MS);
      })
      .catch(() => {
        setCameraError(
          'No pudimos usar la cámara. Revisa el permiso de cámara del navegador o escribe el código.',
        );
        setScanning(false);
      });
    return () => {
      stopped = true;
      if (timer) clearInterval(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [scanning, submitCode]);

  const percent = stats.esperadas > 0 ? Math.min(100, (stats.llegaron / stats.esperadas) * 100) : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
      <div className="flex flex-col gap-4">
        <div
          role="status"
          aria-live="assertive"
          className={`flex min-h-24 items-center gap-3 rounded-2xl p-[clamp(1rem,3vw,1.5rem)] font-display text-h3 font-semibold ${
            result.status === 'success'
              ? 'bg-success text-surface'
              : result.status === 'error'
                ? 'bg-danger text-surface'
                : 'bg-sunken text-ink-soft'
          }`}
        >
          <Icon
            name={
              result.status === 'success' ? 'check' : result.status === 'error' ? 'warning' : 'info'
            }
            className="size-8 shrink-0"
          />
          <span>
            {result.message ?? 'Escanea un QR o escribe un código para registrar la llegada.'}
          </span>
        </div>

        <Card as="section" title="Registrar llegada">
          <div className="flex flex-col gap-4">
            <form
              action={formAction}
              className="flex flex-col gap-3 md:flex-row md:items-end"
              noValidate
            >
              <input type="hidden" name="evento_id" value={eventoId} />
              <Field
                key={inputKey}
                label="Código"
                required
                name="codigo"
                autoComplete="off"
                autoCapitalize="characters"
                placeholder="ej. AB3D EF7H"
                className="flex-1"
                autoFocus
              />
              <Button type="submit" pendingLabel="Registrando…" disabled={pending}>
                Registrar
              </Button>
            </form>
            <div className="flex flex-col gap-2">
              <Button
                variant={scanning ? 'secondary' : 'primary'}
                onClick={() => {
                  setCameraError(null);
                  setScanning((s) => !s);
                }}
                icon={<Icon name={scanning ? 'close' : 'search'} className="size-5" />}
                className="md:self-start"
              >
                {scanning ? 'Apagar cámara' : 'Escanear QR con la cámara'}
              </Button>
              {cameraError && <p className="text-sm font-medium text-danger">{cameraError}</p>}
              {scanning && (
                <video
                  ref={video}
                  muted
                  playsInline
                  aria-label="Vista de la cámara para leer el código QR"
                  className="aspect-square w-full max-w-sm rounded-2xl bg-ink object-cover"
                />
              )}
            </div>
          </div>
        </Card>
      </div>

      <Card as="section" tone="brand" emphasis="featured">
        <p className="text-sm font-semibold tracking-widest text-accent-soft uppercase">Llegaron</p>
        <p className="mt-1 font-display text-display leading-none font-semibold tabular-nums">
          {stats.llegaron}
          <span className="text-h2 text-surface/70"> / {stats.esperadas}</span>
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface/20" aria-hidden="true">
          <div className="h-full rounded-full bg-accent-soft" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-4 text-sm font-semibold text-accent-soft">Últimas llegadas</p>
        {stats.recientes.length > 0 ? (
          <ul className="mt-2 flex flex-col gap-1.5">
            {stats.recientes.map((r, i) => (
              <li
                key={`${r.checkin_en}-${i}`}
                className="flex justify-between gap-3 text-surface/90"
              >
                <span className="truncate">
                  {r.nombre}
                  {r.personas > 1 ? ` (${r.personas})` : ''}
                </span>
                <span className="shrink-0 tabular-nums">{timeText(r.checkin_en)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-surface/80">Todavía no llega nadie.</p>
        )}
      </Card>
    </div>
  );
}
