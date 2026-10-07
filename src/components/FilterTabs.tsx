import Link from 'next/link';

export type FilterTab = { label: string; href: string; count?: number; active: boolean };

/**
 * Pestañas de filtro: `panel` (estados en el panel, en una barra) y `pills` (categorías de
 * eventos en el sitio, píldoras sueltas con la activa en tinta).
 */
export function FilterTabs({
  tabs,
  label,
  variant = 'panel',
}: {
  tabs: FilterTab[];
  label: string;
  variant?: 'panel' | 'pills';
}) {
  if (variant === 'pills') {
    return (
      <nav aria-label={label}>
        <ul className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={tab.active ? 'page' : undefined}
                className={`flex min-h-11 items-center rounded-full px-5 font-semibold whitespace-nowrap transition-colors ${
                  tab.active ? 'bg-ink text-canvas' : 'text-ink ring-1 ring-ink/20 hover:bg-sunken'
                }`}
              >
                {tab.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-1 rounded-xl bg-sunken p-1 md:w-fit">
        {tabs.map((tab) => (
          <li key={tab.href}>
            <Link
              href={tab.href}
              aria-current={tab.active ? 'page' : undefined}
              className={`flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                tab.active
                  ? 'bg-surface text-brand-strong shadow-sm'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${tab.active ? 'bg-brand-soft' : 'bg-surface/70'}`}
                >
                  {tab.count}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
