'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getSession, getTrustedDevice } from '@/lib/auth';
import { execute, queryOne } from '@/lib/db';
import type { FormState } from '@/lib/form-state';
import { PasswordCheckBusyError, verifyPassword } from '@/lib/password';
import { type RateLimitReservation, minutesText, reserveAttempt } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/request';
import { loginSchema, safeAdminPath } from '@/lib/validators/auth';

type LoginField = 'email' | 'password';
export type LoginState = FormState<LoginField>;

const WRONG_CREDENTIALS =
  'El correo o la contraseña no coinciden. Revisa que el correo esté bien escrito y las ' +
  'mayúsculas de la contraseña, y vuelve a intentar.';

const releaseAll = (reservations: RateLimitReservation[]) =>
  Promise.all(reservations.map((r) => r.release()));

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const rawEmail = String(formData.get('email') ?? '');
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return {
      status: 'error',
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values: { email: rawEmail },
    };
  }

  const { email, password } = parsed.data;
  const values = { email };

  try {
    const ip = await getClientIp();
    const device = await getTrustedDevice();
    const knownDevice = device.emails?.includes(email) ?? false;

    // Se reserva el intento ANTES de verificar (sin carreras). Por IP siempre; por cuenta solo
    // desde dispositivos desconocidos: así nadie puede bloquear a un admin en su compu de siempre.
    const reservations = await Promise.all([
      reserveAttempt('login_ip', { ip }),
      ...(knownDevice ? [] : [reserveAttempt('login_cuenta', { account: email }, { max: 10 })]),
    ]);
    const blocked = reservations.filter((r) => r.blocked);
    if (blocked.length > 0) {
      await releaseAll(reservations);
      const minutes = Math.max(...blocked.map((r) => r.retryAfterMinutes));
      return {
        status: 'error',
        message: `Demasiados intentos fallidos. Por seguridad, espera ${minutesText(minutes)} y vuelve a intentar.`,
        values,
      };
    }

    const user = await queryOne<{
      id: number;
      password_hash: string;
      activo: boolean;
      sesion_version: number;
    }>('SELECT id, password_hash, activo, sesion_version FROM usuarios_admin WHERE email = ?', [
      email,
    ]);

    let passwordOk: boolean;
    try {
      // Siempre se compara (aunque el correo no exista) para no revelar qué correos hay.
      passwordOk = await verifyPassword(password, user?.password_hash ?? null);
    } catch (error) {
      if (!(error instanceof PasswordCheckBusyError)) throw error;
      await releaseAll(reservations);
      return {
        status: 'error',
        message:
          'El servidor está ocupado verificando otros ingresos. Espera unos segundos y vuelve a intentar.',
        values,
      };
    }

    // Credenciales incorrectas: las reservas quedan como intentos fallidos.
    if (!user || !passwordOk) return { status: 'error', message: WRONG_CREDENTIALS, values };

    await releaseAll(reservations);
    if (!user.activo) {
      // Ya demostró conocer la contraseña: se le dice qué pasa sin revelar nada nuevo.
      return {
        status: 'error',
        message:
          'Tu cuenta del panel está desactivada. Pide a un administrador que la vuelva a activar.',
        values,
      };
    }

    await execute('UPDATE usuarios_admin SET ultimo_login = NOW() WHERE id = ?', [user.id]);
    const session = await getSession();
    session.userId = user.id;
    session.version = user.sesion_version;
    await session.save();
    device.emails = [email, ...(device.emails ?? []).filter((e) => e !== email)].slice(0, 5);
    await device.save();
  } catch (error) {
    // Falla de BD o de configuración: se registra el detalle y se explica qué hacer.
    console.error('[login] no se pudo verificar el acceso:', error);
    return {
      status: 'error',
      message:
        'No pudimos conectar con el servidor para verificar tus datos. Intenta de nuevo en unos ' +
        'minutos; si el problema sigue, avisa a Pixelia.',
      values,
    };
  }

  redirect(safeAdminPath(formData.get('next')));
}

/** Cierra la sesión en TODOS los dispositivos (sube sesion_version) y borra la cookie local. */
export async function logout(): Promise<void> {
  const session = await getSession();
  if (session.userId) {
    try {
      await execute('UPDATE usuarios_admin SET sesion_version = sesion_version + 1 WHERE id = ?', [
        session.userId,
      ]);
    } catch (error) {
      // Sin BD no se pueden cortar las otras sesiones; esta se cierra igual (vencen en 12 h).
      console.error('[logout] no se pudo invalidar las demás sesiones:', error);
    }
  }
  session.destroy();
  redirect('/admin/login?aviso=salida');
}
