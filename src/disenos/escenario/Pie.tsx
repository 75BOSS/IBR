import Link from 'next/link';
import type { IconName } from '@/components/Icon';
import type { PublicNavItem } from '@/lib/nav';
import { Logo } from './Logo';
import type { MenuEscenario } from './menu';
import { Redes } from './Redes';
import { INICIO } from './rutas';

/**
 * Pie de la propuesta (no aparece en las imágenes): azul marino hondo como las bandas, el logo al
 * centro como en el encabezado, los mismos grupos del menú desplegable (con las páginas de la
 * propuesta), redes, los enlaces sueltos, Contacto y los legales (Privacidad siempre). Ningún
 * enlace lleva a una página vacía (`menuEscenario` y `visibleNav`).
 */
export function Pie({
  menu,
  legal,
  redes,
  nombre,
}: {
  menu: MenuEscenario;
  legal: PublicNavItem[];
  redes: { label: string; icon: IconName; href: string }[];
  nombre: string;
}) {
  const grupos = [...menu.izquierda, ...menu.derecha];
  const sueltos = [...menu.sueltos, { href: '/contacto', label: 'Contacto' }, ...legal];
  return (
    <footer className="bg-(--d-marino-hondo) text-cream on-dark">
      <div className="container-page flex flex-col items-center gap-[clamp(2rem,5vw,3rem)] py-[clamp(2.5rem,6vw,4rem)]">
        <Link href={INICIO} className="rounded-lg">
          <Logo tono="crema" alto="h-[clamp(2.75rem,2.2rem+1.6vw,3.5rem)]" />
          <span className="sr-only">{nombre}, inicio</span>
        </Link>

        <nav
          aria-label="Pie de página"
          className="grid w-full max-w-[60rem] grid-cols-2 gap-x-6 gap-y-8 text-center md:grid-cols-4"
        >
          {grupos.map((grupo) => (
            <div key={grupo.titulo} className="flex flex-col items-center gap-3">
              <p className="caps text-cream/65">{grupo.titulo}</p>
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
          <p className="text-center">
            © {new Date().getFullYear()} {nombre} · Somos Familia
          </p>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            {sueltos.map((item) => (
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
