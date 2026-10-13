import Link from 'next/link';
import { BrandLogo } from '@/components/BrandMark';
import { Contenedor } from '@/disenos/vibrante/Contenedor';
import { RUTA_INICIO } from '@/disenos/vibrante/menu';
import { Navegacion } from '@/disenos/vibrante/Navegacion';
import type { PublicNavGroup, PublicNavItem } from '@/lib/nav';

/** Encabezado crema de la propuesta: logo en tinta, menú y el botón rojo «Planifica tu visita». */
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
    <header className="sticky top-0 z-40 border-b border-line bg-canvas">
      <Contenedor ancho="recogido" className="flex h-16 items-center gap-2 md:h-19 md:gap-3">
        <Navegacion
          menu={menu}
          links={links}
          logo={
            <Link
              href={RUTA_INICIO}
              className="flex min-w-0 items-center rounded-[0.3rem] text-ink"
            >
              <BrandLogo className="h-10 md:h-12" />
              <span className="sr-only">{nombre}, ir al inicio</span>
            </Link>
          }
        />
      </Contenedor>
    </header>
  );
}
