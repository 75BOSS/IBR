import { getCurrentAdmin } from '@/lib/auth';
import { getCheckinStats } from '@/lib/checkin';
import { id as idSchema } from '@/lib/validators/common';

/** Contadores del tablero de check-in (solo panel). El tablero lo consulta cada 10 s. */
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getCurrentAdmin()))
    return Response.json({ error: 'Inicia sesión en el panel.' }, { status: 401 });
  const parsed = idSchema.safeParse((await params).id);
  if (!parsed.success) return Response.json({ error: 'Evento no válido.' }, { status: 400 });
  return Response.json(await getCheckinStats(parsed.data), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
