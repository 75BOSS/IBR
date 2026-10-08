import type { ReactNode } from 'react';
import { ArrowLink } from '@/components/site/ArrowLink';

/**
 * Encabezado de sección del sitio: etiqueta, título grande (un `<em>` sale en la manuscrita) y
 * un enlace opcional a la derecha («Ver todos →»).
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  link,
}: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  link?: { href: string; label: string };
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div className="flex max-w-3xl flex-col gap-3">
        {eyebrow && <p className="eyebrow text-accent-strong">{eyebrow}</p>}
        <h2 id={id} className="font-headline text-section text-brand-strong">
          {title}
        </h2>
      </div>
      {link && <ArrowLink href={link.href}>{link.label}</ArrowLink>}
    </div>
  );
}
