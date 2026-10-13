import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';

/**
 * «ENCUENTRA UN GRUPO →» (imagen 2): versalitas naranjas con flecha y una raya corta debajo que
 * se alarga al pasar el mouse. Para «ver más» al pie de una tarjeta o junto a un título.
 */
export function EnlaceFlecha({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group/enlace relative inline-flex items-center gap-3 self-start pb-2 text-[clamp(0.75rem,0.72rem+0.12vw,0.84rem)] font-bold tracking-[0.16em] text-accent-strong uppercase after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-14 after:bg-accent after:transition-[width] after:duration-300 hover:after:w-full"
    >
      {children}
      <Icon
        name="arrowRight"
        className="size-4 transition-transform motion-safe:group-hover/enlace:translate-x-1"
      />
    </Link>
  );
}
