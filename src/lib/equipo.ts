import 'server-only';
import { query, queryOne } from '@/lib/db';

export type EquipoRow = {
  id: number;
  nombre: string;
  rol: string;
  bio: string | null;
  foto_url: string | null;
  es_pastor: boolean;
  orden: number;
  visible: boolean;
};

const SELECT = 'SELECT id, nombre, rol, bio, foto_url, es_pastor, orden, visible FROM equipo';

/** Todo el equipo (panel). */
export function listEquipo(): Promise<EquipoRow[]> {
  return query<EquipoRow>(`${SELECT} ORDER BY orden, nombre`);
}

export function getEquipo(id: number): Promise<EquipoRow | null> {
  return queryOne<EquipoRow>(`${SELECT} WHERE id = ?`, [id]);
}

/** Pastores visibles, para el inicio. */
export function listPastores(): Promise<EquipoRow[]> {
  return query<EquipoRow>(`${SELECT} WHERE es_pastor = 1 AND visible = 1 ORDER BY orden, nombre`);
}

/** Equipo visible en el sitio: pastores primero y luego líderes (página «Nosotros»). */
export function listEquipoVisible(): Promise<EquipoRow[]> {
  return query<EquipoRow>(`${SELECT} WHERE visible = 1 ORDER BY es_pastor DESC, orden, nombre`);
}
