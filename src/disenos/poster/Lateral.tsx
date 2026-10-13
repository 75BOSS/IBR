import type { PublicNavGroup, PublicNavItem } from '@/lib/nav';
import { EnlacesPrincipales } from './EnlacesPrincipales';
import type { EnlacePrincipal } from './enlaces';
import { IconoPoster } from './IconoPoster';
import { LogoPoster } from './LogoPoster';
import { MenuSitio } from './MenuSitio';

/**
 * Menú lateral fijo de escritorio (imagen 13): logo, los destinos principales con íconos (el
 * actual en rojo con su raya), «Todo el sitio» para el resto de páginas y, abajo, Riobamba.
 */
export function Lateral({
  nombre,
  enlaces,
  menu,
  links,
}: {
  nombre: string;
  enlaces: EnlacePrincipal[];
  menu: PublicNavGroup[];
  links: PublicNavItem[];
}) {
  return (
    <aside className="sticky top-0 hidden h-dvh flex-col self-start overflow-y-auto border-r-2 border-ink lg:flex">
      <div className="px-[clamp(1.25rem,1.9vw,1.875rem)] pt-[clamp(1.5rem,4vh,2.6rem)]">
        <LogoPoster nombre={nombre} className="text-[clamp(1.0625rem,0.5rem+1.15vw,1.625rem)]" />
      </div>
      <hr className="mx-[clamp(1.25rem,1.9vw,1.875rem)] my-[clamp(1.25rem,4.5vh,2.75rem)] border-t border-ink/45" />
      <nav aria-label="Principal">
        <EnlacesPrincipales enlaces={enlaces} variante="lateral" />
      </nav>
      <MenuSitio nombre={nombre} menu={menu} links={links} variante="lateral" />
      <div className="mt-auto px-[clamp(1.25rem,1.9vw,1.875rem)] pt-8 pb-[clamp(1.25rem,4vh,2.5rem)]">
        <p className="flex items-center gap-[clamp(0.875rem,1.5vw,1.5rem)] border-t border-ink/45 pt-[clamp(1rem,2.5vh,1.5rem)] text-sm text-ink-soft">
          <IconoPoster nombre="montana" className="size-[1.6rem]" />
          Riobamba
        </p>
      </div>
    </aside>
  );
}
