import 'server-only';
import { queryOne } from '@/lib/db';

/**
 * Tablas con columna `slug` única. La consulta de cada una es fija (no se arma con texto que
 * venga de afuera).
 */
const SLUG_QUERIES = {
  eventos: 'SELECT id FROM eventos WHERE slug = ? AND id <> ?',
  predicas: 'SELECT id FROM predicas WHERE slug = ? AND id <> ?',
  rangos_edad: 'SELECT id FROM rangos_edad WHERE slug = ? AND id <> ?',
  areas_servicio: 'SELECT id FROM areas_servicio WHERE slug = ? AND id <> ?',
} as const;

/** `base`, o `base-2`, `base-3`… el primero que no use otra fila de la tabla. */
export async function uniqueSlug(
  table: keyof typeof SLUG_QUERIES,
  base: string,
  excludeId: number | null,
  fallback: string,
): Promise<string> {
  const root = base || fallback;
  let slug = root;
  for (let n = 2; ; n++) {
    const taken = await queryOne<{ id: number }>(SLUG_QUERIES[table], [slug, excludeId ?? 0]);
    if (!taken) return slug;
    slug = `${root}-${n}`;
  }
}
