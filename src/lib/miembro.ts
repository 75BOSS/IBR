import 'server-only';
import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { query, queryOne } from '@/lib/db';
import { requireEnv } from '@/lib/env';
import { type MemberSession, memberOptions } from '@/lib/session';

export async function getMemberSession() {
  return getIronSession<MemberSession>(await cookies(), memberOptions());
}

/** WhatsApp del miembro con sesión, o null. */
export async function getMemberPhone(): Promise<string | null> {
  return (await getMemberSession()).telefono ?? null;
}

export function newAccessCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

/** HMAC del código atado al número: la BD nunca guarda el código. */
export function hashAccessCode(telefono: string, code: string): string {
  return createHmac('sha256', requireEnv('SESSION_SECRET'))
    .update(`${telefono}:${code}`)
    .digest('hex');
}

export function sameHash(a: string, b: string): boolean {
  const x = Buffer.from(a, 'hex');
  const y = Buffer.from(b, 'hex');
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * ¿La iglesia ya tiene este WhatsApp? Solo a esos números se les envía un código: nadie puede
 * usar el sitio para mandar mensajes a números ajenos.
 */
export async function isKnownPhone(telefono: string): Promise<boolean> {
  const row = await queryOne<{ n: number }>(
    `SELECT (EXISTS(SELECT 1 FROM registros WHERE telefono = ?)
          OR EXISTS(SELECT 1 FROM inscripciones WHERE telefono = ?)
          OR EXISTS(SELECT 1 FROM solicitudes_grupo WHERE telefono = ?)
          OR EXISTS(SELECT 1 FROM voluntarios WHERE telefono = ?)) AS n`,
    [telefono, telefono, telefono, telefono],
  );
  return Boolean(Number(row?.n ?? 0));
}

export type MiInscripcion = {
  codigo: string;
  estado: 'confirmada' | 'cancelada' | 'asistio';
  personas: number;
  titulo: string;
  slug: string;
  fecha_inicio: Date;
  todo_el_dia: boolean;
};

export type MiGrupo = {
  grupo_id: number;
  grupo: string;
  estado: string;
  creado_en: Date;
  publico: boolean;
};

export type MiServicio = { area: string; estado: string; creado_en: Date };

/** Todo lo de un miembro, buscado por su WhatsApp verificado. */
export async function getMemberOverview(telefono: string) {
  const [inscripciones, grupos, servicio] = await Promise.all([
    query<MiInscripcion>(
      `SELECT i.codigo, i.estado, i.personas, e.titulo, e.slug, e.fecha_inicio, e.todo_el_dia
         FROM inscripciones i JOIN eventos e ON e.id = i.evento_id
        WHERE i.telefono = ?
        ORDER BY e.fecha_inicio < NOW(), ABS(TIMESTAMPDIFF(SECOND, e.fecha_inicio, NOW()))
        LIMIT 50`,
      [telefono],
    ),
    query<MiGrupo>(
      `SELECT s.grupo_id, g.nombre AS grupo, s.estado, s.creado_en, (g.publico = 1 AND g.activo = 1) AS publico
         FROM solicitudes_grupo s JOIN grupos g ON g.id = s.grupo_id
        WHERE s.telefono = ? ORDER BY s.creado_en DESC LIMIT 20`,
      [telefono],
    ),
    query<MiServicio>(
      `SELECT a.nombre AS area, v.estado, v.creado_en
         FROM voluntarios v JOIN areas_servicio a ON a.id = v.area_id
        WHERE v.telefono = ? ORDER BY v.creado_en DESC LIMIT 20`,
      [telefono],
    ),
  ]);
  return { inscripciones, grupos, servicio };
}
