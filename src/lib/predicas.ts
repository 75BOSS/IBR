import 'server-only';
import { query } from '@/lib/db';

export type Predica = {
  id: number;
  titulo: string;
  slug: string;
  youtube_id: string;
  serie: string | null;
  predicador: string | null;
  fecha: string;
  descripcion: string | null;
  pasaje: string | null;
  miniatura_url: string | null;
  destacada: boolean;
  publicada: boolean;
};

const COLUMNS =
  'id, titulo, slug, youtube_id, serie, predicador, fecha, descripcion, pasaje, miniatura_url, destacada, publicada';

export async function listPredicas(filter: {
  soloPublicadas: boolean;
  serie?: string | null;
  predicador?: string | null;
  limit?: number;
}): Promise<Predica[]> {
  return query<Predica>(
    `SELECT ${COLUMNS} FROM predicas
      WHERE (? = 0 OR publicada = 1) AND (? IS NULL OR serie = ?) AND (? IS NULL OR predicador = ?)
      ORDER BY fecha DESC, id DESC
      LIMIT ?`,
    [
      filter.soloPublicadas ? 1 : 0,
      filter.serie ?? null,
      filter.serie ?? null,
      filter.predicador ?? null,
      filter.predicador ?? null,
      filter.limit ?? 200,
    ],
  );
}

/** Series y predicadores ya usados (filtros públicos y sugerencias en el panel). */
export async function predicaFacets(
  soloPublicadas: boolean,
): Promise<{ series: string[]; predicadores: string[] }> {
  const [series, predicadores] = await Promise.all([
    query<{ v: string }>(
      'SELECT DISTINCT serie AS v FROM predicas WHERE serie IS NOT NULL AND (? = 0 OR publicada = 1) ORDER BY serie',
      [soloPublicadas ? 1 : 0],
    ),
    query<{ v: string }>(
      'SELECT DISTINCT predicador AS v FROM predicas WHERE predicador IS NOT NULL AND (? = 0 OR publicada = 1) ORDER BY predicador',
      [soloPublicadas ? 1 : 0],
    ),
  ]);
  return { series: series.map((r) => r.v), predicadores: predicadores.map((r) => r.v) };
}
