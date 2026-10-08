import { FilterTabs } from '@/components/FilterTabs';
import { listCategoriasPublicadas } from '@/lib/eventos';
import { EVENTO_CATEGORIAS } from '@/lib/validators/eventos';

/** Categorías con página propia (todas menos «Evento», que es lo general). */
export const CATEGORIAS = EVENTO_CATEGORIAS.filter((c) => c.value !== 'evento');

export function categoriaTitle(c: (typeof CATEGORIAS)[number]): string {
  return c.value === 'noticia' ? 'Noticias' : c.label;
}

/**
 * Pestañas de /eventos: «Próximos» y una por categoría que tenga publicaciones (cada una es una
 * página en caché). Sin categorías con contenido no hay pestañas: «Próximos» sola no filtra nada.
 */
export async function CategoriaTabs({ active }: { active: string | null }) {
  const publicadas = new Set(await listCategoriasPublicadas());
  const categorias = CATEGORIAS.filter((c) => publicadas.has(c.value) || c.value === active);
  if (categorias.length === 0) return null;
  return (
    <FilterTabs
      label="Filtrar por categoría"
      variant="pills"
      tabs={[
        { label: 'Próximos', href: '/eventos', active: active === null },
        ...categorias.map((c) => ({
          label: categoriaTitle(c),
          href: `/eventos/categoria/${c.value}`,
          active: active === c.value,
        })),
      ]}
    />
  );
}
