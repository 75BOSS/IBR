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
  /** 1 si tiene algo que mostrar (MINISTERIO_CON_CONTENIDO): solo entonces el sitio lo enlaza. */
  con_contenido: number;
};

/**
 * Un ministerio tiene algo que mostrar si tiene descripción, foto, grupos o reuniones. Sin eso,
 * su página quedaría vacía: el sitio no lo enlaza (lista, portada, Soy nuevo, menú, sitemap) y
 * el panel lo avisa. Condición única sobre el alias `r` de rangos_edad.
 */
export const MINISTERIO_CON_CONTENIDO = `(COALESCE(r.descripcion, '') <> '' OR r.imagen_url IS NOT NULL
  OR EXISTS (SELECT 1 FROM grupos g WHERE g.rango_edad_id = r.id AND g.publico = 1 AND g.activo = 1)
  OR EXISTS (SELECT 1 FROM reuniones m WHERE m.rango_edad_id = r.id AND m.activo = 1))`;

const SELECT = `SELECT r.id, r.nombre, r.slug, r.edad_min, r.edad_max, r.nombre_ministerio, r.descripcion,
       r.color, r.imagen_url, r.imagen_public_id, r.orden, r.activo,
       (SELECT COUNT(*) FROM grupos g WHERE g.rango_edad_id = r.id AND g.publico = 1 AND g.activo = 1) AS grupos,
       (SELECT COUNT(*) FROM reuniones m WHERE m.rango_edad_id = r.id AND m.activo = 1) AS reuniones,
       ${MINISTERIO_CON_CONTENIDO} AS con_contenido
  FROM rangos_edad r`;

export function listMinisterios({
  soloActivos,
  conContenido = false,
}: {
  soloActivos: boolean;
  /** Solo los que tienen algo que mostrar (sitio público). */
  conContenido?: boolean;
}): Promise<Ministerio[]> {
  return query<Ministerio>(
    `${SELECT} WHERE (? = 0 OR r.activo = 1) AND (? = 0 OR ${MINISTERIO_CON_CONTENIDO})
      ORDER BY r.orden, r.nombre`,
    [soloActivos ? 1 : 0, conContenido ? 1 : 0],
  );
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
