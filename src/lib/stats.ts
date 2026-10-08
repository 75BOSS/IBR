import 'server-only';
import { cache } from 'react';
import { queryOne } from '@/lib/db';
import { MINISTERIO_CON_CONTENIDO } from '@/lib/ministerios';

export type ChurchStats = { grupos: number; ministerios: number; reuniones: number; areas: number };

/**
 * Cuánto contenido publicado hay de cada tipo. Una sola consulta por petición (`cache`): la usan
 * «Nosotros» (cifras) y el filtro de enlaces del sitio (`getSiteContent`).
 */
export type SiteCounts = ChurchStats & {
  eventos: number;
  predicas: number;
  equipo: number;
  pastores: number;
};

export const getSiteCounts = cache(async (): Promise<SiteCounts> => {
  const row = await queryOne<Record<keyof SiteCounts, number | string>>(
    `SELECT (SELECT COUNT(*) FROM grupos WHERE publico = 1 AND activo = 1) AS grupos,
            -- Solo los ministerios que el sitio muestra (con descripción, foto, grupos o
            -- reuniones): la cifra de «Nosotros» y el menú cuentan lo mismo.
            (SELECT COUNT(*) FROM rangos_edad r
              WHERE r.activo = 1 AND ${MINISTERIO_CON_CONTENIDO}) AS ministerios,
            (SELECT COUNT(*) FROM reuniones WHERE activo = 1) AS reuniones,
            (SELECT COUNT(*) FROM areas_servicio WHERE activo = 1) AS areas,
            (SELECT COUNT(*) FROM eventos WHERE publicado = 1) AS eventos,
            (SELECT COUNT(*) FROM predicas WHERE publicada = 1) AS predicas,
            (SELECT COUNT(*) FROM equipo WHERE visible = 1) AS equipo,
            (SELECT COUNT(*) FROM equipo WHERE visible = 1 AND es_pastor = 1) AS pastores`,
  );
  const n = (key: keyof SiteCounts) => Number(row?.[key] ?? 0);
  return {
    grupos: n('grupos'),
    ministerios: n('ministerios'),
    reuniones: n('reuniones'),
    areas: n('areas'),
    eventos: n('eventos'),
    predicas: n('predicas'),
    equipo: n('equipo'),
    pastores: n('pastores'),
  };
});

/** Cifras públicas de la iglesia para «Nosotros» (lo mismo que el sitio ya muestra). */
export async function getChurchStats(): Promise<ChurchStats> {
  const { grupos, ministerios, reuniones, areas } = await getSiteCounts();
  return { grupos, ministerios, reuniones, areas };
}
