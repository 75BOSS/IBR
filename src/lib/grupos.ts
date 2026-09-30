import 'server-only';
import { query, queryOne } from '@/lib/db';
import type { GrupoPublico } from '@/lib/grupos-public';

export type Grupo = {
  id: number;
  nombre: string;
  descripcion: string | null;
  tipo: string | null;
  rango_edad_id: number | null;
  ubicacion_id: number | null;
  dia_semana: number | null;
  hora: string | null;
  frecuencia: 'semanal' | 'quincenal' | 'mensual';
  lider_nombre: string | null;
  lider_telefono: string | null;
  lider_email: string | null;
  cupo: number | null;
  imagen_url: string | null;
  imagen_public_id: string | null;
  publico: boolean;
  activo: boolean;
  rango_edad: string | null;
  rango_color: string | null;
  ubicacion: string | null;
  zona: string | null;
  direccion: string | null;
  solicitudes_pendientes: number;
};

const SELECT = `SELECT g.id, g.nombre, g.descripcion, g.tipo, g.rango_edad_id, g.ubicacion_id, g.dia_semana, g.hora,
       g.frecuencia, g.lider_nombre, g.lider_telefono, g.lider_email, g.cupo, g.imagen_url, g.imagen_public_id,
       g.publico, g.activo, r.nombre AS rango_edad, r.color AS rango_color, u.nombre AS ubicacion, u.zona,
       CASE WHEN u.publica = 1 THEN u.direccion END AS direccion,
       (SELECT COUNT(*) FROM solicitudes_grupo s WHERE s.grupo_id = g.id AND s.estado = 'pendiente') AS solicitudes_pendientes
  FROM grupos g
  LEFT JOIN rangos_edad r ON r.id = g.rango_edad_id
  LEFT JOIN ubicaciones u ON u.id = g.ubicacion_id`;

export function listGruposAdmin(): Promise<Grupo[]> {
  return query<Grupo>(`${SELECT} ORDER BY g.activo DESC, g.nombre`);
}

/** Grupo completo para el panel (incluye datos privados del líder). */
export function getGrupo(id: number): Promise<Grupo | null> {
  return queryOne<Grupo>(`${SELECT} WHERE g.id = ?`, [id]);
}

export type GrupoFilter = {
  zona?: string | null;
  dia?: number | null;
  rango?: number | null;
  tipo?: string | null;
};

const PUBLIC_SELECT = `SELECT g.id, g.nombre, g.descripcion, g.tipo, g.dia_semana, g.hora, g.frecuencia, g.lider_nombre,
       g.cupo, g.imagen_url, g.rango_edad_id, r.nombre AS rango_edad, r.color AS rango_color,
       u.nombre AS ubicacion, u.tipo AS ubicacion_tipo, u.zona,
       CASE WHEN u.publica = 1 THEN u.direccion END AS direccion
  FROM grupos g
  LEFT JOIN rangos_edad r ON r.id = g.rango_edad_id
  LEFT JOIN ubicaciones u ON u.id = g.ubicacion_id
 WHERE g.publico = 1 AND g.activo = 1`;

/**
 * Directorio público: solo publico = 1 AND activo = 1 (ROADMAP). No incluye teléfono ni
 * correo del líder, ni la dirección de casas no públicas.
 */
export function listGruposPublicos(f: GrupoFilter): Promise<GrupoPublico[]> {
  return query<GrupoPublico>(
    `${PUBLIC_SELECT}
        AND (? IS NULL OR u.zona = ?) AND (? IS NULL OR g.dia_semana = ?)
        AND (? IS NULL OR g.rango_edad_id = ?) AND (? IS NULL OR g.tipo = ?)
      ORDER BY r.orden IS NULL, r.orden, g.dia_semana IS NULL, g.dia_semana, g.hora, g.nombre`,
    [
      f.zona ?? null,
      f.zona ?? null,
      f.dia ?? null,
      f.dia ?? null,
      f.rango ?? null,
      f.rango ?? null,
      f.tipo ?? null,
      f.tipo ?? null,
    ],
  );
}

export function getGrupoPublico(id: number): Promise<GrupoPublico | null> {
  return queryOne<GrupoPublico>(`${PUBLIC_SELECT} AND g.id = ?`, [id]);
}

/** Valores existentes para los filtros públicos. */
export async function grupoFacets(): Promise<{ zonas: string[]; tipos: string[] }> {
  const [zonas, tipos] = await Promise.all([
    query<{ v: string }>(
      `SELECT DISTINCT u.zona AS v FROM grupos g JOIN ubicaciones u ON u.id = g.ubicacion_id
        WHERE g.publico = 1 AND g.activo = 1 AND u.zona IS NOT NULL ORDER BY u.zona`,
    ),
    query<{ v: string }>(
      'SELECT DISTINCT tipo AS v FROM grupos WHERE publico = 1 AND activo = 1 AND tipo IS NOT NULL ORDER BY tipo',
    ),
  ]);
  return { zonas: zonas.map((r) => r.v), tipos: tipos.map((r) => r.v) };
}

export const FRECUENCIAS = [
  { value: 'semanal', label: 'Cada semana' },
  { value: 'quincenal', label: 'Cada 15 días' },
  { value: 'mensual', label: 'Una vez al mes' },
];
