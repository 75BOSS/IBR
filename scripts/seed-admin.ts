/**
 * Crea (o reactiva y cambia la contraseña de) un usuario del panel. Si ya existía, cierra
 * todas sus sesiones abiertas (sube sesion_version).
 *
 *   npm run db:seed-admin -- --email=pastor@ibriglesia.com --nombre="Nombre Apellido" --generar
 *   ADMIN_PASSWORD='frase larga y secreta' npm run db:seed-admin -- --email=... --nombre=...
 *
 * --rol=admin|editor (por defecto admin). --generar crea una contraseña segura y la muestra
 * UNA sola vez: entrégala por un canal privado y pide que la cambien.
 */
import { randomBytes } from 'node:crypto';
import { parseArgs } from 'node:util';
import type { ResultSetHeader } from 'mysql2';
import { hashPassword, passwordProblem } from '@/lib/password';
import { emailSchema } from '@/lib/validators/auth';
import { describeTarget, fail, openScriptConnection } from './lib/script-db';

async function main() {
  const { values } = parseArgs({
    options: {
      email: { type: 'string' },
      nombre: { type: 'string' },
      rol: { type: 'string', default: 'admin' },
      generar: { type: 'boolean' },
    },
  });

  const email = emailSchema.safeParse(values.email ?? '');
  if (!email.success) {
    fail(`Correo inválido: ${email.error.issues[0]?.message} Usa --email=nombre@correo.com`);
  }
  const nombre = values.nombre?.trim();
  if (!nombre) fail('Falta el nombre. Usa --nombre="Nombre Apellido".');
  if (values.rol !== 'admin' && values.rol !== 'editor') {
    fail('El rol debe ser admin o editor. Ej. --rol=editor');
  }

  const generated = values.generar ? randomBytes(18).toString('base64url') : undefined;
  const password = generated ?? process.env.ADMIN_PASSWORD;
  if (!password) {
    fail('Falta la contraseña: usa --generar o define la variable ADMIN_PASSWORD al ejecutar.');
  }
  const problem = passwordProblem(password);
  if (problem) fail(problem);

  const passwordHash = await hashPassword(password);
  const connection = await openScriptConnection();
  try {
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO usuarios_admin (nombre, email, password_hash, rol, activo)
       VALUES (?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), password_hash = VALUES(password_hash),
                               rol = VALUES(rol), activo = 1,
                               sesion_version = sesion_version + 1`,
      [nombre, email.data, passwordHash, values.rol],
    );
    // affectedRows: 1 = creado, 2 = ya existía y se actualizó.
    const action =
      result.affectedRows === 1 ? 'creado' : 'actualizado y reactivado (se cerraron sus sesiones)';
    console.log(
      `✓ Usuario ${email.data} (${values.rol}) ${action} en ${describeTarget(connection)}.`,
    );
    if (generated) {
      console.log(`  Contraseña generada (se muestra solo esta vez): ${generated}`);
    }
  } finally {
    await connection.end();
  }
}

main().catch((error: unknown) => {
  fail(error instanceof Error ? error.message : String(error));
});
