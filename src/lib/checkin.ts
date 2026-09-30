import 'server-only';
import { query, queryOne } from '@/lib/db';

export type CheckinStats = {
  /** Lugares de inscripciones no canceladas. */
  esperadas: number;
  /** Lugares de quienes ya registraron su llegada. */
  llegaron: number;
  recientes: { nombre: string; personas: number; checkin_en: string }[];
};

/** Estado del check-in de un evento (tablero de ujieres, se consulta cada 10 s). */
export async function getCheckinStats(eventoId: number): Promise<CheckinStats> {
  const [totals, recientes] = await Promise.all([
    queryOne<{ esperadas: number | string; llegaron: number | string }>(
      `SELECT COALESCE(SUM(personas), 0) AS esperadas,
              COALESCE(SUM(CASE WHEN estado = 'asistio' THEN personas END), 0) AS llegaron
         FROM inscripciones WHERE evento_id = ? AND estado <> 'cancelada'`,
      [eventoId],
    ),
    query<{ nombre: string; personas: number; checkin_en: Date }>(
      `SELECT nombre, personas, checkin_en FROM inscripciones
        WHERE evento_id = ? AND estado = 'asistio' AND checkin_en IS NOT NULL
        ORDER BY checkin_en DESC LIMIT 8`,
      [eventoId],
    ),
  ]);
  return {
    esperadas: Number(totals?.esperadas ?? 0),
    llegaron: Number(totals?.llegaron ?? 0),
    recientes: recientes.map((r) => ({ ...r, checkin_en: r.checkin_en.toISOString() })),
  };
}
