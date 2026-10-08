import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';

/**
 * «‹ Volver a la lista» arriba de una página de detalle (grupo, evento, ministerio) o de una
 * subpantalla del panel. Un solo estilo para la salida clara en todo el sitio.
 */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 self-start link-quiet">
      <Icon name="chevronLeft" className="size-4" />
      {children}
    </Link>
  );
}
