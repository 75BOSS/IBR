import 'server-only';
import { query } from '@/lib/db';

export type Peticion = {
  id: number;
  nombre: string | null;
  telefono: string | null;
  email: string | null;
  /** null = petición privada que esta cuenta no puede leer (solo pastores/rol admin). */
  texto: string | null;
  es_privada: boolean;
  atendida: boolean;
  atendida_en: Date | null;
  atendida_por: string | null;
  creado_en: Date;
};

/**
 * Peticiones de una pestaña. Las privadas solo las leen los pastores (rol admin): para el rol
 * editor, el texto y los datos de contacto no salen de la BD.
 */
export function listPeticiones(atendida: boolean, verPrivadas: boolean): Promise<Peticion[]> {
  return query<Peticion>(
    `SELECT p.id,
            CASE WHEN ? OR p.es_privada = 0 THEN p.nombre END AS nombre,
            CASE WHEN ? OR p.es_privada = 0 THEN p.telefono END AS telefono,
            CASE WHEN ? OR p.es_privada = 0 THEN p.email END AS email,
            CASE WHEN ? OR p.es_privada = 0 THEN p.texto END AS texto,
            p.es_privada, p.atendida, p.atendida_en,
            u.nombre AS atendida_por, p.creado_en
       FROM peticiones p
       LEFT JOIN usuarios_admin u ON u.id = p.atendida_por
      WHERE p.atendida = ?
      ORDER BY COALESCE(p.atendida_en, p.creado_en) DESC
      LIMIT 300`,
    [verPrivadas, verPrivadas, verPrivadas, verPrivadas, atendida],
  );
}

export type Contacto = {
  id: number;
  nombre: string;
  telefono: string | null;
  email: string | null;
  mensaje: string;
  leido: boolean;
  creado_en: Date;
};

export function listContactos(leido: boolean): Promise<Contacto[]> {
  return query<Contacto>(
    `SELECT id, nombre, telefono, email, mensaje, leido, creado_en
       FROM contactos WHERE leido = ? ORDER BY creado_en DESC LIMIT 300`,
    [leido],
  );
}

type FlagCount = { si: number; no: number };

type FlagRow = { flag: boolean | number; n: number };

function toFlagCount(rows: FlagRow[]): FlagCount {
  const get = (flag: boolean) => Number(rows.find((r) => Boolean(r.flag) === flag)?.n ?? 0);
  return { si: get(true), no: get(false) };
}

/** Peticiones atendidas (si) y sin atender (no), para las pestañas. */
export async function countPeticiones(): Promise<FlagCount> {
  return toFlagCount(
    await query<FlagRow>(
      'SELECT atendida AS flag, COUNT(*) AS n FROM peticiones GROUP BY atendida',
    ),
  );
}

/** Mensajes leídos (si) y sin leer (no), para las pestañas. */
export async function countContactos(): Promise<FlagCount> {
  return toFlagCount(
    await query<FlagRow>('SELECT leido AS flag, COUNT(*) AS n FROM contactos GROUP BY leido'),
  );
}
