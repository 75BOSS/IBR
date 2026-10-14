import Link from 'next/link';
import { Icon, type IconName } from '@/components/Icon';
import type { PublicNavGroup, PublicNavItem } from '@/lib/nav';
import type { MenuPoster } from './menu';
import { Lema, PestanaNueva, Titulo } from './piezas';

/**
 * Pie de la propuesta: bloque azul marino con el lema, dirección, redes y TODO el menú en
 * columnas de periódico (así, aun sin JavaScript, cada página queda a un clic): los grupos del
 * menú de la propuesta y, debajo, las demás páginas del sitio que no están en ellos. Abajo, los
 * enlaces legales (Privacidad siempre).
 */
export function Pie({
  nombre,
  direccion,
  comoLlegar,
  redes,
  menu,
  sitio,
  legal,
}: {
  nombre: string;
  direccion: string | null;
  comoLlegar: string | null;
  redes: { label: string; icon: IconName; href: string }[];
  menu: MenuPoster;
  /** Menú del sitio original (`visibleNav`): lo que no esté ya en `menu` va en «También». */
  sitio: { menu: PublicNavGroup[]; links: PublicNavItem[] };
  legal: PublicNavItem[];
}) {
  const yaEstan = new Set(
    [menu.inicio, ...menu.grupos.flatMap((g) => g.items), ...menu.sueltos].map((i) => i.href),
  );
  const tambien = [...sitio.menu.flatMap((g) => g.items), ...sitio.links].filter(
    (i) => !yaEstan.has(i.href),
  );
  const columnas = menu.grupos;
  return (
    <footer className="bg-ink text-canvas on-dark">
      <div className="flex flex-col gap-[clamp(2rem,5vw,3.5rem)] px-(--d-margen) py-[clamp(2.5rem,6vw,4.5rem)] lg:px-[clamp(1.5rem,3vw,3rem)]">
        <div className="grid gap-[clamp(2rem,4vw,3rem)] md:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))]">
          <div className="@container flex flex-col gap-4">
            <Titulo as="p" estilo="negro" className="text-[clamp(2.25rem,20cqi,4.25rem)]">
              Somos <span className="text-(--d-rojo-claro)">familia</span>
            </Titulo>
            <p className="font-semibold">{nombre}</p>
            {direccion && (
              <address className="max-w-xs text-canvas/80 not-italic">{direccion}</address>
            )}
            {comoLlegar && (
              <a
                href={comoLlegar}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 link"
              >
                Cómo llegar
                <Icon name="arrowRight" className="size-4" />
                <PestanaNueva que="abre Google Maps en una pestaña nueva" />
              </a>
            )}
            {redes.length > 0 && (
              <ul className="flex flex-wrap gap-2 pt-2">
                {redes.map((r) => (
                  <li key={r.href}>
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid size-11 place-items-center rounded-md border border-canvas/40 transition-colors hover:border-canvas hover:bg-canvas hover:text-ink"
                    >
                      <Icon name={r.icon} label={r.label} className="size-5" />
                      <PestanaNueva />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {columnas.map((grupo, i) => (
            <nav
              key={grupo.titulo}
              aria-label={`${grupo.titulo} (pie)`}
              className="flex flex-col gap-3"
            >
              <Lema as="h2" className="text-(--d-rojo-claro)">
                {grupo.titulo}
              </Lema>
              <ul className="flex flex-col">
                {[...grupo.items, ...(i === columnas.length - 1 ? menu.sueltos : [])].map(
                  (item) => (
                    <li key={item.href} className="border-b border-canvas/20">
                      <Link
                        href={item.href}
                        className="flex min-h-11 items-center font-display text-[1.0625rem] font-bold uppercase font-stretch-[85%] hover:text-(--d-rojo-claro)"
                      >
                        {item.etiqueta}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          ))}
        </div>
        {tambien.length > 0 && (
          <nav
            aria-label="También en el sitio (pie)"
            className="flex flex-col gap-3 border-t border-canvas/30 pt-6 md:flex-row md:items-baseline md:gap-8"
          >
            <Lema as="h2" className="shrink-0 text-(--d-rojo-claro)">
              También
            </Lema>
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {tambien.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center link-quiet font-semibold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-canvas/30 pt-6 text-sm text-canvas/80">
          <p>
            © {new Date().getFullYear()} {nombre}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center link-quiet">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
