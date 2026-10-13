'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import type { PublicNavGroup, PublicNavItem } from '@/lib/nav';
import { RUTA_COMUNIDAD, RUTA_INICIO, esActual } from './enlaces';
import { LogoPoster } from './LogoPoster';

/**
 * Menú con todo el sitio (grupos Conócenos · Conéctate · Recursos y los enlaces sueltos), en un
 * `<dialog>` modal: el navegador encierra el foco, Escape lo cierra y la página de atrás queda
 * inerte. Al cerrar, el foco vuelve al botón que lo abrió. Se abre con la hamburguesa del
 * celular o con «Todo el sitio» del menú lateral. Sin JavaScript, el pie lleva los mismos
 * enlaces.
 */
export function MenuSitio({
  nombre,
  menu,
  links,
  variante,
}: {
  nombre: string;
  menu: PublicNavGroup[];
  links: PublicNavItem[];
  variante: 'hamburguesa' | 'lateral';
}) {
  const pathname = usePathname();
  const dialogo = useRef<HTMLDialogElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const cerrar = useRef<HTMLButtonElement>(null);
  const [abierto, setAbierto] = useState(false);
  const [rutaVista, setRutaVista] = useState(pathname);
  const id = useId();
  const tituloId = `${id}-titulo`;

  // Cambiar de página cierra el menú (ajuste durante el render; el efecto cierra el diálogo).
  if (rutaVista !== pathname) {
    setRutaVista(pathname);
    setAbierto(false);
  }

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    // Al abrir, el foco va a «Cerrar» (si no, el navegador lo pone en el logo).
    if (abierto && !d.open) {
      d.showModal();
      cerrar.current?.focus();
    }
    if (!abierto && d.open) d.close();
  }, [abierto]);

  const principales = [
    { href: RUTA_INICIO, label: 'Inicio' },
    { href: RUTA_COMUNIDAD, label: 'Comunidad' },
  ];

  return (
    <>
      <button
        ref={boton}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={abierto}
        aria-controls={id}
        onClick={() => setAbierto(true)}
        className={
          variante === 'hamburguesa'
            ? 'grid size-12 place-items-center rounded-md text-ink'
            : 'flex min-h-11 items-center gap-[clamp(0.875rem,1.5vw,1.5rem)] pr-3 pl-[clamp(1.25rem,1.9vw,1.875rem)] text-[clamp(0.9375rem,0.82rem+0.2vw,1.0625rem)] text-ink-soft transition-colors hover:text-accent'
        }
      >
        <Icon
          name="menu"
          strokeWidth={variante === 'hamburguesa' ? 2.75 : 2}
          className={variante === 'hamburguesa' ? 'size-9' : 'size-[1.4rem]'}
        />
        {variante === 'hamburguesa' ? <span className="sr-only">Abrir menú</span> : 'Todo el sitio'}
      </button>

      <dialog
        ref={dialogo}
        id={id}
        aria-labelledby={tituloId}
        onClose={() => {
          setAbierto(false);
          boton.current?.focus();
        }}
        // Un toque en el velo (fuera del panel) también cierra.
        onClick={(e) => e.target === e.currentTarget && setAbierto(false)}
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-canvas p-0 text-ink backdrop:bg-(--d-velo) motion-safe:animate-dialog-in lg:w-[min(32rem,100%)] lg:border-r-2 lg:border-ink"
      >
        <div className="flex min-h-full flex-col gap-[clamp(1.5rem,4vw,2.5rem)] px-[clamp(1rem,5vw,2.5rem)] pt-4 pb-10">
          <div className="flex items-center justify-between gap-4 border-b-2 border-ink pb-4">
            <LogoPoster nombre={nombre} colorSello="text-ink" className="text-[1.25rem]" />
            <button
              ref={cerrar}
              type="button"
              onClick={() => setAbierto(false)}
              className="flex min-h-11 items-center gap-2 rounded-md px-2 font-display font-bold tracking-[0.2em] text-ink uppercase"
            >
              Cerrar
              <Icon name="close" strokeWidth={2.75} className="size-7" />
            </button>
          </div>
          <h2 id={tituloId} className="sr-only">
            Menú del sitio
          </h2>
          <nav aria-labelledby={tituloId} className="flex flex-col gap-[clamp(1.5rem,4vw,2.25rem)]">
            <ul className="flex flex-col">
              {principales.map((p) => (
                <li key={p.href} className="border-b border-ink/25">
                  <EnlaceMenu item={p} actual={esActual(pathname, p.href)} grande />
                </li>
              ))}
            </ul>
            {menu.map((grupo) => (
              <div key={grupo.title} className="flex flex-col gap-1">
                <p className="font-display text-[0.8125rem] font-bold tracking-[0.36em] text-accent uppercase">
                  {grupo.title}
                </p>
                <ul className="flex flex-col">
                  {grupo.items.map((item) => (
                    <li key={item.href} className="border-b border-ink/25">
                      <EnlaceMenu item={item} actual={esActual(pathname, item.href)} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {links.length > 0 && (
              <ul className="flex flex-col">
                {links.map((item) => (
                  <li key={item.href} className="border-b border-ink/25">
                    <EnlaceMenu item={item} actual={esActual(pathname, item.href)} />
                  </li>
                ))}
              </ul>
            )}
          </nav>
        </div>
      </dialog>
    </>
  );
}

function EnlaceMenu({
  item,
  actual,
  grande = false,
}: {
  item: PublicNavItem;
  actual: boolean;
  grande?: boolean;
}) {
  return (
    <Link
      href={item.href}
      aria-current={actual ? 'page' : undefined}
      className="group flex min-h-14 items-center justify-between gap-4 py-2"
    >
      <span className="flex flex-col">
        <span
          className={`font-display leading-none font-extrabold tracking-[-0.01em] uppercase group-hover:text-accent ${
            grande
              ? 'text-[clamp(2rem,1.5rem+2.5vw,2.75rem)] font-black'
              : 'text-[clamp(1.375rem,1.15rem+1vw,1.75rem)] font-stretch-[80%]'
          } ${actual ? 'text-accent' : 'text-ink'}`}
        >
          {item.label}
        </span>
        {item.description && <span className="text-sm text-ink-soft">{item.description}</span>}
      </span>
      <Icon
        name="arrowRight"
        className="size-5 shrink-0 text-ink transition-transform group-hover:text-accent motion-safe:group-hover:translate-x-1"
      />
    </Link>
  );
}
