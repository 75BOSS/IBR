import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';

/**
 * Encabezado de sección del sitio: etiqueta, título grande (un `<em>` sale en cursiva) y un
 * enlace opcional a la derecha. `align="center"` para las secciones de declaración.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  link,
  align = 'start',
  tone = 'default',
}: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  link?: { href: string; label: string };
  align?: 'start' | 'center';
  /** inverse: sobre fondos oscuros (la sección lleva `on-dark`). */
  tone?: 'default' | 'inverse';
}) {
  const centered = align === 'center';
  return (
    <div
      className={`flex min-w-0 flex-1 flex-wrap gap-x-8 gap-y-4 ${
        centered ? 'flex-col items-center text-center' : 'items-end justify-between'
      }`}
    >
      <div className={`flex max-w-3xl flex-col gap-3 ${centered ? 'items-center' : ''}`}>
        {eyebrow && (
          <p className={`eyebrow ${tone === 'inverse' ? 'text-ochre' : 'text-accent-strong'}`}>
            {eyebrow}
          </p>
        )}
        <h2
          id={id}
          className={`font-headline text-section ${tone === 'inverse' ? 'text-surface' : 'text-brand-strong'}`}
        >
          {title}
        </h2>
        {intro && (
          <div
            className={`max-w-2xl text-lead ${tone === 'inverse' ? 'text-surface/80' : 'text-ink-soft'}`}
          >
            {intro}
          </div>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className={`group inline-flex items-center gap-2 border-b-2 pb-1 font-semibold ${
            tone === 'inverse' ? 'border-ochre text-surface' : 'border-accent text-brand-strong'
          }`}
        >
          {link.label}
          <Icon
            name="arrowRight"
            className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
}
