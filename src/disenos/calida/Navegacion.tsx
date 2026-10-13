'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import type { PublicNavGroup, PublicNavItem } from '@/lib/nav';
import { botonCalida } from './botones';
import { Etiqueta } from './Etiqueta';

/** ¿El enlace es la página actual? (el inicio de la propuesta solo coincide exacto). */
function esActual(pathname: string, href: string): boolean {
  if (href === '/disenos/calida') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

const ENFOCABLES = 'a[href], button:not([disabled])';

/**
 * Navegación de la propuesta Cálida. Escritorio: «Conócenos ▾ / Conéctate ▾ / Recursos ▾» con un
 * desplegable por grupo (clic, teclado o mouse encima) y el botón naranja «Planifica tu visita».
 * Celular y tablet: solo el logo y la hamburguesa; el menú ocupa la pantalla bajo el encabezado,
 * Escape lo cierra y devuelve el foco al botón, y el foco no se escapa a la página de atrás.
 * Recibe el menú ya filtrado por contenido (`visibleNav`): nada lleva a una página vacía.
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
  const [movilAbierto, setMovilAbierto] = useState(false);
  const [grupoAbierto, setGrupoAbierto] = useState<string | null>(null);
  const [rutaVista, setRutaVista] = useState(pathname);
  const navRef = useRef<HTMLElement>(null);
  const botonMovil = useRef<HTMLButtonElement>(null);
  const panelMovil = useRef<HTMLDivElement>(null);
  // Con mouse el desplegable ya se abrió al pasar por encima: el clic no debe cerrarlo.
  const ultimoPuntero = useRef<string | null>(null);

  // Cambiar de página cierra los menús (ajuste de estado durante el render, sin efecto).
  if (rutaVista !== pathname) {
    setRutaVista(pathname);
    setMovilAbierto(false);
    setGrupoAbierto(null);
  }
  const cerrarTodo = () => {
    setMovilAbierto(false);
    setGrupoAbierto(null);
  };

  // Desplegables de escritorio: Escape devuelve el foco a su botón; un clic fuera los cierra.
  useEffect(() => {
    if (!grupoAbierto) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setGrupoAbierto(null);
      navRef.current
        ?.querySelector<HTMLButtonElement>(`button[data-grupo="${grupoAbierto}"]`)
        ?.focus();
    };
    const alTocar = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setGrupoAbierto(null);
    };
    window.addEventListener('keydown', alTeclear);
    document.addEventListener('pointerdown', alTocar);
    return () => {
      window.removeEventListener('keydown', alTeclear);
      document.removeEventListener('pointerdown', alTocar);
    };
  }, [grupoAbierto]);

  // Menú del celular: foco al primer enlace, Escape cierra, Tab da la vuelta dentro del menú,
  // la página de atrás no se desplaza y, si la ventana crece a escritorio, se cierra solo.
  useEffect(() => {
    if (!movilAbierto) return;
    const enfocables = () => [
      ...(botonMovil.current ? [botonMovil.current] : []),
      ...(panelMovil.current?.querySelectorAll<HTMLElement>(ENFOCABLES) ?? []),
    ];
    enfocables()[1]?.focus();
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMovilAbierto(false);
        botonMovil.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const lista = enfocables();
      const primero = lista[0];
      const ultimo = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo?.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero?.focus();
      }
    };
    const escritorio = window.matchMedia('(min-width: 64rem)');
    const alCrecer = () => escritorio.matches && setMovilAbierto(false);
    window.addEventListener('keydown', alTeclear);
    escritorio.addEventListener('change', alCrecer);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', alTeclear);
      escritorio.removeEventListener('change', alCrecer);
      document.body.style.overflow = '';
    };
  }, [movilAbierto]);

  return (
    <>
      <div onClickCapture={cerrarTodo} className="mr-auto flex min-w-0">
        {logo}
      </div>

      <nav ref={navRef} aria-label="Principal" className="hidden lg:block">
        <ul className="flex items-center gap-[clamp(0.25rem,1.2vw,1.5rem)]">
          {menu.map((grupo, i) => {
            const abierto = grupoAbierto === grupo.title;
            const activo = grupo.items.some((item) => esActual(pathname, item.href));
            const panelId = `calida-grupo-${i}`;
            return (
              <li
                key={grupo.title}
                className="relative"
                onPointerEnter={(e) => e.pointerType === 'mouse' && setGrupoAbierto(grupo.title)}
                onPointerLeave={(e) => e.pointerType === 'mouse' && setGrupoAbierto(null)}
              >
                <button
                  type="button"
                  data-grupo={grupo.title}
                  aria-expanded={abierto}
                  aria-controls={panelId}
                  onPointerDown={(e) => {
                    ultimoPuntero.current = e.pointerType;
                  }}
                  onClick={() => {
                    // Mouse: solo abre (cerrar es salir con el mouse). Teclado o táctil: alterna.
                    const mouse = ultimoPuntero.current === 'mouse';
                    ultimoPuntero.current = null;
                    setGrupoAbierto(mouse || !abierto ? grupo.title : null);
                  }}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[0.95rem] font-medium text-ink transition-colors hover:text-accent-strong"
                >
                  <span
                    className={`decoration-accent decoration-2 underline-offset-8 ${activo ? 'underline' : ''}`}
                  >
                    {grupo.title}
                  </span>
                  <Icon
                    name="chevronDown"
                    className={`size-4 transition-transform motion-safe:duration-200 ${abierto ? 'rotate-180' : ''}`}
                  />
                </button>
                {/* El relleno superior mantiene el mouse dentro mientras baja al panel. */}
                <div id={panelId} hidden={!abierto} className="absolute top-full left-0 pt-3">
                  <ul className="w-[21rem] rounded-2xl bg-surface p-2 shadow-pop ring-1 ring-line motion-safe:animate-toast-in">
                    {grupo.items.map((item) => {
                      const actual = esActual(pathname, item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={cerrarTodo}
                            aria-current={actual ? 'page' : undefined}
                            className={`group/item flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-sunken ${actual ? 'bg-sunken' : ''}`}
                          >
                            <span className="flex min-w-0 flex-1 flex-col">
                              <span className="font-display text-lg text-ink">{item.label}</span>
                              {item.description && (
                                <span className="text-sm text-ink-soft">{item.description}</span>
                              )}
                            </span>
                            <Icon
                              name="arrowRight"
                              className="size-4 text-accent-strong opacity-0 transition group-hover/item:opacity-100"
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
          {links.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-flex min-h-11 items-center rounded-full px-3 text-[0.95rem] font-medium text-ink transition-colors hover:text-accent-strong"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hidden lg:ml-[clamp(0.5rem,1.5vw,1.75rem)] lg:block">
        <Link href="/soy-nuevo" className={botonCalida('naranja', 'encabezado')}>
          Planifica tu visita
          <Icon name="chevronRight" className="size-4" />
        </Link>
      </div>

      <button
        ref={botonMovil}
        type="button"
        className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-sunken lg:hidden"
        aria-expanded={movilAbierto}
        aria-controls="calida-menu-movil"
        onClick={() => setMovilAbierto((v) => !v)}
      >
        <Icon name={movilAbierto ? 'close' : 'menu'} className="size-7" />
        <span className="sr-only">{movilAbierto ? 'Cerrar menú' : 'Abrir menú'}</span>
      </button>

      {/* Absoluto bajo el encabezado (no `fixed`): el desenfoque del encabezado lo vuelve el
          contenedor de los elementos fijos y el menú quedaría encerrado en su alto. */}
      <div
        ref={panelMovil}
        id="calida-menu-movil"
        hidden={!movilAbierto}
        className="absolute inset-x-0 top-full h-[calc(100dvh-3.75rem)] overflow-y-auto overscroll-contain border-t border-line bg-canvas lg:hidden"
      >
        <nav
          aria-label="Principal (menú)"
          className="mx-auto flex max-w-[48rem] flex-col gap-8 px-[clamp(1rem,4vw,2.5rem)] py-7"
        >
          {menu.map((grupo) => (
            <div key={grupo.title} className="flex flex-col gap-1">
              <Etiqueta className="text-accent-strong">{grupo.title}</Etiqueta>
              <ul className="grid gap-x-8 md:grid-cols-2">
                {grupo.items.map((item) => {
                  const actual = esActual(pathname, item.href);
                  return (
                    <li key={item.href} className="border-b border-line">
                      <Link
                        href={item.href}
                        onClick={cerrarTodo}
                        aria-current={actual ? 'page' : undefined}
                        className="flex min-h-14 items-center justify-between gap-3 py-2"
                      >
                        <span className="flex flex-col">
                          <span
                            className={`font-display text-[clamp(1.5rem,1.3rem+1vw,1.875rem)] leading-tight ${actual ? 'text-accent-strong' : 'text-ink'}`}
                          >
                            {item.label}
                          </span>
                          {item.description && (
                            <span className="text-sm text-ink-soft">{item.description}</span>
                          )}
                        </span>
                        <Icon name="arrowRight" className="size-5 shrink-0 text-accent-strong" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="flex flex-wrap gap-3">
            <Link href="/soy-nuevo" onClick={cerrarTodo} className={botonCalida('naranja')}>
              Planifica tu visita
              <Icon name="arrowRight" className="size-5" />
            </Link>
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={cerrarTodo}
                className={botonCalida('contorno')}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
