'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from '@/components/Icon';
import { Desplegables } from './Desplegables';
import { FLECHA, claseBoton } from './estilos';
import { Logo } from './Logo';
import { MenuCelular } from './MenuCelular';
import type { MenuEscenario } from './menu';
import { INICIO, PRIMERA_VISITA } from './rutas';

/**
 * Encabezado con el logo al centro y el menú partido a los lados (Conócenos, Siguiente paso y
 * Comunidad a la izquierda; Recursos, Oración, Dar y «Planifica tu visita» a la derecha).
 * - Portada (imagen 10 y 12): en escritorio, barra azul marino fija arriba; en celular y tablet va
 *   encima de la foto (transparente, con un velo para el contraste) y se queda en la portada.
 * - Páginas interiores (imagen 11): barra crema fija con línea inferior y sello rojo.
 * En celular y tablet: menú de tres rayas a la izquierda y el logo al centro.
 */
export function Encabezado({
  menu,
  redes,
  nombre,
}: {
  menu: MenuEscenario;
  redes: { label: string; icon: IconName; href: string }[];
  nombre: string;
}) {
  const pathname = usePathname();
  const enPortada = pathname === INICIO;
  const tono = enPortada ? 'oscuro' : 'claro';

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
        className="container-page grid h-16 max-w-[80rem] grid-cols-[1fr_auto_1fr] items-center gap-[clamp(0.75rem,1.4vw,1.5rem)] md:h-[4.5rem] lg:h-[5.125rem]"
      >
        <div className="flex items-center">
          <div className="lg:hidden">
            <MenuCelular menu={menu} redes={redes} tono={tono} />
          </div>
          <div className="hidden lg:block">
            <Desplegables grupos={menu.izquierda} tono={tono} lado="izquierda" />
          </div>
        </div>

        <Link href={INICIO} className="rounded-lg">
          <Logo
            tono={enPortada ? 'crema' : 'rojo'}
            alto="h-[clamp(2.25rem,1.6rem+1.6vw,3.375rem)]"
          />
          <span className="sr-only">{nombre}, inicio</span>
        </Link>

        <div className="hidden justify-end lg:flex">
          <Desplegables grupos={menu.derecha} sueltos={menu.sueltos} tono={tono} lado="derecha">
            <Link
              href={PRIMERA_VISITA}
              aria-current={pathname === PRIMERA_VISITA ? 'page' : undefined}
              className={claseBoton('cabecera')}
            >
              Planifica tu visita
              <Icon name="arrowRight" className={`${FLECHA} hidden xl:block`} />
            </Link>
          </Desplegables>
        </div>
      </nav>
    </header>
  );
}
