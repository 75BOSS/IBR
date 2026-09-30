import 'server-only';
import { query } from '@/lib/db';

export type Option = { value: string; label: string };

export const UBICACION_TIPOS: Option[] = [
  { value: 'sede', label: 'Sede (auditorio)' },
  { value: 'casa', label: 'Casa' },
  { value: 'en_linea', label: 'En línea' },
  { value: 'otro', label: 'Otro' },
];

/** Ubicaciones activas para los select del panel (reuniones, grupos, eventos). */
export async function ubicacionOptions(): Promise<Option[]> {
  const rows = await query<{ id: number; nombre: string; zona: string | null }>(
    `SELECT id, nombre, zona FROM ubicaciones WHERE activo = 1 ORDER BY tipo = 'sede' DESC, nombre`,
  );
  return rows.map((r) => ({
    value: String(r.id),
    label: r.zona ? `${r.nombre} · ${r.zona}` : r.nombre,
  }));
}

/** Rangos de edad (ministerios) activos. */
export async function rangoOptions(): Promise<Option[]> {
  const rows = await query<{
    id: number;
    nombre: string;
    edad_min: number | null;
    edad_max: number | null;
  }>('SELECT id, nombre, edad_min, edad_max FROM rangos_edad WHERE activo = 1 ORDER BY orden');
  return rows.map((r) => ({
    value: String(r.id),
    label:
      r.edad_min !== null
        ? `${r.nombre} (${r.edad_min}${r.edad_max !== null ? `–${r.edad_max}` : '+'})`
        : r.nombre,
  }));
}
