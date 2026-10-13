import Link from 'next/link';
import { BrandLogo } from '@/components/BrandMark';
import { Icon, type IconName } from '@/components/Icon';
import { botonClases } from '@/disenos/vibrante/boton';
import { Contenedor } from '@/disenos/vibrante/Contenedor';
import type { PublicNavGroup, PublicNavItem } from '@/lib/nav';

function TituloColumna({ children }: { children: React.ReactNode }) {
  return <h2 className="eyebrow text-(--d-crema-tenue)">{children}</h2>;
}

/**
 * Pie negro de la propuesta: logo crema, la visión en itálica, «Planifica tu visita», los grupos
 * del menú (ya filtrados por contenido), visítanos con redes y, abajo, los enlaces legales. Con
 * «Cómo llegar», deja aire abajo en el celular para la barra fija.
 */
export function Pie({
  nombre,
  nombreCorto,
  vision,
  direccion,
  email,
  comoLlegar,
  redes,
  menu,
  links,
  legal,
}: {
  nombre: string;
  nombreCorto: string;
  vision: string | null;
  direccion: string | null;
  email: string | null;
  comoLlegar: string | null;
  redes: { label: string; icon: IconName; href: string }[];
  menu: PublicNavGroup[];
  links: PublicNavItem[];
  legal: PublicNavItem[];
}) {
  return (
    <footer
      className={`bg-(--d-negro-hondo) text-canvas on-dark ${comoLlegar ? 'pb-20 md:pb-0' : ''}`}
    >
      <Contenedor
        ancho="recogido"
        className="flex flex-col gap-[clamp(2.5rem,6vw,4.5rem)] py-[clamp(3rem,7vw,5.5rem)]"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-5">
            <p>
              <BrandLogo className="h-[clamp(3.5rem,2.6rem+3.6vw,5.5rem)]" />
              <span className="sr-only">{nombre}</span>
            </p>
            {vision && (
              <p className="font-headline text-[clamp(1.5rem,1.15rem+1.5vw,2.375rem)] leading-[1.1] text-balance">
                <em>{vision}</em>
              </p>
            )}
          </div>
          <Link
            href="/soy-nuevo"
            className={botonClases({ tamano: 'lg', className: 'shrink-0 self-start md:self-auto' })}
          >
            Planifica tu visita <Icon name="arrowRight" className="size-5" />
          </Link>
        </div>

        <div className="grid gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-10 border-t border-canvas/15 pt-[clamp(2rem,5vw,3.5rem)] xs:grid-cols-2 md:grid-cols-[minmax(14rem,1.4fr)_repeat(auto-fit,minmax(8rem,1fr))]">
          <div className="flex flex-col gap-4 xs:col-span-2 md:col-span-1">
            <TituloColumna>Visítanos</TituloColumna>
            <address className="flex flex-col gap-3 not-italic">
              {direccion ? (
                <span className="flex gap-2">
                  <Icon name="mapPin" className="mt-0.5 size-5 text-(--d-rojo-vivo)" />
                  {direccion}
                </span>
              ) : (
                !comoLlegar && (
                  <span className="text-(--d-crema-tenue)">
                    Pronto publicaremos la dirección del auditorio.
                  </span>
                )
              )}
              {email && (
                <a href={`mailto:${email}`} className="flex gap-2 break-all hover:underline">
                  <Icon name="mail" className="mt-0.5 size-5 text-(--d-rojo-vivo)" />
                  {email}
                </a>
              )}
            </address>
            {comoLlegar && (
              <a
                href={comoLlegar}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 self-start font-bold text-(--d-rojo-vivo) hover:underline"
              >
                Cómo llegar <Icon name="arrowRight" className="size-5" />
                <span className="sr-only"> (abre Google Maps en una pestaña nueva)</span>
              </a>
            )}
            {redes.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {redes.map((r) => (
                  <li key={r.href}>
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid size-11 place-items-center rounded-[0.3rem] ring-1 ring-canvas/25 transition-colors hover:bg-(--d-rojo-vivo) hover:ring-(--d-rojo-vivo)"
                    >
                      <Icon name={r.icon} className="size-5" />
                      <span className="sr-only">{r.label} (se abre en una pestaña nueva)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {menu.map((g) => (
            <nav key={g.title} aria-label={g.title} className="flex flex-col gap-4">
              <TituloColumna>{g.title}</TituloColumna>
              <ul className="flex flex-col gap-2.5">
                {g.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-display text-[clamp(1rem,0.95rem+0.25vw,1.125rem)] font-semibold transition-colors hover:text-(--d-rojo-vivo)"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </Contenedor>

      <div className="border-t border-canvas/15">
        <Contenedor
          ancho="recogido"
          className="flex flex-col gap-3 py-5 text-sm text-(--d-crema-tenue) md:flex-row md:items-center md:justify-between"
        >
          <p>
            © {new Date().getFullYear()} {nombreCorto} · Sitio por Grupo Pixelia
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {[...links, ...legal].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-canvas hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Contenedor>
      </div>
    </footer>
  );
}
