'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import { botonClases } from '@/disenos/vibrante/boton';
import { type PublicNavGroup, type PublicNavItem, isActivePath } from '@/lib/nav';

/**
 * Navegación de la propuesta Vibrante. Escritorio: un desplegable por grupo del menú
 * (Conócenos, Conéctate, Recursos). Celular y tablet: menú rojo a pantalla completa. Ambos son
 * `<details>`: se abren y cierran aunque el JavaScript no haya cargado; con JavaScript, además,
 * Escape cierra (y devuelve el foco al botón), un clic fuera cierra el desplegable y cambiar de
 * página cierra todo. Recibe el logo para cerrar el menú también al tocarlo en la misma página.
 */
export function Navegacion({
  logo,
  menu,
  links,
}: {
  logo: ReactNode;
  menu: PublicNavGroup[];
  links: PublicNavItem[];
}) {
  const pathname = usePathname();
  const [grupo, setGrupo] = useState<string | null>(null);
  const [movil, setMovil] = useState(false);
  const [rutaVista, setRutaVista] = useState(pathname);
  const escritorio = useRef<HTMLElement>(null);
  const botonMovil = useRef<HTMLElement>(null);

  // Cambiar de página cierra los menús (ajuste durante el render, sin efecto).
  if (rutaVista !== pathname) {
    setRutaVista(pathname);
    setGrupo(null);
    setMovil(false);
  }
  const cerrar = () => {
    setGrupo(null);
    setMovil(false);
  };

  useEffect(() => {
    if (!grupo && !movil) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (movil) botonMovil.current?.focus();
      setGrupo(null);
      setMovil(false);
    };
    const alTocar = (e: PointerEvent) => {
      if (grupo && !escritorio.current?.contains(e.target as Node)) setGrupo(null);
    };
    window.addEventListener('keydown', alTeclear);
    document.addEventListener('pointerdown', alTocar);
    return () => {
      window.removeEventListener('keydown', alTeclear);
      document.removeEventListener('pointerdown', alTocar);
    };
  }, [grupo, movil]);

  return (
    <>
      <div onClickCapture={cerrar} className="mr-auto flex min-w-0">
        {logo}
      </div>

      <nav ref={escritorio} aria-label="Principal" className="hidden lg:block">
        <ul className="flex items-center gap-[clamp(0.25rem,1vw,1rem)]">
          {menu.map((g) => {
            const activo = g.items.some((item) => isActivePath(pathname, item.href));
            return (
              <li key={g.title}>
                <details
                  open={grupo === g.title}
                  onToggle={(e) => {
                    const abierto = e.currentTarget.open;
                    setGrupo((actual) => (abierto ? g.title : actual === g.title ? null : actual));
                  }}
                  className="group relative"
                >
                  <summary
                    className={`flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-[0.3rem] px-3 font-semibold transition-colors hover:bg-sunken [&::-webkit-details-marker]:hidden ${
                      activo ? 'text-accent' : 'text-ink'
                    }`}
                  >
                    {g.title}
                    <Icon
                      name="chevronDown"
                      className="size-4 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  {/* El relleno superior une el botón y el panel. */}
                  <div className="absolute top-full right-0 z-50 pt-3">
                    <ul className="w-[22rem] border-t-4 border-accent bg-surface p-2 shadow-pop ring-1 ring-line motion-safe:animate-toast-in">
                      {g.items.map((item) => (
                        <ItemDesplegable
                          key={item.href}
                          item={item}
                          actual={isActivePath(pathname, item.href)}
                          alElegir={cerrar}
                        />
                      ))}
                    </ul>
                  </div>
                </details>
              </li>
            );
          })}
          {links.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActivePath(pathname, item.href) ? 'page' : undefined}
                className="flex min-h-11 items-center rounded-[0.3rem] px-3 font-semibold text-ink transition-colors hover:bg-sunken aria-[current=page]:text-accent"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Link
        href="/soy-nuevo"
        onClick={cerrar}
        className={botonClases({ desdeTablet: true, className: 'lg:ml-3' })}
      >
        Planifica tu visita <Icon name="arrowRight" className="size-4" />
      </Link>

      <details
        data-menu-movil
        open={movil}
        onToggle={(e) => setMovil(e.currentTarget.open)}
        className="lg:hidden"
      >
        <summary
          ref={botonMovil}
          className="grid size-11 cursor-pointer list-none place-items-center rounded-[0.3rem] text-ink transition-colors hover:bg-sunken [&::-webkit-details-marker]:hidden"
        >
          <Icon name={movil ? 'close' : 'menu'} className="size-7" />
          <span className="sr-only">{movil ? 'Cerrar menú' : 'Abrir menú'}</span>
        </summary>
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto overscroll-contain bg-accent text-canvas on-dark md:top-19">
          <nav
            aria-label="Principal (menú)"
            className="mx-auto flex w-full max-w-[48rem] flex-col gap-8 px-[clamp(1rem,3.9vw,3.75rem)] pt-6 pb-28"
          >
            {menu.map((g) => (
              <div key={g.title} className="flex flex-col gap-1">
                <p className="eyebrow">{g.title}</p>
                <ul className="grid gap-x-8 md:grid-cols-2">
                  {g.items.map((item) => {
                    const actual = isActivePath(pathname, item.href);
                    return (
                      <li key={item.href} className="border-b border-canvas/30">
                        <Link
                          href={item.href}
                          onClick={cerrar}
                          aria-current={actual ? 'page' : undefined}
                          className="flex min-h-16 items-center justify-between gap-3 py-2"
                        >
                          <span className="flex flex-col">
                            <span
                              className={`font-display text-[clamp(1.5rem,1.2rem+1.4vw,2rem)] leading-tight font-black tracking-[-0.03em] ${
                                actual ? 'underline decoration-2 underline-offset-4' : ''
                              }`}
                            >
                              {item.label}
                            </span>
                            <span className="text-sm">{item.description}</span>
                          </span>
                          <Icon name="arrowRight" className="size-6 shrink-0" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <div className="grid gap-3 xs:grid-cols-2">
              <Link
                href="/soy-nuevo"
                onClick={cerrar}
                className={botonClases({ variante: 'crema', tamano: 'lg' })}
              >
                Planifica tu visita <Icon name="arrowRight" className="size-5" />
              </Link>
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={cerrar}
                  className={botonClases({ variante: 'contorno', tamano: 'lg' })}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </details>
    </>
  );
}

function ItemDesplegable({
  item,
  actual,
  alElegir,
}: {
  item: PublicNavItem;
  actual: boolean;
  alElegir: () => void;
}) {
  return (
    <li>
      <Link
        href={item.href}
        onClick={alElegir}
        aria-current={actual ? 'page' : undefined}
        className={`group/item flex items-center gap-3 px-4 py-3 transition-colors hover:bg-sunken ${
          actual ? 'bg-sunken' : ''
        }`}
      >
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="font-display text-lg font-black tracking-[-0.02em] text-ink">
            {item.label}
          </span>
          <span className="text-sm text-ink-soft">{item.description}</span>
        </span>
        <Icon
          name="arrowRight"
          className="size-4 text-accent opacity-0 transition group-hover/item:translate-x-0 group-hover/item:opacity-100 motion-safe:-translate-x-1"
        />
      </Link>
    </li>
  );
}
