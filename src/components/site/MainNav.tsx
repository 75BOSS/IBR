'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import { buttonClasses } from '@/components/button-styles';
import { Icon } from '@/components/Icon';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { PUBLIC_NAV, isActivePath } from '@/lib/nav';

/**
 * Navegación principal: lista en escritorio, menú desplegable en celular y tablet. Recibe el
 * logo para cerrar el menú también cuando se toca (aunque se quede en la misma ruta).
 */
export function MainNav({ whatsapp, logo }: { whatsapp: string | null; logo: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  // Ajuste de estado durante el render (patrón de React): cambiar de ruta cierra el menú, y
  // volver atrás a la ruta donde se abrió no lo reabre.
  if (openedAt !== pathname) {
    setOpenedAt(pathname);
    setOpen(false);
  }
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const links = PUBLIC_NAV.filter((item) => item.href !== '/soy-nuevo');

  return (
    <>
      <div onClickCapture={close} className="mr-auto flex min-w-0">
        {logo}
      </div>

      <nav aria-label="Principal" className="hidden lg:block">
        <ul className="flex items-center gap-1 xl:gap-2">
          {links.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-lg px-3 py-2 font-semibold transition-colors hover:bg-brand-soft hover:text-brand-strong ${
                    active
                      ? 'text-brand-strong underline decoration-accent decoration-2 underline-offset-8'
                      : 'text-ink-soft'
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
        href="/soy-nuevo"
        onClick={close}
        aria-current={isActivePath(pathname, '/soy-nuevo') ? 'page' : undefined}
        className={buttonClasses({
          variant: 'accent',
          size: 'sm',
          className: 'md:min-h-11 md:px-4 md:text-[0.95rem]',
        })}
      >
        Soy nuevo
      </Link>

      <button
        type="button"
        className="grid size-11 place-items-center rounded-xl text-brand-strong hover:bg-brand-soft lg:hidden"
        aria-expanded={open}
        aria-controls="menu-principal"
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name={open ? 'close' : 'menu'} className="size-6" />
        <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
      </button>

      <div
        id="menu-principal"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-surface shadow-pop lg:hidden"
      >
        <nav aria-label="Principal (menú)" className="container-page py-3">
          <ul className="divide-y divide-line/60">
            {PUBLIC_NAV.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-13 items-center justify-between py-3 text-lg font-semibold ${
                      active ? 'text-accent-strong' : 'text-ink'
                    }`}
                  >
                    {item.label}
                    <Icon name="chevronRight" className="size-5 text-ink-soft" />
                  </Link>
                </li>
              );
            })}
          </ul>
          <WhatsAppButton
            number={whatsapp}
            message="Hola, les escribo desde la página web."
            className="mt-3 w-full"
          />
        </nav>
      </div>
    </>
  );
}
