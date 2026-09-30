import 'server-only';
import { query, queryOne } from '@/lib/db';

/** Un ministerio es un rango de edad con su identidad (ver ESQUEMA.sql §3). */
export type Ministerio = {
  id: number;
  nombre: string;
  slug: string;
  edad_min: number | null;
  edad_max: number | null;
  nombre_ministerio: string | null;
  descripcion: string | null;
  color: string | null;
  imagen_url: string | null;
  imagen_public_id: string | null;
  orden: number;
  activo: boolean;
  grupos: number;
  reuniones: number;
};

const SELECT = `SELECT r.id, r.nombre, r.slug, r.edad_min, r.edad_max, r.nombre_ministerio, r.descripcion,
       r.color, r.imagen_url, r.imagen_public_id, r.orden, r.activo,
       (SELECT COUNT(*) FROM grupos g WHERE g.rango_edad_id = r.id AND g.publico = 1 AND g.activo = 1) AS grupos,
       (SELECT COUNT(*) FROM reuniones m WHERE m.rango_edad_id = r.id AND m.activo = 1) AS reuniones
  FROM rangos_edad r`;

export function listMinisterios({ soloActivos }: { soloActivos: boolean }): Promise<Ministerio[]> {
  return query<Ministerio>(`${SELECT} WHERE ? = 0 OR r.activo = 1 ORDER BY r.orden, r.nombre`, [
    soloActivos ? 1 : 0,
  ]);
}

export function getMinisterio(id: number): Promise<Ministerio | null> {
  return queryOne<Ministerio>(`${SELECT} WHERE r.id = ?`, [id]);
}

export function getMinisterioPublico(slug: string): Promise<Ministerio | null> {
  return queryOne<Ministerio>(`${SELECT} WHERE r.slug = ? AND r.activo = 1`, [slug]);
}

/** «Jóvenes · 18–30 años» o el nombre propio del ministerio. */
export function ministerioName(m: Pick<Ministerio, 'nombre' | 'nombre_ministerio'>): string {
  return m.nombre_ministerio ?? m.nombre;
}

export function edadText(m: Pick<Ministerio, 'edad_min' | 'edad_max'>): string | null {
  if (m.edad_min === null) return null;
  return m.edad_max !== null ? `${m.edad_min} a ${m.edad_max} años` : `${m.edad_min} años o más`;
}
