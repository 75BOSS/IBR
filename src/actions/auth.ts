'use server';

import { randomUUID } from 'node:crypto';
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

  let result: LoginState | 'ok';
  try {
    result = await attemptLogin(email, password);
  } catch (error) {
    // Falla de BD o de configuración: se registra el detalle y se explica qué hacer.
    console.error('[login] no se pudo verificar el acceso:', error);
    result = {
      status: 'error',
      message:
        'No pudimos conectar con el servidor para verificar tus datos. Intenta de nuevo en unos ' +
        'minutos; si el problema sigue, avisa a Pixelia.',
    };
  }
  if (result !== 'ok') return { ...result, values };
  redirect(safeAdminPath(formData.get('next')));
}

async function attemptLogin(email: string, password: string): Promise<LoginState | 'ok'> {
  const ip = await getClientIp();
  const device = await getTrustedDevice();
  const knownDevice = Boolean(device.id && device.emails?.includes(email));

  // Se reserva el intento ANTES de verificar (sin carreras). Por IP siempre. Por cuenta solo
  // desde dispositivos desconocidos (así nadie bloquea a un admin en su compu de siempre); los
  // conocidos tienen su propio límite por dispositivo, por si alguien copia la cookie.
  const reservations = await Promise.all([
    reserveAttempt('login_ip', { ip }),
    knownDevice
      ? reserveAttempt('login_dispositivo', { account: `${device.id}:${email}` }, { max: 10 })
      : reserveAttempt('login_cuenta', { account: email }, { max: 10 }),
  ]);
  // Solo un intento con credenciales incorrectas queda contado; cualquier otro final (éxito,
  // bloqueo, servidor ocupado, error inesperado) anula las reservas.
  let countAsFailure = false;
  try {
    const blocked = reservations.filter((r) => r.blocked);
    if (blocked.length > 0) {
      const minutes = Math.max(...blocked.map((r) => r.retryAfterMinutes));
      return {
        status: 'error',
        message: `Demasiados intentos fallidos. Por seguridad, espera ${minutesText(minutes)} y vuelve a intentar.`,
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
      passwordOk = await verifyPassword(password, user?.password_hash ?? null, {
        priority: knownDevice,
      });
    } catch (error) {
      if (!(error instanceof PasswordCheckBusyError)) throw error;
      return {
        status: 'error',
        message:
          'El servidor está ocupado verificando otros ingresos. Espera unos segundos y vuelve a intentar.',
      };
    }

    if (!user || !passwordOk) {
      countAsFailure = true;
      return { status: 'error', message: WRONG_CREDENTIALS };
    }
    if (!user.activo) {
      // Ya demostró conocer la contraseña: se le dice qué pasa sin revelar nada nuevo.
      return {
        status: 'error',
        message:
          'Tu cuenta del panel está desactivada. Pide a un administrador que la vuelva a activar.',
      };
    }

    await execute('UPDATE usuarios_admin SET ultimo_login = NOW() WHERE id = ?', [user.id]);
    const session = await getSession();
    session.userId = user.id;
    session.version = user.sesion_version;
    await session.save();
    device.id ??= randomUUID();
    device.emails = [email, ...(device.emails ?? []).filter((e) => e !== email)].slice(0, 5);
    await device.save();
    return 'ok';
  } finally {
    if (!countAsFailure) await releaseAll(reservations);
  }
}

/**
 * Cierra la sesión en TODOS los dispositivos (sube sesion_version) y borra la cookie local.
 * Solo sube la versión si la cookie sigue vigente: una cookie ya revocada (por ejemplo, una
 * robada) no puede volver a echar al admin.
 */
export async function logout(): Promise<void> {
  const session = await getSession();
  let aviso = 'salida-local';
  if (session.userId && session.version !== undefined) {
    try {
      const { affectedRows } = await execute(
        'UPDATE usuarios_admin SET sesion_version = sesion_version + 1 WHERE id = ? AND sesion_version = ?',
        [session.userId, session.version],
      );
      if (affectedRows === 1) aviso = 'salida';
    } catch (error) {
      // Sin BD no se pueden cortar las otras sesiones: se cierra esta y se avisa con la verdad.
      console.error('[logout] no se pudo invalidar las demás sesiones:', error);
      aviso = 'salida-sin-bd';
    }
  }
  session.destroy();
  redirect(`/admin/login?aviso=${aviso}`);
}
