'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type FocusEvent, type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import { botonClases } from '@/disenos/vibrante/boton';
import { Contenedor } from '@/disenos/vibrante/Contenedor';
import { Foto } from '@/disenos/vibrante/Foto';
import { type GrupoMenu, esPaginaActual } from '@/disenos/vibrante/menu';
import type { PublicNavItem } from '@/lib/nav';

/**
 * Navegación de la propuesta Vibrante.
 *
 * Escritorio (desde 1024): un menú desplegable por grupo, como el de caminodevida: un panel negro
 * a todo lo ancho baja del encabezado con los enlaces en crema y el que está bajo el cursor en
 * rojo. Se abre al pasar el cursor (solo con mouse) y con clic o teclado (Enter / Espacio); el
 * panel es parte del mismo elemento que el botón, así que llevar el cursor hacia él no lo cierra.
 * Escape cierra y devuelve el foco al botón; un clic fuera, sacar el foco del menú o cambiar de
 * página también cierran. Clic sobre un grupo abierto por el cursor lo deja fijo.
 *
 * Celular y tablet: menú rojo a pantalla completa con los grupos en acordeón.
 *
 * Todo es `<details>`: sin JavaScript, los menús igual se abren y cierran con clic.
 */
export function Navegacion({
  logo,
  grupos,
  sueltos,
  visita,
}: {
  logo: ReactNode;
  grupos: GrupoMenu[];
  sueltos: PublicNavItem[];
  /** «Planifica tu visita»: la página Primera visita de la propuesta. */
  visita: string;
}) {
  const pathname = usePathname();
  const idBase = useId();
  const [grupo, setGrupo] = useState<string | null>(null);
  const [movil, setMovil] = useState(false);
  const [rutaVista, setRutaVista] = useState(pathname);
  const escritorio = useRef<HTMLElement>(null);
  const botonMovil = useRef<HTMLElement>(null);
  const disparadores = useRef<Record<string, HTMLElement | null>>({});
  /** El grupo abierto se abrió al pasar el cursor (y se cierra al sacarlo). */
  const porCursor = useRef(false);

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
      else if (grupo) disparadores.current[grupo]?.focus();
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

  // Con Tab fuera del menú, el panel se cierra (sin destino = clic en la página: lo cierra
  // `alTocar`).
  const alPerderFoco = (e: FocusEvent<HTMLElement>) => {
    const destino = e.relatedTarget as Node | null;
    if (destino && !e.currentTarget.contains(destino)) setGrupo(null);
  };

  return (
    <>
      <div onClickCapture={cerrar} className="mr-auto flex min-w-0">
        {logo}
      </div>

      <nav
        ref={escritorio}
        aria-label="Principal"
        onBlur={alPerderFoco}
        className="hidden self-stretch lg:flex"
      >
        <ul className="flex items-stretch">
          {grupos.map((g, i) => {
            const abierto = grupo === g.titulo;
            const activo = g.items.some((item) => esPaginaActual(pathname, item.href));
            const panelId = `${idBase}-panel-${i}`;
            return (
              <li
                key={g.titulo}
                className="flex items-center"
                onPointerEnter={(e) => {
                  if (e.pointerType !== 'mouse' || abierto) return;
                  porCursor.current = true;
                  setGrupo(g.titulo);
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType === 'mouse' && abierto && porCursor.current) setGrupo(null);
                }}
              >
                <details
                  open={abierto}
                  onToggle={(e) => {
                    const ahora = e.currentTarget.open;
                    setGrupo((actual) => (ahora ? g.titulo : actual === g.titulo ? null : actual));
                  }}
                  className="group"
                >
                  <summary
                    ref={(el) => {
                      disparadores.current[g.titulo] = el;
                    }}
                    aria-expanded={abierto}
                    aria-controls={panelId}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!abierto) {
                        porCursor.current = false;
                        setGrupo(g.titulo);
                      } else if (porCursor.current) {
                        porCursor.current = false;
                      } else {
                        setGrupo(null);
                      }
                    }}
                    className={`flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-[0.3rem] px-[clamp(0.5rem,0.9vw,0.875rem)] font-semibold whitespace-nowrap transition-colors group-open:bg-sunken hover:bg-sunken [&::-webkit-details-marker]:hidden ${
                      activo ? 'text-accent' : 'text-ink'
                    }`}
                  >
                    {g.titulo}
                    <Icon
                      name="chevronDown"
                      className="size-4 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <div
                    id={panelId}
                    className="vibrante-panel absolute inset-x-0 top-full z-50 hidden border-t-4 border-accent bg-(--d-negro-hondo) text-canvas shadow-pop on-dark group-open:block"
                  >
                    <PanelGrupo
                      grupo={g}
                      sueltos={sueltos}
                      visita={visita}
                      pathname={pathname}
                      alElegir={cerrar}
                    />
                  </div>
                </details>
              </li>
            );
          })}
          {sueltos.map((item) => (
            <li key={item.href} className="hidden items-center xl:flex">
              <Link
                href={item.href}
                aria-current={esPaginaActual(pathname, item.href) ? 'page' : undefined}
                className="flex min-h-11 items-center rounded-[0.3rem] px-[clamp(0.5rem,0.9vw,0.875rem)] font-semibold text-ink transition-colors hover:bg-sunken aria-[current=page]:text-accent"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Link
        href={visita}
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
            className="mx-auto flex w-full max-w-[48rem] flex-col gap-8 px-[clamp(1rem,3.9vw,3.75rem)] pt-4 pb-28"
          >
            <div className="flex flex-col">
              {grupos.map((g) => (
                <details key={g.titulo} className="group/acordeon border-b border-canvas/30">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 py-2 [&::-webkit-details-marker]:hidden">
                    <span className="font-display text-[clamp(1.75rem,1.3rem+2vw,2.5rem)] leading-tight font-black tracking-[-0.03em]">
                      {g.titulo}
                    </span>
                    <Icon
                      name="plus"
                      className="size-7 shrink-0 transition-transform group-open/acordeon:rotate-45"
                    />
                  </summary>
                  <ul className="grid gap-x-8 pb-4 md:grid-cols-2">
                    {g.items.map((item) => {
                      const actual = esPaginaActual(pathname, item.href);
                      return (
                        <li key={item.href} className="border-t border-canvas/20">
                          <Link
                            href={item.href}
                            onClick={cerrar}
                            aria-current={actual ? 'page' : undefined}
                            className="flex min-h-14 items-center justify-between gap-3 py-2"
                          >
                            <span className="flex min-w-0 flex-col">
                              <span
                                className={`text-xl leading-tight font-bold ${
                                  actual ? 'underline decoration-2 underline-offset-4' : ''
                                }`}
                              >
                                {item.label}
                              </span>
                              <span className="text-sm">{item.description}</span>
                            </span>
                            <Icon name="arrowRight" className="size-5 shrink-0" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              ))}
              {sueltos.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={cerrar}
                  className="flex min-h-16 items-center justify-between gap-3 border-b border-canvas/30 py-2"
                >
                  <span className="font-display text-[clamp(1.75rem,1.3rem+2vw,2.5rem)] leading-tight font-black tracking-[-0.03em]">
                    {item.label}
                  </span>
                  <Icon name="arrowRight" className="size-7 shrink-0" />
                </Link>
              ))}
            </div>
            <Link
              href={visita}
              onClick={cerrar}
              className={botonClases({ variante: 'crema', tamano: 'lg' })}
            >
              Planifica tu visita <Icon name="arrowRight" className="size-5" />
            </Link>
          </nav>
        </div>
      </details>
    </>
  );
}

/** Contenido del panel negro de un grupo: frase, enlaces y foto; abajo, accesos sueltos. */
function PanelGrupo({
  grupo,
  sueltos,
  visita,
  pathname,
  alElegir,
}: {
  grupo: GrupoMenu;
  sueltos: PublicNavItem[];
  visita: string;
  pathname: string;
  alElegir: () => void;
}) {
  return (
    <>
      <Contenedor
        ancho="recogido"
        className="grid grid-cols-[minmax(0,4fr)_minmax(0,7fr)_minmax(0,3fr)] gap-[clamp(1.5rem,3vw,3.5rem)] py-[clamp(1.75rem,3vw,2.75rem)]"
      >
        <div className="@container flex flex-col gap-4">
          <p className="eyebrow text-(--d-rojo-vivo)">{grupo.titulo}</p>
          <p className="font-display text-[clamp(1.625rem,12cqi,2.75rem)] leading-[0.98] font-black tracking-[-0.04em] text-balance">
            {grupo.frase}
          </p>
        </div>
        <ul className="grid content-start gap-x-[clamp(1rem,2.5vw,2.5rem)] xl:grid-cols-2">
          {grupo.items.map((item) => {
            const actual = esPaginaActual(pathname, item.href);
            return (
              <li key={item.href} className="vibrante-panel-item border-t border-canvas/15">
                <Link
                  href={item.href}
                  onClick={alElegir}
                  aria-current={actual ? 'page' : undefined}
                  className="group/item relative flex items-center gap-3 py-3 pl-0 transition-[padding] duration-300 ease-out-soft hover:pl-4 focus-visible:pl-4"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-3 left-0 w-1 origin-left scale-x-0 bg-(--d-rojo-vivo) transition-transform duration-300 group-hover/item:scale-x-100 group-focus-visible/item:scale-x-100"
                  />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span
                      className={`font-display text-[clamp(1.25rem,1.5vw,1.625rem)] leading-tight font-black tracking-[-0.03em] transition-colors group-hover/item:text-(--d-rojo-vivo) group-focus-visible/item:text-(--d-rojo-vivo) ${
                        actual ? 'underline decoration-2 underline-offset-4' : ''
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="text-sm text-(--d-crema-tenue)">{item.description}</span>
                  </span>
                  <Icon
                    name="arrowRight"
                    className="size-5 text-(--d-rojo-vivo) opacity-0 transition group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-visible/item:opacity-100 motion-safe:-translate-x-2"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
        <Foto
          foto={grupo.foto}
          decorativa
          zoom
          cursor={null}
          sizes="20vw"
          className="group aspect-[4/5] self-start rounded-[0.5rem]"
        />
      </Contenedor>
      <div className="border-t border-canvas/15">
        <Contenedor
          ancho="recogido"
          className="flex flex-wrap items-center gap-x-6 gap-y-1 py-2 text-sm"
        >
          <span className="caps text-(--d-crema-tenue)">También</span>
          {[...sueltos, { href: '/contacto', label: 'Contacto' }].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={alElegir}
              className="inline-flex min-h-11 items-center font-semibold hover:text-(--d-rojo-vivo) hover:underline"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={visita}
            onClick={alElegir}
            className="ml-auto inline-flex min-h-11 items-center gap-2 font-bold text-(--d-rojo-vivo) hover:underline"
          >
            Planifica tu visita <Icon name="arrowRight" className="size-4" />
          </Link>
        </Contenedor>
      </div>
    </>
  );
}
