'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { buttonClasses } from '@/components/button-styles';
import { Icon } from '@/components/Icon';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { MENU_LINKS, PUBLIC_MENU, isActivePath } from '@/lib/nav';

/**
 * Navegación principal. En escritorio: un desplegable por grupo (Conócenos, Conéctate,
 * Recursos) que se abre con clic, teclado o al pasar el mouse. En celular y tablet: menú a
 * pantalla completa con los mismos grupos. Recibe el logo para cerrar el menú también cuando se
 * toca (aunque se quede en la misma ruta).
 */
export function MainNav({ whatsapp, logo }: { whatsapp: string | null; logo: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [seenPath, setSeenPath] = useState(pathname);
  const navRef = useRef<HTMLElement>(null);
  // Ajuste de estado durante el render (patrón de React): cambiar de ruta cierra los menús, y
  // volver atrás a la ruta donde se abrieron no los reabre.
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setMobileOpen(false);
    setOpenGroup(null);
  }
  const closeAll = () => {
    setMobileOpen(false);
    setOpenGroup(null);
  };

  useEffect(() => {
    if (!mobileOpen && !openGroup) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAll();
    };
    // Un clic fuera del desplegable lo cierra (el menú del celular cubre la pantalla).
    const onPointer = (event: PointerEvent) => {
      if (openGroup && !navRef.current?.contains(event.target as Node)) setOpenGroup(null);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    // Con el menú del celular abierto, la página de atrás no se desplaza.
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      document.body.style.overflow = '';
    };
  }, [mobileOpen, openGroup]);

  return (
    <>
      <div onClickCapture={closeAll} className="mr-auto flex min-w-0">
        {logo}
      </div>

      <nav ref={navRef} aria-label="Principal" className="hidden lg:block">
        <ul className="flex items-center gap-1">
          {PUBLIC_MENU.map((group) => {
            const open = openGroup === group.title;
            const active = group.items.some((item) => isActivePath(pathname, item.href));
            const panelId = `menu-${group.title.toLowerCase()}`;
            return (
              <li
                key={group.title}
                className="relative"
                onPointerEnter={(e) => e.pointerType === 'mouse' && setOpenGroup(group.title)}
                onPointerLeave={(e) => e.pointerType === 'mouse' && setOpenGroup(null)}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenGroup(open ? null : group.title)}
                  className={`group inline-flex min-h-11 items-center gap-1 rounded-full px-4 font-semibold transition-colors hover:bg-sunken ${
                    active ? 'text-brand-strong' : 'text-ink'
                  }`}
                >
                  <span
                    className={`decoration-accent decoration-2 underline-offset-8 ${
                      active ? 'underline' : ''
                    }`}
                  >
                    {group.title}
                  </span>
                  <Icon
                    name="chevronDown"
                    className={`size-4 text-ink-soft transition-transform motion-safe:duration-200 ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {/* El relleno superior mantiene el mouse dentro mientras baja al panel. */}
                <div id={panelId} hidden={!open} className="absolute top-full left-0 pt-3">
                  <ul className="w-[22rem] rounded-2xl bg-surface p-2 shadow-pop ring-1 ring-line/70 motion-safe:animate-toast-in">
                    {group.items.map((item) => {
                      const current = isActivePath(pathname, item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={closeAll}
                            aria-current={current ? 'page' : undefined}
                            className={`group/item flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-sunken ${
                              current ? 'bg-sunken' : ''
                            }`}
                          >
                            <span className="flex min-w-0 flex-1 flex-col">
                              <span className="font-display text-lg font-medium text-ink group-hover/item:text-brand-strong">
                                {item.label}
                              </span>
                              <span className="text-sm text-ink-soft">{item.description}</span>
                            </span>
                            <Icon
                              name="arrowRight"
                              className="size-4 text-accent-strong opacity-0 transition group-hover/item:translate-x-0 group-hover/item:opacity-100 motion-safe:-translate-x-1"
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
          {MENU_LINKS.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex min-h-11 items-center rounded-full px-4 font-semibold transition-colors hover:bg-sunken ${
                    active
                      ? 'text-brand-strong underline decoration-accent decoration-2 underline-offset-8'
                      : 'text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Link
        href="/mi-cuenta"
        className="hidden size-11 place-items-center rounded-full text-ink-soft transition-colors hover:bg-sunken hover:text-brand-strong lg:grid"
        aria-current={isActivePath(pathname, '/mi-cuenta') ? 'page' : undefined}
      >
        <Icon name="user" className="size-5" />
        <span className="sr-only">Mi cuenta</span>
      </Link>

      <Link
        href="/soy-nuevo"
        onClick={closeAll}
        aria-current={isActivePath(pathname, '/soy-nuevo') ? 'page' : undefined}
        className={buttonClasses({
          variant: 'accent',
          size: 'sm',
          shape: 'pill',
          className: 'md:min-h-11 md:px-5 md:text-[0.95rem]',
        })}
      >
        Soy nuevo
      </Link>

      <button
        type="button"
        className="grid size-11 place-items-center rounded-full text-brand-strong hover:bg-sunken lg:hidden"
        aria-expanded={mobileOpen}
        aria-controls="menu-movil"
        onClick={() => setMobileOpen((value) => !value)}
      >
        <Icon name={mobileOpen ? 'close' : 'menu'} className="size-6" />
        <span className="sr-only">{mobileOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
      </button>

      {/* Absoluto bajo el encabezado (no `fixed`): el desenfoque del header convierte al header en
          el contenedor de los elementos fijos y el menú quedaría encerrado en sus 64 px. */}
      <div
        id="menu-movil"
        hidden={!mobileOpen}
        className="absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain bg-canvas md:h-[calc(100dvh-4.5rem)] lg:hidden"
      >
        <nav aria-label="Principal (menú)" className="container-page flex flex-col gap-8 py-6">
          {PUBLIC_MENU.map((group) => (
            <div key={group.title} className="flex flex-col gap-2">
              <p className="eyebrow text-accent-strong">{group.title}</p>
              <ul className="grid gap-x-6 md:grid-cols-2">
                {group.items.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <li key={item.href} className="border-b border-line/70">
                      <Link
                        href={item.href}
                        onClick={closeAll}
                        aria-current={active ? 'page' : undefined}
                        className="flex min-h-14 items-center justify-between gap-3 py-2"
                      >
                        <span className="flex flex-col">
                          <span
                            className={`font-display text-[clamp(1.375rem,1.1rem+1.2vw,1.75rem)] leading-tight ${
                              active ? 'text-accent-strong italic' : 'text-ink'
                            }`}
                          >
                            {item.label}
                          </span>
                          <span className="text-sm text-ink-soft">{item.description}</span>
                        </span>
                        <Icon name="arrowRight" className="size-5 shrink-0 text-ink-soft" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="grid gap-3 xs:grid-cols-2">
            {MENU_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeAll}
                className={buttonClasses({ variant: 'primary', size: 'lg' })}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/mi-cuenta"
              onClick={closeAll}
              className={buttonClasses({ variant: 'secondary', size: 'lg' })}
            >
              <Icon name="user" className="size-5" /> Mi cuenta
            </Link>
          </div>
          <WhatsAppButton
            number={whatsapp}
            message="Hola, les escribo desde la página web."
            className="w-full"
          />
        </nav>
      </div>
    </>
  );
}
