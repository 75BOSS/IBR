import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';

/**
 * «ENCUENTRA UN GRUPO →» (imagen 2): versalitas naranjas con flecha y una raya corta debajo que
 * se dibuja hasta el final al pasar el mouse o al enfocar. Para «ver más» al pie de una tarjeta o
 * junto a un título. `claro`: durazno, sobre azul noche.
 */
export function EnlaceFlecha({
  href,
  children,
  claro = false,
}: {
  href: string;
  children: ReactNode;
  claro?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group/enlace relative inline-flex items-center gap-3 self-start pb-2 text-[clamp(0.75rem,0.72rem+0.12vw,0.84rem)] font-bold tracking-[0.16em] uppercase after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-14 after:transition-[width] after:duration-500 after:ease-(--ease-out-soft) hover:after:w-full focus-visible:after:w-full ${
        claro ? 'text-peach after:bg-peach' : 'text-accent-strong after:bg-accent'
      }`}
    >
      {children}
      <Icon
        name="arrowRight"
        className="size-4 shrink-0 transition-transform motion-safe:group-hover/enlace:translate-x-1"
      />
    </Link>
  );
}
