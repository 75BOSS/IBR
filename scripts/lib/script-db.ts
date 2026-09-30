import { loadEnvConfig } from '@next/env';
import mysql, { type Connection } from 'mysql2/promise';
import { SESSION_INIT_SQL, connectionOptions } from '@/lib/db-config';
import { requireEnv } from '@/lib/env';

/**
 * Conexión para scripts de terminal (migraciones, seed, importación). Carga .env.local
 * igual que Next y reutiliza la misma configuración de conexión que la app.
 */
export async function openScriptConnection(
  options: { envName?: 'DATABASE_URL' | 'LEGACY_DATABASE_URL'; multipleStatements?: boolean } = {},
): Promise<Connection> {
  const { envName = 'DATABASE_URL', multipleStatements = false } = options;
  loadEnvConfig(process.cwd());
  const connection = await mysql.createConnection({
    ...connectionOptions(requireEnv(envName)),
    multipleStatements,
  });
  await connection.query(SESSION_INIT_SQL);
  return connection;
}

/** "usuario@host/bd" para mostrar a qué base se está apuntando antes de escribir. */
export function describeTarget(connection: Connection): string {
  const { user, host, port, database } = connection.config;
  return `${user}@${host}:${port}/${database}`;
}

/** Termina el script con un mensaje claro (qué pasó y cómo seguir) sin stack trace. */
export function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}
