/**
 * Prueba de SSE detrás del proxy de Hostinger (ROADMAP F0). Envía 10 eventos, uno cada 2 s.
 * Si llegan de a uno, SSE funciona; si llegan todos juntos al final, el proxy almacena la
 * respuesta y lo «en vivo» será polling. Borrar al cerrar F0 (ver ESTADO.md).
 */
import { getCurrentAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const TOTAL_EVENTS = 10;
const INTERVAL_MS = 2000;

export async function GET(request: Request) {
  // Solo para el panel: evita que cualquiera abra conexiones de 20 s.
  if (!(await getCurrentAdmin())) return new Response(null, { status: 401 });

  const encoder = new TextEncoder();
  let timer: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let sent = 0;
      const send = (text: string) => controller.enqueue(encoder.encode(text));
      // Relleno inicial: algunos proxies no entregan nada hasta juntar unos KB.
      send(`: ${' '.repeat(2048)}\nretry: 5000\n\n`);
      timer = setInterval(() => {
        sent += 1;
        send(`event: ping\ndata: ${JSON.stringify({ n: sent, enviadoEn: Date.now() })}\n\n`);
        if (sent >= TOTAL_EVENTS) {
          clearInterval(timer);
          send('event: fin\ndata: {}\n\n');
          controller.close();
        }
      }, INTERVAL_MS);
      request.signal.addEventListener('abort', () => clearInterval(timer));
    },
    cancel() {
      clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      // nginx (y LiteSpeed compatible) desactiva el buffer de proxy con esta cabecera.
      'X-Accel-Buffering': 'no',
    },
  });
}
