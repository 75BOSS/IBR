import 'server-only';
import { query } from '@/lib/db';

export type Reunion = {
  id: number;
  nombre: string;
  descripcion: string | null;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string | null;
  ubicacion_id: number | null;
  rango_edad_id: number | null;
  en_linea: boolean;
  orden: number;
  activo: boolean;
  ubicacion: string | null;
  ubicacion_direccion: string | null;
  ubicacion_maps_url: string | null;
  rango_edad: string | null;
  rango_color: string | null;
};

/** Reuniones con su lugar y ministerio. `soloActivas` para el sitio público. */
export async function listReuniones({
  soloActivas,
  rangoId = null,
}: {
  soloActivas: boolean;
  /** Solo las de un ministerio (página del ministerio). */
  rangoId?: number | null;
}): Promise<Reunion[]> {
  return query<Reunion>(
    `SELECT r.id, r.nombre, r.descripcion, r.dia_semana, r.hora_inicio, r.hora_fin, r.ubicacion_id,
            r.rango_edad_id, r.en_linea, r.orden, r.activo,
            u.nombre AS ubicacion, CASE WHEN u.publica = 1 THEN u.direccion END AS ubicacion_direccion,
            CASE WHEN u.publica = 1 THEN u.maps_url END AS ubicacion_maps_url,
            re.nombre AS rango_edad, re.color AS rango_color
       FROM reuniones r
       LEFT JOIN ubicaciones u ON u.id = r.ubicacion_id
       LEFT JOIN rangos_edad re ON re.id = r.rango_edad_id
      WHERE (? = 0 OR r.activo = 1) AND (? IS NULL OR r.rango_edad_id = ?)
      ORDER BY r.dia_semana = 7 DESC, r.dia_semana, r.hora_inicio, r.orden`,
    [soloActivas ? 1 : 0, rangoId, rangoId],
  );
}
