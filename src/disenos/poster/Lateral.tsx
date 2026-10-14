import Link from 'next/link';
import { botonPoster } from './botones';
import { IconoPoster } from './IconoPoster';
import { LogoPoster } from './LogoPoster';
import type { MenuPoster } from './menu';
import { MenuGrupos } from './MenuGrupos';

/**
 * Menú lateral fijo de escritorio (imagen 13): logo, Inicio, los grupos del menú como acordeón
 * (se abren con clic, teclado o al pasar el cursor), Oración y Dar, el botón «Planifica tu
 * visita» y, abajo, Riobamba. Si no cabe en la altura de la ventana, se desplaza solo él.
 */
export function Lateral({ nombre, menu }: { nombre: string; menu: MenuPoster }) {
  return (
    <aside className="sticky top-0 hidden h-dvh flex-col self-start overflow-y-auto overscroll-contain border-r-2 border-ink lg:flex">
      <div className="px-[clamp(1.25rem,1.9vw,1.875rem)] pt-[clamp(1.5rem,4vh,2.6rem)]">
        <LogoPoster nombre={nombre} className="text-[clamp(1.0625rem,0.5rem+1.15vw,1.625rem)]" />
      </div>
      <hr className="mx-[clamp(1.25rem,1.9vw,1.875rem)] my-[clamp(1rem,3.5vh,2.25rem)] border-t border-ink/45" />
      <nav aria-label="Principal">
        <MenuGrupos menu={menu} variante="lateral" />
      </nav>
      <div className="pt-[clamp(1rem,3vh,1.75rem)] pr-3 pl-[clamp(0.75rem,1.2vw,1.25rem)]">
        <Link
          href={menu.visita.href}
          className={botonPoster(
            'rojo',
            'w-full justify-between px-[0.75em] text-[clamp(0.875rem,0.72rem+0.25vw,1.0625rem)]',
          )}
        >
          <span className="font-stretch-[78%]">{menu.visita.etiqueta}</span>
          <IconoPoster nombre="arrowRight" className="d-flecha size-[1.1em]" />
        </Link>
      </div>
      <div className="mt-auto px-[clamp(1.25rem,1.9vw,1.875rem)] pt-8 pb-[clamp(1.25rem,4vh,2.5rem)]">
        <p className="flex items-center gap-[clamp(0.875rem,1.5vw,1.5rem)] border-t border-ink/45 pt-[clamp(1rem,2.5vh,1.5rem)] text-sm text-ink-soft">
          <IconoPoster nombre="montana" className="size-[1.6rem]" />
          Riobamba
        </p>
      </div>
    </aside>
  );
}
