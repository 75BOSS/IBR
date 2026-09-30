import 'server-only';
import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import { SESSION_INIT_SQL, connectionOptions } from '@/lib/db-config';
import { requireEnv } from '@/lib/env';

/**
 * Pool único de mysql2. En desarrollo se guarda en globalThis para no abrir un pool
 * nuevo en cada recarga en caliente.
 *
 * Todas las consultas usan placeholders `?` (mysql2 escapa los valores del lado del
 * cliente). Prohibido interpolar strings en SQL.
 */
const globalForDb = globalThis as typeof globalThis & { ibrPool?: Pool };

function createPool(): Pool {
  const pool = mysql.createPool({
    ...connectionOptions(requireEnv('DATABASE_URL')),
    connectionLimit: 10,
    waitForConnections: true,
    enableKeepAlive: true,
  });
  // Pool base (API de callbacks): el evento entrega la conexión recién abierta y la
  // consulta se encola antes que cualquier otra de la app en esa conexión.
  pool.pool.on('connection', (connection) => {
    connection.query(SESSION_INIT_SQL, (error) => {
      if (!error) return;
      // Sin UTC la conexión escribiría fechas corridas: se descarta en vez de usarla.
      console.error('[db] No se pudo fijar time_zone UTC; se descarta la conexión.', error);
      connection.destroy();
    });
  });
  return pool;
}

export function getPool(): Pool {
  globalForDb.ibrPool ??= createPool();
  return globalForDb.ibrPool;
}

/** SELECT: devuelve las filas tipadas. */
export async function query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const [rows] = await getPool().query<RowDataPacket[]>(sql, params);
  return rows as T[];
}

/** SELECT de una sola fila: la primera o `null`. */
export async function queryOne<T>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

/** INSERT / UPDATE / DELETE: devuelve insertId y affectedRows. */
export async function execute(sql: string, params: unknown[] = []): Promise<ResultSetHeader> {
  const [result] = await getPool().query<ResultSetHeader>(sql, params);
  return result;
}
