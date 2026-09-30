'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { execute, queryOne } from '@/lib/db';
import { verifyPassword } from '@/lib/password';
import { minutesText, rateLimitStatus, recordAttempt } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/request';
import { loginSchema, safeAdminPath } from '@/lib/validators/auth';

export type LoginState = {
  error?: string;
  fieldErrors?: { email?: string[]; password?: string[] };
  values?: { email: string };
};

const WRONG_CREDENTIALS =
  'El correo o la contraseña no coinciden. Revisa que el correo esté bien escrito y las ' +
  'mayúsculas de la contraseña, y vuelve a intentar.';

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const rawEmail = String(formData.get('email') ?? '');
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values: { email: rawEmail } };
  }

  const { email, password } = parsed.data;
  const values = { email };

  try {
    const ip = await getClientIp();
    // Por IP y por cuenta: si la IP se falsea, la cuenta sigue protegida.
    const [byIp, byAccount] = await Promise.all([
      rateLimitStatus('login_ip', { ip }),
      rateLimitStatus('login_cuenta', { account: email }, { max: 10 }),
    ]);
    if (byIp.blocked || byAccount.blocked) {
      const minutes = Math.max(byIp.retryAfterMinutes, byAccount.retryAfterMinutes);
      return {
        error: `Demasiados intentos fallidos. Por seguridad, espera ${minutesText(minutes)} y vuelve a intentar.`,
        values,
      };
    }

    const user = await queryOne<{ id: number; password_hash: string; activo: boolean }>(
      'SELECT id, password_hash, activo FROM usuarios_admin WHERE email = ?',
      [email],
    );
    // Siempre se compara (aunque el correo no exista) para no revelar qué correos hay.
    const passwordOk = await verifyPassword(password, user?.password_hash ?? null);
    if (!user || !passwordOk || !user.activo) {
      await Promise.all([
        recordAttempt('login_ip', { ip }),
        recordAttempt('login_cuenta', { account: email }),
      ]);
      return { error: WRONG_CREDENTIALS, values };
    }

    await execute('UPDATE usuarios_admin SET ultimo_login = NOW() WHERE id = ?', [user.id]);
    const session = await getSession();
    session.userId = user.id;
    session.issuedAt = Date.now();
    await session.save();
  } catch (error) {
    // Falla de BD o de configuración: se registra el detalle y se explica qué hacer.
    console.error('[login] no se pudo verificar el acceso:', error);
    return {
      error:
        'No pudimos conectar con el servidor para verificar tus datos. Intenta de nuevo en unos ' +
        'minutos; si el problema sigue, avisa a Pixelia.',
      values,
    };
  }

  redirect(safeAdminPath(formData.get('next')));
}

export async function logout(): Promise<void> {
  const session = await getSession();
  session.destroy();
  redirect('/admin/login?aviso=salida');
}
