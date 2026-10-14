import Link from 'next/link';
import { BrandLogo } from '@/components/BrandMark';
import { Contenedor } from '@/disenos/vibrante/Contenedor';
import { type MenuVibrante, RUTAS } from '@/disenos/vibrante/menu';
import { Navegacion } from '@/disenos/vibrante/Navegacion';

/**
 * Encabezado crema de la propuesta: logo en tinta, menú desplegable y el botón rojo «Planifica
 * tu visita». Es `sticky` (posicionado): el panel del menú se ubica a todo su ancho, debajo.
 */
export function Encabezado({ nombre, menu }: { nombre: string; menu: MenuVibrante }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas">
      <Contenedor ancho="recogido" className="flex h-16 items-center gap-2 md:h-19 md:gap-3">
        <Navegacion
          grupos={menu.grupos}
          sueltos={menu.sueltos}
          visita={RUTAS.primeraVisita}
          logo={
            <Link
              href={RUTAS.inicio}
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
