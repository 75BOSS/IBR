'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSession, requireAdmin } from '@/lib/auth';
import { execute, queryOne } from '@/lib/db';
import type { FormState } from '@/lib/form-state';
import {
  PasswordCheckBusyError,
  generatePassword,
  hashPassword,
  verifyPassword,
} from '@/lib/password';
import { minutesText, reserveAttempt } from '@/lib/rate-limit';
import { siteUrl } from '@/lib/site';
import { countOtherActiveAdmins, getUsuario } from '@/lib/usuarios';
import { fieldErrorsOf, id as idSchema, valuesOf } from '@/lib/validators/common';
import { USUARIO_FIELDS, cambioClaveSchema, usuarioSchema } from '@/lib/validators/usuarios';

const passwordSecret = (value: string, email: string) => ({
  label: 'Contraseña para entrar al panel',
  value,
  hint: `Cópiala ahora y pásasela a la persona por un medio privado (no por un grupo). No se vuelve a mostrar. Entra en ${siteUrl()}/admin con ${email}.`,
});

/** Crear (devuelve la contraseña generada) o editar (vuelve a la lista) un usuario del panel. */
export async function saveUsuario(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireAdmin({ role: 'admin' });
  const editingId = formData.get('id') ? idSchema.safeParse(formData.get('id')) : null;
  if (editingId && !editingId.success)
    return { status: 'error', message: 'No encontramos este usuario. Vuelve a la lista.' };

  const values = valuesOf(formData, USUARIO_FIELDS);
  // Al crear, la cuenta nace activa (la casilla solo aparece al editar).
  const raw = Object.fromEntries(formData);
  const parsed = usuarioSchema.safeParse(editingId ? raw : { ...raw, activo: '1' });
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos marcados en rojo.',
      fieldErrors: fieldErrorsOf(parsed.error),
      values,
    };
  }
  const d = parsed.data;

  const sameEmail = await queryOne<{ id: number }>(
    'SELECT id FROM usuarios_admin WHERE email = ? AND id <> ?',
    [d.email, editingId?.data ?? 0],
  );
  if (sameEmail) {
    return {
      status: 'error',
      fieldErrors: { email: ['Ya hay un usuario con ese correo. Usa otro o edita ese usuario.'] },
      values,
    };
  }

  if (!editingId) {
    const password = generatePassword();
    await execute(
      'INSERT INTO usuarios_admin (nombre, email, password_hash, rol, activo) VALUES (?, ?, ?, ?, 1)',
      [d.nombre, d.email, await hashPassword(password), d.rol],
    );
    revalidatePath('/admin/usuarios');
    return {
      status: 'success',
      message: `Listo: ${d.nombre} ya puede entrar al panel.`,
      secret: passwordSecret(password, d.email),
    };
  }

  const current = await getUsuario(editingId.data);
  if (!current)
    return { status: 'error', message: 'Este usuario ya no existe. Vuelve a la lista.' };
  const losesAdmin = current.rol === 'admin' && current.activo && (d.rol !== 'admin' || !d.activo);
  if (current.id === me.id && losesAdmin) {
    return {
      status: 'error',
      message:
        'No puedes quitarte el rol de administrador ni desactivar tu propia cuenta. Pídeselo a otro administrador.',
      values,
    };
  }
  if (losesAdmin && (await countOtherActiveAdmins(current.id)) === 0) {
    return {
      status: 'error',
      message: 'Es el único administrador activo: el panel quedaría sin nadie que lo administre.',
      values,
    };
  }
  // Cambiar el rol o desactivar corta sus sesiones abiertas (el permiso nuevo rige de inmediato).
  const cutSessions = current.rol !== d.rol || (current.activo && !d.activo);
  await execute(
    `UPDATE usuarios_admin SET nombre = ?, email = ?, rol = ?, activo = ?,
            sesion_version = sesion_version + ? WHERE id = ?`,
    [d.nombre, d.email, d.rol, d.activo, cutSessions ? 1 : 0, current.id],
  );
  revalidatePath('/admin/usuarios');
  redirect('/admin/usuarios?aviso=guardado');
}

/** Genera una contraseña nueva para otra persona (la olvidó) y corta sus sesiones. */
export async function resetUsuarioPassword(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const me = await requireAdmin({ role: 'admin' });
  const parsed = idSchema.safeParse(formData.get('id'));
  if (!parsed.success) return { status: 'error', message: 'No encontramos este usuario.' };
  if (parsed.data === me.id) {
    return {
      status: 'error',
      message: 'Para tu propia cuenta usa «Mi cuenta» → Cambiar contraseña.',
    };
  }
  const user = await getUsuario(parsed.data);
  if (!user) return { status: 'error', message: 'Este usuario ya no existe. Recarga la página.' };
  const password = generatePassword();
  await execute(
    'UPDATE usuarios_admin SET password_hash = ?, sesion_version = sesion_version + 1 WHERE id = ?',
    [await hashPassword(password), user.id],
  );
  return {
    status: 'success',
    message: `Contraseña nueva para ${user.nombre}. Sus sesiones abiertas se cerraron.`,
    secret: passwordSecret(password, user.email),
  };
}

/**
 * Cambiar la propia contraseña: pide la actual, corta las sesiones de los otros dispositivos y
 * mantiene abierta la de este.
 */
export async function changeOwnPassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireAdmin();
  const parsed = cambioClaveSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos marcados en rojo.',
      fieldErrors: fieldErrorsOf(parsed.error),
    };
  }
  const attempt = await reserveAttempt('cambio_clave', { account: me.email }, { max: 5 });
  if (attempt.blocked) {
    return {
      status: 'error',
      message: `Demasiados intentos con la contraseña actual equivocada. Espera ${minutesText(attempt.retryAfterMinutes)} y vuelve a intentar.`,
    };
  }
  let wrongPassword = false;
  try {
    const row = await queryOne<{ password_hash: string }>(
      'SELECT password_hash FROM usuarios_admin WHERE id = ?',
      [me.id],
    );
    let ok: boolean;
    try {
      ok = await verifyPassword(parsed.data.actual, row?.password_hash ?? null, { priority: true });
    } catch (error) {
      if (!(error instanceof PasswordCheckBusyError)) throw error;
      return {
        status: 'error',
        message: 'El servidor está ocupado. Espera unos segundos y vuelve a intentar.',
      };
    }
    if (!ok) {
      wrongPassword = true;
      return {
        status: 'error',
        fieldErrors: {
          actual: ['Esa no es tu contraseña actual. Revisa las mayúsculas y vuelve a escribirla.'],
        },
      };
    }
    // Se sube la versión desde la que tiene esta cookie: las demás sesiones quedan cortadas y
    // esta sigue abierta con la versión nueva.
    const session = await getSession();
    const currentVersion = session.version ?? 0;
    const { affectedRows } = await execute(
      `UPDATE usuarios_admin SET password_hash = ?, sesion_version = sesion_version + 1
        WHERE id = ? AND sesion_version = ?`,
      [await hashPassword(parsed.data.nueva), me.id, currentVersion],
    );
    if (affectedRows !== 1) {
      return {
        status: 'error',
        message:
          'Tu sesión se cerró mientras cambiabas la contraseña. Vuelve a entrar e inténtalo otra vez.',
      };
    }
    session.version = currentVersion + 1;
    await session.save();
    return {
      status: 'success',
      message: 'Contraseña cambiada. Se cerró la sesión en tus otros dispositivos.',
    };
  } finally {
    if (!wrongPassword) await attempt.release();
  }
}
