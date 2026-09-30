import { getLiveStatus } from '@/lib/live-status';

/** Endpoint público (ROADMAP): estado del botón «En vivo». Lo consulta el sitio cada minuto. */
export const dynamic = 'force-dynamic';

export async function GET() {
  const status = await getLiveStatus();
  return Response.json(status, { headers: { 'Cache-Control': 'public, max-age=30' } });
}
