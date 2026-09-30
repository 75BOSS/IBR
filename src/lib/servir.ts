import 'server-only';
import { query, queryOne } from '@/lib/db';

export type Area = {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  responsable_id: number | null;
  responsable: string | null;
  imagen_url: string | null;
  imagen_public_id: string | null;
  activo: boolean;
  orden: number;
  voluntarios: number;
  nuevos: number;
};

const AREA_SELECT = `SELECT a.id, a.nombre, a.slug, a.descripcion, a.responsable_id, q.nombre AS responsable,
       a.imagen_url, a.imagen_public_id, a.activo, a.orden,
       (SELECT COUNT(*) FROM voluntarios v WHERE v.area_id = a.id) AS voluntarios,
       (SELECT COUNT(*) FROM voluntarios v WHERE v.area_id = a.id AND v.estado = 'nuevo') AS nuevos
  FROM areas_servicio a
  LEFT JOIN equipo q ON q.id = a.responsable_id`;

export function listAreas({ soloActivas }: { soloActivas: boolean }): Promise<Area[]> {
  return query<Area>(`${AREA_SELECT} WHERE ? = 0 OR a.activo = 1 ORDER BY a.orden, a.nombre`, [
    soloActivas ? 1 : 0,
  ]);
}

export function getArea(id: number): Promise<Area | null> {
  return queryOne<Area>(`${AREA_SELECT} WHERE a.id = ?`, [id]);
}

export type Voluntario = {
  id: number;
  area_id: number;
  area: string;
  nombre: string;
  telefono: string;
  email: string | null;
  disponibilidad: string | null;
  mensaje: string | null;
  estado: string;
  notas: string | null;
  creado_en: Date;
};

export function listVoluntarios(f: {
  estado?: string | null;
  areaId?: number | null;
}): Promise<Voluntario[]> {
  return query<Voluntario>(
    `SELECT v.id, v.area_id, a.nombre AS area, v.nombre, v.telefono, v.email, v.disponibilidad, v.mensaje,
            v.estado, v.notas, v.creado_en
       FROM voluntarios v JOIN areas_servicio a ON a.id = v.area_id
      WHERE (? IS NULL OR v.estado = ?) AND (? IS NULL OR v.area_id = ?)
      ORDER BY v.creado_en DESC
      LIMIT 2000`,
    [f.estado ?? null, f.estado ?? null, f.areaId ?? null, f.areaId ?? null],
  );
}

export async function countVoluntariosPorEstado(
  areaId: number | null,
): Promise<Map<string, number>> {
  const rows = await query<{ estado: string; n: number }>(
    'SELECT estado, COUNT(*) AS n FROM voluntarios WHERE (? IS NULL OR area_id = ?) GROUP BY estado',
    [areaId, areaId],
  );
  return new Map(rows.map((r) => [r.estado, Number(r.n)]));
}
