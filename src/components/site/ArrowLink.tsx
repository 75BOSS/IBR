import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';

/**
 * Enlace a una página con más («Ver todos →», «Conócenos →»): raya naranja debajo y la flecha
 * avanza al pasar el mouse. Sobre fondos oscuros (`on-dark`) toma los colores claros solo.
 */
export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 border-b-2 border-(--link-line) pb-1 font-semibold text-(--link-ink)"
    >
      {children}
      <Icon
        name="arrowRight"
        className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
      />
    </Link>
  );
}
