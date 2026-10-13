import Link from 'next/link';
import { BrandLogo } from '@/components/BrandMark';
import { Icon, type IconName } from '@/components/Icon';
import type { PublicNavGroup, PublicNavItem } from '@/lib/nav';
import { Aro, CONTENEDOR, CURSIVA, Etiqueta, PestanaNueva, RUTAS } from './ui';

/**
 * Pie de la propuesta Nocturna (no aparece en las imágenes): azul tinta como la tarjeta de la
 * prédica, el logo en durazno, la visión en la itálica de los títulos, el menú por grupos, las
 * redes configuradas y los enlaces legales (Privacidad siempre).
 */
export function Pie({
  nombre,
  vision,
  menu,
  legal,
  redes,
  conBarra,
}: {
  nombre: string;
  vision: string | null;
  menu: PublicNavGroup[];
  legal: PublicNavItem[];
  redes: { label: string; icon: IconName; href: string }[];
  /** En celular la barra fija «Cómo llegar» tapa el final: se deja su alto libre. */
  conBarra: boolean;
}) {
  return (
    <footer
      className={`bg-(--d-tinta) text-cream on-dark ${
        conBarra ? 'pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0' : ''
      }`}
    >
      <div
        className={`${CONTENEDOR} grid gap-x-[clamp(1.5rem,4vw,4rem)] gap-y-10 py-[clamp(3rem,7vw,5.5rem)] md:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]`}
      >
        <div className="flex flex-col items-start gap-5">
          <Link href={RUTAS.inicio} className="rounded-lg text-peach">
            <BrandLogo className="h-[clamp(2.5rem,2.1rem+1vw,3.25rem)]" />
            <span className="sr-only">{nombre}, ir al inicio</span>
          </Link>
          {vision && (
            <p
              className={`max-w-xs text-[clamp(1.25rem,1.1rem+0.6vw,1.625rem)] leading-snug text-peach ${CURSIVA}`}
            >
              {vision}
            </p>
          )}
          {redes.length > 0 && (
            <ul className="flex flex-wrap gap-3">
              {redes.map((red) => (
                <li key={red.href}>
                  <a
                    href={red.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex rounded-full text-(--d-arena) transition-colors hover:text-peach"
                  >
                    <Aro className="size-11">
                      <Icon name={red.icon} className="size-[1.125rem]" />
                    </Aro>
                    <span className="sr-only">
                      {red.label}
                      <PestanaNueva />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        {menu.map((grupo) => (
          <nav key={grupo.title} aria-label={grupo.title} className="flex flex-col gap-4">
            <Etiqueta raya={false} className="text-(--d-arena)">
              {grupo.title}
            </Etiqueta>
            <ul className="flex flex-col gap-2.5">
              {grupo.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-cream/85 transition-colors hover:text-peach"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-cream/12">
        <div
          className={`${CONTENEDOR} flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5 text-sm text-cream/70`}
        >
          <p>
            © {new Date().getFullYear()} {nombre}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-quiet font-normal">
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
