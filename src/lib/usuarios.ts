import 'server-only';
import { query, queryOne } from '@/lib/db';

export type Usuario = {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'editor';
  activo: boolean;
  ultimo_login: Date | null;
  creado_en: Date;
};

const SELECT = 'SELECT id, nombre, email, rol, activo, ultimo_login, creado_en FROM usuarios_admin';

export function listUsuarios(): Promise<Usuario[]> {
  return query<Usuario>(`${SELECT} ORDER BY activo DESC, rol, nombre`);
}

export function getUsuario(id: number): Promise<Usuario | null> {
  return queryOne<Usuario>(`${SELECT} WHERE id = ?`, [id]);
}

/** Administradores activos sin contar a `exceptId` (para no dejar el panel sin administrador). */
export async function countOtherActiveAdmins(exceptId: number): Promise<number> {
  const row = await queryOne<{ n: number }>(
    "SELECT COUNT(*) AS n FROM usuarios_admin WHERE rol = 'admin' AND activo = 1 AND id <> ?",
    [exceptId],
  );
  return Number(row?.n ?? 0);
}
