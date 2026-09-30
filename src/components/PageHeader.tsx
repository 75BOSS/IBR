import type { ReactNode } from 'react';

/**
 * Encabezado de página único (sitio y panel): etiqueta superior + título + introducción.
 * `display` es el tamaño grande del inicio del sitio.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  size = 'h1',
  tone = 'default',
  actions,
  className = '',
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  size?: 'h1' | 'display';
  tone?: 'default' | 'danger';
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div className="max-w-3xl">
        {eyebrow && (
          <p
            className={`text-sm font-semibold tracking-widest uppercase ${
              tone === 'danger' ? 'text-danger' : 'text-accent-strong'
            }`}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className={`mt-2 font-semibold ${
            size === 'display' ? 'text-display' : 'text-h1'
          } ${tone === 'danger' ? 'text-ink' : 'text-brand-strong'}`}
        >
          {title}
        </h1>
        {intro && <div className="mt-3 max-w-prose text-lg text-ink-soft">{intro}</div>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
