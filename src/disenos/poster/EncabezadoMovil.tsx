import { LogoPoster } from './LogoPoster';
import type { MenuPoster } from './menu';
import { MenuSitio } from './MenuSitio';

/** Encabezado del celular y la tablet (imagen 15): logo azul marino y hamburguesa, enmarcados. */
export function EncabezadoMovil({ nombre, menu }: { nombre: string; menu: MenuPoster }) {
  return (
    <header className="mx-(--d-margen) flex items-center justify-between gap-4 border-x-2 border-b-2 border-ink py-[clamp(0.5rem,2vw,0.875rem)] pr-[clamp(0.5rem,2vw,1rem)] pl-[clamp(0.875rem,3vw,1.25rem)] md:border-x-0 md:pr-0 md:pl-0 lg:hidden">
      <LogoPoster
        nombre={nombre}
        colorSello="text-ink"
        className="text-[clamp(0.9375rem,0.8rem+0.6vw,1.25rem)]"
      />
      <MenuSitio nombre={nombre} menu={menu} />
    </header>
  );
}
