import { getCupoStatus } from '@/lib/eventos-cupo';
import { id as idSchema } from '@/lib/validators/common';

/** Endpoint público (ROADMAP F2): lugares disponibles de un evento. El sitio lo consulta cada 15 s. */
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const parsed = idSchema.safeParse((await params).id);
  const status = parsed.success ? await getCupoStatus(parsed.data) : null;
  if (!status) return Response.json({ error: 'Evento no encontrado' }, { status: 404 });
  return Response.json(status, { headers: { 'Cache-Control': 'public, max-age=5' } });
}
