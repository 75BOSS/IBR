import { FilterTabs } from '@/components/FilterTabs';
import { EVENTO_CATEGORIAS } from '@/lib/validators/eventos';

/** Categorías con página propia (todas menos «Evento», que es lo general). */
export const CATEGORIAS = EVENTO_CATEGORIAS.filter((c) => c.value !== 'evento');

export function categoriaTitle(c: (typeof CATEGORIAS)[number]): string {
  return c.value === 'noticia' ? 'Noticias' : c.label;
}

/** Pestañas de /eventos: «Próximos» y una por categoría (cada una es una página en caché). */
export function CategoriaTabs({ active }: { active: string | null }) {
  return (
    <FilterTabs
      label="Filtrar por categoría"
      variant="pills"
      tabs={[
        { label: 'Próximos', href: '/eventos', active: active === null },
        ...CATEGORIAS.map((c) => ({
          label: categoriaTitle(c),
          href: `/eventos/categoria/${c.value}`,
          active: active === c.value,
        })),
      ]}
    />
  );
}
