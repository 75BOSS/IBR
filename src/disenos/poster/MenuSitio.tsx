'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import { botonPoster } from './botones';
import { LogoPoster } from './LogoPoster';
import type { MenuPoster } from './menu';
import { MenuGrupos } from './MenuGrupos';

/**
 * Menú del celular y la tablet (hamburguesa): Inicio, los grupos del menú en acordeón, Oración,
 * Dar y «Planifica tu visita», en un `<dialog>` modal: el navegador encierra el foco, Escape lo
 * cierra y la página de atrás queda inerte. Al cerrar, el foco vuelve al botón que lo abrió.
 * Sin JavaScript, el pie lleva los mismos enlaces.
 */
export function MenuSitio({ nombre, menu }: { nombre: string; menu: MenuPoster }) {
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

  return (
    <>
      <button
        ref={boton}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={abierto}
        aria-controls={id}
        onClick={() => setAbierto(true)}
        className="grid size-12 place-items-center rounded-md text-ink"
      >
        <Icon name="menu" strokeWidth={2.75} className="size-9" />
        <span className="sr-only">Abrir menú</span>
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
            <MenuGrupos menu={menu} variante="dialogo" />
            <Link href={menu.visita.href} className={botonPoster('rojo', 'w-full justify-between')}>
              {menu.visita.etiqueta}
              <Icon name="arrowRight" className="d-flecha size-[1.1em]" />
            </Link>
          </nav>
        </div>
      </dialog>
    </>
  );
}
