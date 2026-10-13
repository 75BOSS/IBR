import Link from 'next/link';
import { BrandLogo } from '@/components/BrandMark';
import type { PublicNavGroup, PublicNavItem } from '@/lib/nav';
import { Navegacion } from './Navegacion';

/** Encabezado claro de la propuesta: logo «Somos Familia», menú y «Planifica tu visita». */
export function Encabezado({
  nombre,
  menu,
  links,
}: {
  nombre: string;
  menu: PublicNavGroup[];
  links: PublicNavItem[];
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur-md">
      <div className="mx-auto flex h-[3.75rem] w-full max-w-[84rem] items-center gap-2 px-[clamp(1rem,4vw,3.5rem)] lg:h-[4.625rem]">
        <Navegacion
          menu={menu}
          links={links}
          logo={
            <Link href="/disenos/calida" className="flex min-w-0 items-center rounded-lg text-ink">
              <BrandLogo className="h-[clamp(2.125rem,1.9rem+0.9vw,3.125rem)]" />
              <span className="sr-only">{nombre}, ir al inicio</span>
            </Link>
          }
        />
      </div>
    </header>
  );
}
