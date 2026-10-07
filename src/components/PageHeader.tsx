import type { ReactNode } from 'react';

/**
 * Encabezado de página único (sitio y panel): etiqueta superior + título + introducción.
 * `display` es el titular editorial de las páginas públicas (Fraunces grande; un `<em>` dentro
 * del título sale en cursiva terracota). `h1` es el del panel.
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
  const display = size === 'display';
  return (
    <header
      className={`flex flex-wrap items-end justify-between gap-x-8 gap-y-5 ${
        display ? 'border-b border-line/80 pb-[clamp(1.5rem,4vw,2.75rem)]' : ''
      } ${className}`}
    >
      <div className={display ? 'max-w-5xl' : 'max-w-3xl'}>
        {eyebrow &&
          (display ? (
            <p className={`eyebrow ${tone === 'danger' ? 'text-danger' : 'text-accent-strong'}`}>
              {eyebrow}
            </p>
          ) : (
            <p
              className={`text-sm font-semibold tracking-widest uppercase ${
                tone === 'danger' ? 'text-danger' : 'text-accent-strong'
              }`}
            >
              {eyebrow}
            </p>
          ))}
        <h1
          className={
            display
              ? `mt-4 font-headline text-display ${tone === 'danger' ? 'text-ink' : 'text-brand-strong'}`
              : `mt-2 text-h1 font-semibold ${tone === 'danger' ? 'text-ink' : 'text-brand-strong'}`
          }
        >
          {title}
        </h1>
        {intro && (
          <div
            className={
              display
                ? 'mt-[clamp(1rem,2.5vw,1.75rem)] max-w-2xl text-lead text-ink-soft'
                : 'mt-3 max-w-prose text-lg text-ink-soft'
            }
          >
            {intro}
          </div>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
