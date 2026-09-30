import type { MetadataRoute } from 'next';
import { CATEGORIAS } from '@/app/(public)/eventos/CategoriaTabs';
import { query } from '@/lib/db';
import { FOOTER_EXTRA_NAV, PUBLIC_NAV } from '@/lib/nav';
import { siteUrl } from '@/lib/site';

export const revalidate = 3600;

/**
 * Páginas públicas (sin las personales, como «Mi cuenta»), categorías de eventos, cada evento
 * publicado, cada ministerio activo y cada grupo del directorio.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [eventos, grupos, ministerios] = await Promise.all([
    query<{ slug: string; actualizado_en: Date }>(
      'SELECT slug, actualizado_en FROM eventos WHERE publicado = 1 ORDER BY fecha_inicio DESC LIMIT 500',
    ),
    query<{ id: number }>('SELECT id FROM grupos WHERE publico = 1 AND activo = 1'),
    query<{ slug: string }>('SELECT slug FROM rangos_edad WHERE activo = 1'),
  ]);
  const pages = [...PUBLIC_NAV, ...FOOTER_EXTRA_NAV].filter((item) => !('private' in item));
  return [
    ...pages.map((item) => ({
      url: `${base}${item.href === '/' ? '' : item.href}`,
      changeFrequency: 'weekly' as const,
      priority: item.href === '/' ? 1 : 0.7,
    })),
    ...CATEGORIAS.map((c) => ({ url: `${base}/eventos/categoria/${c.value}`, priority: 0.5 })),
    ...eventos.map((e) => ({
      url: `${base}/eventos/${e.slug}`,
      lastModified: e.actualizado_en,
      priority: 0.6,
    })),
    ...ministerios.map((m) => ({ url: `${base}/ministerios/${m.slug}`, priority: 0.6 })),
    ...grupos.map((g) => ({ url: `${base}/grupos/${g.id}`, priority: 0.5 })),
  ];
}
