import 'server-only';
import { type CupoStatus, cupoStatus } from '@/lib/cupo';
import { queryOne } from '@/lib/db';

/** Estado del cupo de un evento publicado, o null si no existe o no está publicado. */
export async function getCupoStatus(eventoId: number): Promise<CupoStatus | null> {
  const row = await queryOne<{
    publicado: boolean;
    requiere_inscripcion: boolean;
    cupo: number | null;
    fecha_inicio: Date;
    inscritos: number | string;
  }>(
    `SELECT e.publicado, e.requiere_inscripcion, e.cupo, e.fecha_inicio,
            (SELECT COALESCE(SUM(i.personas), 0) FROM inscripciones i
              WHERE i.evento_id = e.id AND i.estado <> 'cancelada') AS inscritos
       FROM eventos e WHERE e.id = ? AND e.publicado = 1`,
    [eventoId],
  );
  return row ? cupoStatus({ ...row, inscritos: Number(row.inscritos) }) : null;
}
