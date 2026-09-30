import 'server-only';
import { query, queryOne } from '@/lib/db';

export type Evento = {
  id: number;
  slug: string;
  titulo: string;
  resumen: string | null;
  cuerpo: string | null;
  categoria: 'evento' | 'noticia' | 'oracion' | 'comunidad' | 'musica' | 'capacitacion';
  fecha_inicio: Date;
  fecha_fin: Date | null;
  todo_el_dia: boolean;
  ubicacion_id: number | null;
  rango_edad_id: number | null;
  imagen_url: string | null;
  imagen_public_id: string | null;
  link_externo: string | null;
  destacado: boolean;
  publicado: boolean;
  ubicacion: string | null;
  ubicacion_direccion: string | null;
  rango_edad: string | null;
  rango_color: string | null;
};

const SELECT = `SELECT e.id, e.slug, e.titulo, e.resumen, e.cuerpo, e.categoria, e.fecha_inicio, e.fecha_fin, e.todo_el_dia,
       e.ubicacion_id, e.rango_edad_id, e.imagen_url, e.imagen_public_id, e.link_externo, e.destacado, e.publicado,
       u.nombre AS ubicacion, CASE WHEN u.publica = 1 THEN u.direccion END AS ubicacion_direccion,
       r.nombre AS rango_edad, r.color AS rango_color
  FROM eventos e
  LEFT JOIN ubicaciones u ON u.id = e.ubicacion_id
  LEFT JOIN rangos_edad r ON r.id = e.rango_edad_id`;

/** Próximos (o en curso) publicados, del más cercano al más lejano. */
export function listUpcomingEventos(limit: number): Promise<Evento[]> {
  return query<Evento>(
    `${SELECT} WHERE e.publicado = 1 AND COALESCE(e.fecha_fin, e.fecha_inicio) >= NOW() - INTERVAL 1 DAY
      ORDER BY e.destacado DESC, e.fecha_inicio LIMIT ?`,
    [limit],
  );
}

/**
 * Los que aún no empiezan, por fecha (resumen del panel). Misma regla que
 * v_dashboard.eventos_proximos, para que el contador y la lista coincidan.
 */
export function listNotStartedEventos(limit: number): Promise<Evento[]> {
  return query<Evento>(
    `${SELECT} WHERE e.publicado = 1 AND e.fecha_inicio >= NOW() ORDER BY e.fecha_inicio LIMIT ?`,
    [limit],
  );
}

export function listPastEventos(limit: number): Promise<Evento[]> {
  return query<Evento>(
    `${SELECT} WHERE e.publicado = 1 AND COALESCE(e.fecha_fin, e.fecha_inicio) < NOW() - INTERVAL 1 DAY
      ORDER BY e.fecha_inicio DESC LIMIT ?`,
    [limit],
  );
}

export function listAllEventos(): Promise<Evento[]> {
  return query<Evento>(`${SELECT} ORDER BY e.fecha_inicio DESC`);
}

export function getEvento(
  where: { id: number } | { slug: string; soloPublicado: true },
): Promise<Evento | null> {
  return 'id' in where
    ? queryOne<Evento>(`${SELECT} WHERE e.id = ?`, [where.id])
    : queryOne<Evento>(`${SELECT} WHERE e.slug = ? AND e.publicado = 1`, [where.slug]);
}
