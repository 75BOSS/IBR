import 'server-only';
import { query } from '@/lib/db';

export type Peticion = {
  id: number;
  nombre: string | null;
  telefono: string | null;
  email: string | null;
  texto: string;
  es_privada: boolean;
  atendida: boolean;
  atendida_en: Date | null;
  atendida_por: string | null;
  creado_en: Date;
};

export function listPeticiones(atendida: boolean): Promise<Peticion[]> {
  return query<Peticion>(
    `SELECT p.id, p.nombre, p.telefono, p.email, p.texto, p.es_privada, p.atendida, p.atendida_en,
            u.nombre AS atendida_por, p.creado_en
       FROM peticiones p
       LEFT JOIN usuarios_admin u ON u.id = p.atendida_por
      WHERE p.atendida = ?
      ORDER BY COALESCE(p.atendida_en, p.creado_en) DESC
      LIMIT 300`,
    [atendida],
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
