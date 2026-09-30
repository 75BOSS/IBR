import 'server-only';
import { randomBytes } from 'node:crypto';
import { DAY_NAMES, formatDateTime, formatTime } from '@/lib/dates';
import { query, queryOne } from '@/lib/db';
import { listReuniones } from '@/lib/reuniones';
import { siteUrl } from '@/lib/site';

/** Llave personal de 43 caracteres (256 bits) para confirmar o darse de baja. */
export function newSubscriberToken(): string {
  return randomBytes(32).toString('base64url');
}

export function agendaUrl(token: string): string {
  return `${siteUrl()}/agenda/${token}`;
}

export type Suscriptor = {
  id: number;
  email: string;
  nombre: string | null;
  token: string;
  activo: boolean;
  confirmado_en: Date | null;
  baja_en: Date | null;
  creado_en: Date;
};

const COLUMNS = 'id, email, nombre, token, activo, confirmado_en, baja_en, creado_en';

export function getSuscriptorByToken(token: string): Promise<Suscriptor | null> {
  return /^[\w-]{43}$/.test(token)
    ? queryOne<Suscriptor>(`SELECT ${COLUMNS} FROM suscriptores WHERE token = ?`, [token])
    : Promise.resolve(null);
}

export function listSuscriptores(): Promise<Suscriptor[]> {
  return query<Suscriptor>(
    `SELECT ${COLUMNS} FROM suscriptores ORDER BY activo DESC, baja_en IS NOT NULL, creado_en DESC`,
  );
}

export function listActiveSuscriptores(): Promise<
  Pick<Suscriptor, 'email' | 'nombre' | 'token'>[]
> {
  return query('SELECT email, nombre, token FROM suscriptores WHERE activo = 1 ORDER BY id');
}

export type EnvioAgenda = {
  id: number;
  asunto: string;
  enviados: number;
  fallidos: number;
  enviado_por: string | null;
  creado_en: Date;
};

export function listEnvios(limit = 10): Promise<EnvioAgenda[]> {
  return query<EnvioAgenda>(
    `SELECT e.id, e.asunto, e.enviados, e.fallidos, u.nombre AS enviado_por, e.creado_en
       FROM envios_agenda e LEFT JOIN usuarios_admin u ON u.id = e.enviado_por
      ORDER BY e.creado_en DESC LIMIT ?`,
    [limit],
  );
}

/**
 * Texto de la agenda de los próximos 7 días: eventos publicados y las reuniones fijas de la
 * semana. Es el cuerpo del correo y la vista previa del panel (una sola fuente).
 */
export async function buildAgendaText(intro: string | null): Promise<string> {
  const [eventos, reuniones] = await Promise.all([
    query<{
      titulo: string;
      slug: string;
      fecha_inicio: Date;
      todo_el_dia: boolean;
      lugar: string | null;
    }>(
      `SELECT e.titulo, e.slug, e.fecha_inicio, e.todo_el_dia, u.nombre AS lugar
         FROM eventos e LEFT JOIN ubicaciones u ON u.id = e.ubicacion_id
        WHERE e.publicado = 1 AND e.fecha_inicio >= NOW() AND e.fecha_inicio < NOW() + INTERVAL 7 DAY
        ORDER BY e.fecha_inicio`,
    ),
    listReuniones({ soloActivas: true }),
  ]);
  const lines: string[] = [];
  if (intro?.trim()) lines.push(intro.trim(), '');
  lines.push('ESTA SEMANA');
  if (eventos.length === 0) lines.push('No hay eventos especiales esta semana.');
  for (const e of eventos) {
    const when = formatDateTime(
      e.fecha_inicio,
      e.todo_el_dia
        ? { weekday: 'long', day: 'numeric', month: 'long' }
        : { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' },
    );
    lines.push(
      `• ${e.titulo} — ${when}${e.lugar ? ` · ${e.lugar}` : ''}`,
      `  ${siteUrl()}/eventos/${e.slug}`,
    );
  }
  if (reuniones.length > 0) {
    lines.push('', 'REUNIONES DE CADA SEMANA');
    for (const r of reuniones) {
      lines.push(
        `• ${DAY_NAMES[r.dia_semana]} ${formatTime(r.hora_inicio)} — ${r.nombre}${r.ubicacion ? ` · ${r.ubicacion}` : ''}`,
      );
    }
  }
  lines.push('', `Más en ${siteUrl()}`);
  return lines.join('\n');
}
