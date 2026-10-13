import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';

/**
 * «Conoce más →»: enlace rojo con flecha que avanza al pasar el mouse. Con `cubre`, el enlace
 * cubre toda su tarjeta (la tarjeta lleva `relative group`).
 */
export function FlechaEnlace({
  href,
  cubre = false,
  className = '',
  children,
}: {
  href: string;
  cubre?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`group/flecha inline-flex min-h-11 items-center gap-3 self-start font-bold text-accent transition-colors hover:text-accent-strong ${
        cubre ? 'after:absolute after:inset-0' : ''
      } ${className}`}
    >
      {children}
      <Icon
        name="arrowRight"
        className="size-5 transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-hover/flecha:translate-x-1"
      />
    </Link>
  );
}
