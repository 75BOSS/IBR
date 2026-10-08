import type { MetadataRoute } from 'next';
import { CATEGORIAS } from '@/app/(public)/eventos/CategoriaTabs';
import { query } from '@/lib/db';
import { listCategoriasPublicadas } from '@/lib/eventos';
import { listMinisterios } from '@/lib/ministerios';
import { visibleNav } from '@/lib/nav';
import { getSiteContent } from '@/lib/site-content';
import { siteUrl } from '@/lib/site';

export const revalidate = 3600;

/**
 * Lo mismo que enlaza el sitio (`visibleNav`, sin páginas vacías ni personales), las categorías
 * de eventos que tienen publicaciones, cada evento publicado, cada ministerio con contenido y
 * cada grupo del directorio.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [content, eventos, grupos, ministerios, categorias] = await Promise.all([
    getSiteContent(),
    query<{ slug: string; actualizado_en: Date }>(
      'SELECT slug, actualizado_en FROM eventos WHERE publicado = 1 ORDER BY fecha_inicio DESC LIMIT 500',
    ),
    query<{ id: number }>('SELECT id FROM grupos WHERE publico = 1 AND activo = 1'),
    listMinisterios({ soloActivos: true, conContenido: true }),
    listCategoriasPublicadas(),
  ]);
  const pages = visibleNav(content).pages.filter((item) => !item.private);
  const conPublicaciones = new Set(categorias);
  return [
    ...pages.map((item) => ({
      url: `${base}${item.href === '/' ? '' : item.href}`,
      changeFrequency: 'weekly' as const,
      priority: item.href === '/' ? 1 : 0.7,
    })),
    ...CATEGORIAS.filter((c) => conPublicaciones.has(c.value)).map((c) => ({
      url: `${base}/eventos/categoria/${c.value}`,
      priority: 0.5,
    })),
    ...eventos.map((e) => ({
      url: `${base}/eventos/${e.slug}`,
      lastModified: e.actualizado_en,
      priority: 0.6,
    })),
    ...ministerios.map((m) => ({ url: `${base}/ministerios/${m.slug}`, priority: 0.6 })),
    ...grupos.map((g) => ({ url: `${base}/grupos/${g.id}`, priority: 0.5 })),
  ];
}
