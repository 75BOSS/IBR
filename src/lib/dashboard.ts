import 'server-only';
import { queryOne } from '@/lib/db';

/** Contadores del resumen del panel (vista v_dashboard de sql/ESQUEMA.sql). */
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

export async function getDashboardCounts(): Promise<DashboardCounts> {
  const row = await queryOne<Record<keyof DashboardCounts, number | string>>(
    'SELECT * FROM v_dashboard',
  );
  if (!row) return EMPTY;
  // COUNT(*) llega como número o como texto según el servidor (MySQL/MariaDB): se normaliza.
  return Object.fromEntries(
    Object.keys(EMPTY).map((k) => [k, Number(row[k as keyof DashboardCounts] ?? 0)]),
  ) as DashboardCounts;
}
