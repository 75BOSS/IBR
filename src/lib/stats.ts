import 'server-only';
import { queryOne } from '@/lib/db';

export type ChurchStats = { grupos: number; ministerios: number; reuniones: number; areas: number };

/** Cifras públicas de la iglesia para «Nosotros» (lo mismo que el sitio ya muestra). */
export async function getChurchStats(): Promise<ChurchStats> {
  const row = await queryOne<ChurchStats>(
    `SELECT (SELECT COUNT(*) FROM grupos WHERE publico = 1 AND activo = 1) AS grupos,
            (SELECT COUNT(*) FROM rangos_edad WHERE activo = 1) AS ministerios,
            (SELECT COUNT(*) FROM reuniones WHERE activo = 1) AS reuniones,
            (SELECT COUNT(*) FROM areas_servicio WHERE activo = 1) AS areas`,
  );
  return {
    grupos: Number(row?.grupos ?? 0),
    ministerios: Number(row?.ministerios ?? 0),
    reuniones: Number(row?.reuniones ?? 0),
    areas: Number(row?.areas ?? 0),
  };
}
