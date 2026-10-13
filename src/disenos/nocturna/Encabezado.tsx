'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BrandLogo } from '@/components/BrandMark';
import { Icon } from '@/components/Icon';
import { type PublicNavGroup, type PublicNavItem, isActivePath } from '@/lib/nav';
import { CONTENEDOR, Etiqueta, RUTAS, pildora } from './ui';

/**
 * Encabezado de la propuesta Nocturna. En el inicio es azul marino con el logo en durazno y el
 * botón «Planifica tu visita» (imágenes 7 y 9); en las páginas interiores es crema con el logo
 * azul y el botón naranja «Soy nuevo» (imagen 8). Escritorio: un desplegable por grupo del menú.
 * Celular y tablet: menú a pantalla completa bajo el encabezado (Escape cierra y devuelve el
 * foco al botón; al abrir, el foco entra al menú).
 */
export function Encabezado({
  nombre,
  menu,
  links,
}: {
  nombre: string;
  menu: PublicNavGroup[];
  links: PublicNavItem[];
}) {
  const pathname = usePathname();
  const oscuro = pathname.replace(/\/+$/, '') === RUTAS.inicio;
  const [movilAbierto, setMovilAbierto] = useState(false);
  const [grupoAbierto, setGrupoAbierto] = useState<string | null>(null);
  const [rutaVista, setRutaVista] = useState(pathname);
  const navRef = useRef<HTMLElement>(null);
  const botonMovil = useRef<HTMLButtonElement>(null);
  const panelMovil = useRef<HTMLDivElement>(null);
  // Con mouse, el desplegable ya se abrió al pasar por encima: el clic no debe cerrarlo.
  const ultimoPuntero = useRef<string | null>(null);

  // Cambiar de ruta cierra los menús (ajuste de estado durante el render, sin efecto).
  if (rutaVista !== pathname) {
    setRutaVista(pathname);
    setMovilAbierto(false);
    setGrupoAbierto(null);
  }
  const cerrarTodo = () => {
    setMovilAbierto(false);
    setGrupoAbierto(null);
  };

  useEffect(() => {
    if (!movilAbierto && !grupoAbierto) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (movilAbierto) botonMovil.current?.focus();
      setMovilAbierto(false);
      setGrupoAbierto(null);
    };
    const alTocar = (e: PointerEvent) => {
      if (grupoAbierto && !navRef.current?.contains(e.target as Node)) setGrupoAbierto(null);
    };
    window.addEventListener('keydown', alTeclear);
    document.addEventListener('pointerdown', alTocar);
    // Con el menú del celular abierto, la página de atrás no se desplaza.
    document.body.style.overflow = movilAbierto ? 'hidden' : '';
    return () => {
      window.removeEventListener('keydown', alTeclear);
      document.removeEventListener('pointerdown', alTocar);
      document.body.style.overflow = '';
    };
  }, [movilAbierto, grupoAbierto]);

  // Al abrir el menú del celular, el foco entra en su primer enlace.
  useEffect(() => {
    if (movilAbierto) panelMovil.current?.querySelector<HTMLElement>('a')?.focus();
  }, [movilAbierto]);

  const tono = oscuro
    ? {
        barra: 'border-cream/12 bg-brand text-cream on-dark',
        logo: 'text-peach',
        grupo: 'text-cream hover:text-peach',
        flecha: 'text-cream/70',
        panel: 'bg-(--d-tinta) text-cream ring-cream/12',
        item: 'hover:bg-cream/8',
        descripcion: 'text-cream/70',
        cta: pildora({ tono: 'durazno', tamano: 'sm' }),
        ctaTexto: 'Planifica tu visita',
      }
    : {
        barra: 'border-line bg-canvas text-ink',
        logo: 'text-ink',
        grupo: 'text-ink hover:text-accent-strong',
        flecha: 'text-ink-soft',
        panel: 'bg-surface text-ink ring-line',
        item: 'hover:bg-sunken',
        descripcion: 'text-ink-soft',
        cta: pildora({ tono: 'naranja', tamano: 'sm' }),
        ctaTexto: 'Soy nuevo',
      };

  return (
    <header className={`sticky top-0 z-40 h-(--d-cabecera) border-b ${tono.barra}`}>
      <div
        className={`${CONTENEDOR} flex h-full items-center gap-[clamp(0.5rem,1.6vw,2.25rem)] xl:max-w-[76rem]`}
      >
        <Link
          href={RUTAS.inicio}
          onClick={cerrarTodo}
          className={`mr-auto flex min-w-0 items-center rounded-lg ${tono.logo}`}
        >
          <BrandLogo className="h-[clamp(2.125rem,1.7rem+1.1vw,3.125rem)]" />
          <span className="sr-only">{nombre}, ir al inicio</span>
        </Link>

        <nav ref={navRef} aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-[clamp(0.25rem,1vw,1.25rem)]">
            {menu.map((grupo, i) => {
              const abierto = grupoAbierto === grupo.title;
              const activo = grupo.items.some((item) => isActivePath(pathname, item.href));
              const panelId = `nocturna-grupo-${i}`;
              return (
                <li
                  key={grupo.title}
                  className="relative"
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setGrupoAbierto(grupo.title)}
                  onPointerLeave={(e) => e.pointerType === 'mouse' && setGrupoAbierto(null)}
                >
                  <button
                    type="button"
                    aria-expanded={abierto}
                    aria-controls={panelId}
                    onPointerDown={(e) => {
                      ultimoPuntero.current = e.pointerType;
                    }}
                    onClick={() => {
                      // Mouse: solo abre (cierra al salir). Teclado o táctil: alterna.
                      const mouse = ultimoPuntero.current === 'mouse';
                      ultimoPuntero.current = null;
                      setGrupoAbierto(mouse || !abierto ? grupo.title : null);
                    }}
                    className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[0.9375rem] font-medium transition-colors ${tono.grupo}`}
                  >
                    <span
                      className={`decoration-2 underline-offset-8 ${
                        activo ? 'underline decoration-(--d-durazno)' : ''
                      }`}
                    >
                      {grupo.title}
                    </span>
                    <Icon
                      name="chevronDown"
                      className={`size-4 transition-transform motion-safe:duration-200 ${tono.flecha} ${
                        abierto ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {/* El relleno superior mantiene el mouse dentro mientras baja al panel. */}
                  <div id={panelId} hidden={!abierto} className="absolute top-full left-0 pt-3">
                    <ul
                      className={`w-[21rem] rounded-2xl p-2 shadow-pop ring-1 motion-safe:animate-toast-in ${tono.panel}`}
                    >
                      {grupo.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={cerrarTodo}
                            aria-current={isActivePath(pathname, item.href) ? 'page' : undefined}
                            className={`flex flex-col rounded-xl px-4 py-3 transition-colors ${tono.item}`}
                          >
                            <span className="font-display font-semibold">{item.label}</span>
                            <span className={`text-sm ${tono.descripcion}`}>
                              {item.description}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`inline-flex min-h-11 items-center rounded-full px-3 text-[0.9375rem] font-medium transition-colors ${tono.grupo}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <Link href="/soy-nuevo" className={tono.cta}>
            {tono.ctaTexto}
          </Link>
        </div>

        <button
          ref={botonMovil}
          type="button"
          aria-expanded={movilAbierto}
          aria-controls="nocturna-menu-movil"
          onClick={() => setMovilAbierto((v) => !v)}
          className="-mr-2 grid size-11 place-items-center rounded-full lg:hidden"
        >
          <Icon name={movilAbierto ? 'close' : 'menu'} className="size-7" />
          <span className="sr-only">{movilAbierto ? 'Cerrar menú' : 'Abrir menú'}</span>
        </button>
      </div>

      <div
        id="nocturna-menu-movil"
        ref={panelMovil}
        hidden={!movilAbierto}
        className="fixed inset-x-0 top-(--d-cabecera) bottom-0 overflow-y-auto overscroll-contain bg-(--d-noche) text-cream on-dark lg:hidden"
      >
        <nav
          aria-label="Principal (menú)"
          className={`${CONTENEDOR} flex flex-col gap-[clamp(1.75rem,5vw,2.5rem)] py-[clamp(1.5rem,5vw,2.5rem)]`}
        >
          {menu.map((grupo) => (
            <div key={grupo.title} className="flex flex-col gap-2">
              <Etiqueta className="text-(--d-arena)">{grupo.title}</Etiqueta>
              <ul className="grid gap-x-8 md:grid-cols-2">
                {grupo.items.map((item) => {
                  const activo = isActivePath(pathname, item.href);
                  return (
                    <li key={item.href} className="border-b border-cream/12">
                      <Link
                        href={item.href}
                        onClick={cerrarTodo}
                        aria-current={activo ? 'page' : undefined}
                        className="flex min-h-14 items-center justify-between gap-3 py-2"
                      >
                        <span className="flex flex-col">
                          <span
                            className={`font-display text-[clamp(1.25rem,1.05rem+1vw,1.625rem)] leading-tight font-semibold ${
                              activo ? 'text-peach' : ''
                            }`}
                          >
                            {item.label}
                          </span>
                          <span className="text-sm text-cream/70">{item.description}</span>
                        </span>
                        <Icon name="arrowRight" className="size-5 text-peach" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/soy-nuevo"
              onClick={cerrarTodo}
              className={pildora({ tono: 'durazno', tamano: 'lg', className: 'grow' })}
            >
              Planifica tu visita <Icon name="arrowRight" className="size-5" />
            </Link>
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={cerrarTodo}
                className={pildora({ tono: 'contornoClaro', tamano: 'lg', className: 'grow' })}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
