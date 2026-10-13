'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IconName } from '@/components/Icon';
import type { PublicNavGroup, PublicNavItem } from '@/lib/nav';
import { Desplegables } from './Desplegables';
import { claseBoton, claseEnlaceMenu } from './estilos';
import { Logo } from './Logo';
import { MenuCelular } from './MenuCelular';
import { repartirMenu } from './menu';
import { INICIO, PRIMERA_VISITA } from './rutas';

/**
 * Encabezado con el logo al centro y el menú partido a los lados.
 * - Portada (imagen 10 y 12): en escritorio, barra azul marino fija arriba; en celular y tablet va
 *   encima de la foto (transparente, con un velo para el contraste) y se queda en la portada.
 * - Páginas interiores (imagen 11): barra crema fija con línea inferior, sello rojo y
 *   «Visítanos» como botón rojo.
 * En celular y tablet: menú de tres rayas a la izquierda y el logo al centro.
 */
export function Encabezado({
  menu,
  links,
  redes,
  nombre,
}: {
  menu: PublicNavGroup[];
  links: PublicNavItem[];
  redes: { label: string; icon: IconName; href: string }[];
  nombre: string;
}) {
  const pathname = usePathname();
  const enPortada = pathname === INICIO;
  const tono = enPortada ? 'oscuro' : 'claro';
  const { izquierda, derecha } = repartirMenu(menu, links);

  return (
    <header
      className={
        enPortada
          ? 'absolute inset-x-0 top-0 z-40 bg-(image:--d-velo-encabezado) text-cream on-dark lg:sticky lg:bg-(--d-marino) lg:bg-none'
          : 'sticky top-0 z-40 border-b border-line bg-canvas text-ink'
      }
    >
      <nav
        aria-label="Principal"
        className="container-page grid h-16 max-w-[68rem] grid-cols-[1fr_auto_1fr] items-center gap-4 md:h-[4.5rem] lg:h-[5.125rem]"
      >
        <div className="flex items-center">
          <div className="lg:hidden">
            <MenuCelular menu={menu} links={links} redes={redes} tono={tono} />
          </div>
          <div className="hidden lg:block">
            <Desplegables grupos={izquierda} tono={tono} lado="izquierda" />
          </div>
        </div>

        <Link href={INICIO} className="rounded-lg">
          <Logo
            tono={enPortada ? 'crema' : 'rojo'}
            alto="h-[clamp(2.25rem,1.4rem+2.2vw,3.625rem)]"
          />
          <span className="sr-only">{nombre}, inicio</span>
        </Link>

        <div className="hidden items-center justify-end gap-x-[clamp(1.5rem,3.2vw,3.5rem)] lg:flex">
          <Desplegables grupos={derecha} tono={tono} lado="derecha" />
          <Link
            href={PRIMERA_VISITA}
            aria-current={pathname === PRIMERA_VISITA ? 'page' : undefined}
            className={enPortada ? claseEnlaceMenu(tono) : claseBoton('cabecera')}
          >
            Visítanos
          </Link>
        </div>
      </nav>
    </header>
  );
}
