import 'server-only';
import { query } from '@/lib/db';

export type Registro = {
  id: number;
  nombres: string;
  apellidos: string | null;
  telefono: string | null;
  email: string | null;
  sector: string | null;
  origen: string;
  como_llego: string | null;
  situacion: string | null;
  peticion: string | null;
  acepta_datos: boolean;
  estado: string;
  notas_admin: string | null;
  creado_en: Date;
  rango_edad: string | null;
  rango_color: string | null;
  grupo: string | null;
};

export type RegistroFilter = { estado?: string | null; origen?: string | null; limit?: number };

export function listRegistros(f: RegistroFilter): Promise<Registro[]> {
  return query<Registro>(
    `SELECT r.id, r.nombres, r.apellidos, r.telefono, r.email, r.sector, r.origen, r.como_llego, r.situacion, r.peticion,
            r.acepta_datos, r.estado, r.notas_admin, r.creado_en, re.nombre AS rango_edad, re.color AS rango_color,
            g.nombre AS grupo
       FROM registros r
       LEFT JOIN rangos_edad re ON re.id = r.rango_edad_id
       LEFT JOIN grupos g ON g.id = r.grupo_id
      WHERE (? IS NULL OR r.estado = ?) AND (? IS NULL OR r.origen = ?)
      ORDER BY r.creado_en DESC
      LIMIT ?`,
    [f.estado ?? null, f.estado ?? null, f.origen ?? null, f.origen ?? null, f.limit ?? 300],
  );
}

export async function countRegistrosPorEstado(origen: string | null): Promise<Map<string, number>> {
  const rows = await query<{ estado: string; n: number }>(
    'SELECT estado, COUNT(*) AS n FROM registros WHERE (? IS NULL OR origen = ?) GROUP BY estado',
    [origen, origen],
  );
  return new Map(rows.map((r) => [r.estado, Number(r.n)]));
}
