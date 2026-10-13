import Link from 'next/link';
import { BrandLogo } from '@/components/BrandMark';
import { Icon, type IconName } from '@/components/Icon';
import type { PublicNavGroup, PublicNavItem } from '@/lib/nav';
import { Contenedor } from './Contenedor';
import { Etiqueta } from './Etiqueta';
import { botonCalida } from './botones';

/**
 * Pie de la propuesta (la imagen no lo muestra): azul noche como las tarjetas oscuras, logo en
 * crema, la visión en la itálica caligráfica, las columnas del menú (ya filtradas por contenido),
 * visítanos con «Cómo llegar», redes y los enlaces legales (Privacidad siempre).
 */
export function Pie({
  nombre,
  vision,
  direccion,
  email,
  comoLlegar,
  menu,
  links,
  legal,
  redes,
}: {
  nombre: string;
  vision: string | null;
  direccion: string | null;
  email: string | null;
  comoLlegar: string | null;
  menu: PublicNavGroup[];
  links: PublicNavItem[];
  legal: PublicNavItem[];
  redes: { label: string; icon: IconName; href: string }[];
}) {
  const anio = new Date().getFullYear();
  return (
    <footer className="bg-(--d-noche) text-cream on-dark">
      <Contenedor className="flex flex-col gap-[clamp(2.5rem,5vw,4rem)] py-[clamp(3rem,7vw,5.5rem)]">
        <div className="grid gap-[clamp(2.5rem,5vw,4rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex flex-col items-start gap-6">
            <Link href="/disenos/calida" className="rounded-lg text-cream">
              <BrandLogo className="h-[clamp(3.25rem,2.6rem+2.4vw,4.75rem)]" />
              <span className="sr-only">{nombre}, ir al inicio</span>
            </Link>
            {vision && (
              <p className="max-w-md font-script text-[clamp(1.5rem,1.25rem+1vw,2.125rem)] leading-[1.15] text-peach italic">
                {vision}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Link href="/soy-nuevo" className={botonCalida('naranja')}>
                Planifica tu visita
                <Icon name="arrowRight" className="size-5" />
              </Link>
              {links.map((item) => (
                <Link key={item.href} href={item.href} className={botonCalida('contornoClaro')}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <nav
            aria-label="Pie de página"
            className="grid grid-cols-2 gap-x-6 gap-y-9 md:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]"
          >
            {menu.map((grupo) => (
              <div key={grupo.title} className="flex flex-col gap-4">
                <Etiqueta como="h2" className="text-peach">
                  {grupo.title}
                </Etiqueta>
                <ul className="flex flex-col gap-2.5">
                  {grupo.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="link-quiet">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-6 border-t border-cream/15 pt-[clamp(1.75rem,4vw,2.5rem)] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            {direccion && (
              <address className="flex gap-2 text-cream/90 not-italic">
                <Icon name="mapPin" className="mt-0.5 size-5 text-peach" />
                {direccion}
              </address>
            )}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {comoLlegar && (
                <a
                  href={comoLlegar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 link"
                >
                  <Icon name="mapPin" className="size-5" /> Cómo llegar
                  <span className="sr-only"> (abre Google Maps en una pestaña nueva)</span>
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2 link">
                  <Icon name="mail" className="size-5" /> {email}
                </a>
              )}
            </div>
          </div>
          {redes.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {redes.map((r) => (
                <li key={r.href}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-11 place-items-center rounded-full ring-1 ring-cream/30 transition-colors hover:bg-cream/10"
                  >
                    <Icon name={r.icon} className="size-5" />
                    <span className="sr-only">{r.label} (se abre en una pestaña nueva)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-3 text-sm text-cream/75 md:flex-row md:items-center md:justify-between">
          <p>
            © {anio} {nombre}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-quiet">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Contenedor>
      {/* En el celular, la barra fija «Cómo llegar» no tapa el final del pie. */}
      {comoLlegar && <div aria-hidden="true" className="h-[4.5rem] md:hidden" />}
    </footer>
  );
}
