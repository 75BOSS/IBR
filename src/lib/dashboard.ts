import 'server-only';
import { queryOne } from '@/lib/db';

/** Contadores del resumen del panel. */
export type DashboardCounts = {
  registros_semana: number;
  registros_sin_contactar: number;
  solicitudes_pendientes: number;
  peticiones_sin_atender: number;
  contactos_sin_leer: number;
  eventos_proximos: number;
};

const EMPTY: DashboardCounts = {
  registros_semana: 0,
  registros_sin_contactar: 0,
  solicitudes_pendientes: 0,
  peticiones_sin_atender: 0,
  contactos_sin_leer: 0,
  eventos_proximos: 0,
};

/**
 * Consulta directa, sin la vista v_dashboard: una vista de MySQL queda atada a la cuenta que la
 * creó (DEFINER = usuario@host). En Hostinger las migraciones se corren por «MySQL remoto» (el
 * host es la IP de quien las corre) y la web app entra por 127.0.0.1: si esa cuenta remota ya no
 * existe, MySQL rechaza la vista y el resumen del panel no cargaba (migración 013).
 */
export async function getDashboardCounts(): Promise<DashboardCounts> {
  const row = await queryOne<Record<keyof DashboardCounts, number | string>>(
    `SELECT
       (SELECT COUNT(*) FROM registros WHERE creado_en >= NOW() - INTERVAL 7 DAY) AS registros_semana,
       (SELECT COUNT(*) FROM registros WHERE estado = 'nuevo') AS registros_sin_contactar,
       (SELECT COUNT(*) FROM solicitudes_grupo WHERE estado = 'pendiente') AS solicitudes_pendientes,
       (SELECT COUNT(*) FROM peticiones WHERE atendida = 0) AS peticiones_sin_atender,
       (SELECT COUNT(*) FROM contactos WHERE leido = 0) AS contactos_sin_leer,
       (SELECT COUNT(*) FROM eventos WHERE publicado = 1 AND fecha_inicio >= NOW()) AS eventos_proximos`,
  );
  if (!row) return EMPTY;
  // COUNT(*) llega como número o como texto según el servidor (MySQL/MariaDB): se normaliza.
  return Object.fromEntries(
    Object.keys(EMPTY).map((k) => [k, Number(row[k as keyof DashboardCounts] ?? 0)]),
  ) as DashboardCounts;
}
