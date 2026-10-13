'use client';

import Link from 'next/link';
import { type MouseEvent, useRef, useState } from 'react';
import { Icon, type IconName } from '@/components/Icon';
import type { PublicNavGroup, PublicNavItem } from '@/lib/nav';
import { FLECHA, claseBoton } from './estilos';
import { Logo } from './Logo';
import { Redes } from './Redes';
import { PRIMERA_VISITA } from './rutas';

/**
 * Menú del celular y la tablet (botón de tres rayas a la izquierda, imagen 12). Es un diálogo
 * modal nativo: el foco entra al menú y no se escapa a la página de atrás, Escape lo cierra y el
 * foco vuelve al botón que lo abrió. Tocar cualquier enlace también lo cierra.
 */
export function MenuCelular({
  menu,
  links,
  redes,
  tono,
}: {
  menu: PublicNavGroup[];
  links: PublicNavItem[];
  redes: { label: string; icon: IconName; href: string }[];
  /** Color del botón: crema sobre la foto de la portada, azul marino en el encabezado claro. */
  tono: 'oscuro' | 'claro';
}) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [abierto, setAbierto] = useState(false);

  const abrir = () => {
    dialogo.current?.showModal();
    setAbierto(true);
  };
  const cerrar = () => dialogo.current?.close();
  const alTocarEnlace = (e: MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest('a')) cerrar();
  };

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={abierto}
        aria-controls="menu-escenario"
        onClick={abrir}
        className={`-ml-2.5 grid size-11 place-items-center rounded-full transition-colors ${
          tono === 'oscuro' ? 'text-cream hover:bg-cream/15' : 'text-ink hover:bg-sunken'
        }`}
      >
        <Icon name="menu" className="size-7" />
        <span className="sr-only">Abrir menú</span>
      </button>

      <dialog
        id="menu-escenario"
        ref={dialogo}
        aria-label="Menú"
        onClose={() => setAbierto(false)}
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-(--d-marino) p-0 text-cream on-dark backdrop:bg-transparent motion-safe:open:animate-dialog-in"
      >
        <div className="container-page grid h-16 grid-cols-[1fr_auto_1fr] items-center">
          <button
            type="button"
            onClick={cerrar}
            autoFocus
            className="-ml-2.5 grid size-11 place-items-center rounded-full text-cream transition-colors hover:bg-cream/15"
          >
            <Icon name="close" className="size-7" />
            <span className="sr-only">Cerrar menú</span>
          </button>
          <Logo tono="crema" alto="h-9" />
        </div>

        {/* Un div y no otro <nav>: el diálogo ya está dentro de la navegación del encabezado. */}
        <div onClick={alTocarEnlace} className="container-page flex flex-col gap-8 pt-4 pb-10">
          {menu.map((grupo) => (
            <div key={grupo.title} className="flex flex-col gap-1">
              <p className="caps text-cream/70">{grupo.title}</p>
              <ul className="grid gap-x-8 md:grid-cols-2">
                {grupo.items.map((item) => (
                  <li key={item.href} className="border-b border-cream/15">
                    <Link
                      href={item.href}
                      className="flex min-h-14 items-center justify-between gap-3 py-2.5"
                    >
                      <span className="flex flex-col">
                        <span className="font-display text-[clamp(1.375rem,1.15rem+1vw,1.75rem)] leading-tight font-bold">
                          {item.label}
                        </span>
                        {item.description && (
                          <span className="text-sm text-cream/75">{item.description}</span>
                        )}
                      </span>
                      <Icon name="arrowRight" className="size-5 shrink-0 text-cream/70" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-wrap gap-3">
            <Link href={PRIMERA_VISITA} className={claseBoton('rojo')}>
              Planifica tu visita
              <Icon name="arrowRight" className={FLECHA} />
            </Link>
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-12 items-center rounded-full px-6 font-display font-bold ring-1 ring-cream/40 transition-colors hover:bg-cream/10"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Redes redes={redes} />
        </div>
      </dialog>
    </>
  );
}
