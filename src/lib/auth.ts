import 'server-only';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { queryOne } from '@/lib/db';
import { type AdminSession, sessionOptions } from '@/lib/session';

export type AdminRole = 'admin' | 'editor';
export type AdminUser = { id: number; nombre: string; email: string; rol: AdminRole };

export async function getSession() {
  return getIronSession<AdminSession>(await cookies(), sessionOptions());
}

/**
 * Usuario del panel con sesión válida Y activo en la BD (desactivar a alguien corta su
 * acceso en la siguiente petición). Se memoiza por request.
 */
export const getCurrentAdmin = cache(async (): Promise<AdminUser | null> => {
  const session = await getSession();
  if (!session.userId) return null;
  return queryOne<AdminUser>(
    'SELECT id, nombre, email, rol FROM usuarios_admin WHERE id = ? AND activo = 1',
    [session.userId],
  );
});

/**
 * Autorización real del panel. El middleware solo filtra cookies ausentes: cada layout,
 * página y server action del admin debe llamar a requireAdmin().
 */
export async function requireAdmin(options: { role?: AdminRole } = {}): Promise<AdminUser> {
  const user = await getCurrentAdmin();
  if (!user) redirect('/admin/login');
  if (options.role === 'admin' && user.rol !== 'admin') redirect('/admin?aviso=sin-permiso');
  return user;
}
