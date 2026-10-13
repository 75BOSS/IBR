import Link from 'next/link';
import type { IconName } from '@/components/Icon';
import type { PublicNavGroup, PublicNavItem } from '@/lib/nav';
import { Logo } from './Logo';
import { Redes } from './Redes';
import { INICIO, PRIMERA_VISITA } from './rutas';

/**
 * Pie de la propuesta (no aparece en las imágenes): azul marino hondo como las bandas, el logo al
 * centro como en el encabezado, el menú completo por grupos, redes y los enlaces legales
 * (Privacidad siempre). Todo sale de `visibleNav`: ningún enlace lleva a una página vacía.
 */
export function Pie({
  menu,
  links,
  legal,
  redes,
  nombre,
}: {
  menu: PublicNavGroup[];
  links: PublicNavItem[];
  legal: PublicNavItem[];
  redes: { label: string; icon: IconName; href: string }[];
  nombre: string;
}) {
  const grupos = [
    ...menu,
    { title: 'Visítanos', items: [{ href: PRIMERA_VISITA, label: 'Tu primera visita' }] },
  ];
  return (
    <footer className="bg-(--d-marino-hondo) text-cream on-dark">
      <div className="container-page flex flex-col items-center gap-[clamp(2rem,5vw,3rem)] py-[clamp(2.5rem,6vw,4rem)]">
        <Link href={INICIO} className="rounded-lg">
          <Logo tono="crema" alto="h-[clamp(2.75rem,2.2rem+1.6vw,3.5rem)]" />
          <span className="sr-only">{nombre}, inicio</span>
        </Link>

        <nav
          aria-label="Pie de página"
          className="grid w-full max-w-[56rem] grid-cols-2 gap-x-6 gap-y-8 text-center md:grid-cols-4"
        >
          {grupos.map((grupo) => (
            <div key={grupo.title} className="flex flex-col items-center gap-3">
              <p className="caps text-cream/65">{grupo.title}</p>
              <ul className="flex flex-col items-center gap-1 text-cream/90">
                {grupo.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="inline-flex min-h-9 items-center link-quiet">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <Redes redes={redes} />

        <div className="flex w-full flex-col items-center gap-3 border-t border-cream/15 pt-6 text-sm text-cream/70 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {nombre} · Somos Familia
          </p>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            {[...links, ...legal].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-9 items-center link-quiet">
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
