'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  type PointerEvent as EventoPuntero,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Icon } from '@/components/Icon';
import { botonCalida } from './botones';
import type { MenuCalida } from './textos';

/** ¿El enlace es la página actual? Las anclas (#adn…) nunca lo son; el inicio solo exacto. */
function esActual(pathname: string, href: string): boolean {
  if (href.includes('#')) return false;
  if (href === '/disenos/calida') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** El grupo que contiene la página actual (se abre solo en el menú del celular). */
function grupoActual(menu: MenuCalida, pathname: string): number | null {
  const i = menu.grupos.findIndex((g) => g.items.some((item) => esActual(pathname, item.href)));
  return i >= 0 ? i : null;
}

const ENFOCABLES = 'a[href], button:not([disabled])';

/** Lo que se puede enfocar y se ve (las listas plegadas tienen `hidden`). */
const visibles = (raiz: ParentNode | null | undefined) =>
  [...(raiz?.querySelectorAll<HTMLElement>(ENFOCABLES) ?? [])].filter(
    (el) => el.getClientRects().length > 0,
  );

/**
 * Navegación de la propuesta Cálida.
 * Escritorio (≥ 1280 px): «Conócenos · Siguiente paso · Comunidad · Recursos» con un menú
 * desplegable grande (como caminodevida.com): un panel crema que baja bajo el encabezado con la
 * foto y la frase del grupo y sus enlaces; el que está bajo el cursor se pinta durazno. Se abre al
 * pasar el mouse y también con clic, Enter/Espacio o ↓ (foco al primer enlace); Escape lo cierra
 * y devuelve el foco al botón; salir con Tab o hacer clic fuera también lo cierra. El panel es
 * hijo del `<li>` y empieza justo donde termina el encabezado: llevar el mouse hacia él no lo
 * cierra, ni siquiera en diagonal por encima de otro botón (`haciaElPanel`). Después, Oración y Dar sueltos y el botón «Planifica tu visita».
 * Celular y tablet: logo, «Planifica tu visita» (desde 768 px) y la hamburguesa; el menú ocupa la
 * pantalla con los grupos en acordeón, Escape lo cierra y el foco no se escapa a la página.
 */
export function Navegacion({ logo, menu }: { logo: ReactNode; menu: MenuCalida }) {
  const pathname = usePathname();
  const [movilAbierto, setMovilAbierto] = useState(false);
  const [grupoAbierto, setGrupoAbierto] = useState<number | null>(null);
  const [acordeon, setAcordeon] = useState<number | null>(() => grupoActual(menu, pathname));
  const [rutaVista, setRutaVista] = useState(pathname);
  const navRef = useRef<HTMLElement>(null);
  const botonMovil = useRef<HTMLButtonElement>(null);
  const panelMovil = useRef<HTMLDivElement>(null);
  // Con mouse el panel ya se abrió al pasar por encima: el clic no debe cerrarlo.
  const ultimoPuntero = useRef<string | null>(null);
  // Abierto con ↓: al pintarse, el foco va a su primer enlace.
  const enfocarPrimero = useRef(false);
  // Última posición del mouse sobre el menú: los eventos de salida que arma React
  // (onPointerLeave) llegan con movementX/Y en 0; su dirección sale de esta posición.
  const posicion = useRef({ x: 0, y: 0 });

  // Cambiar de página cierra los menús (ajuste de estado durante el render, sin efecto).
  if (rutaVista !== pathname) {
    setRutaVista(pathname);
    setMovilAbierto(false);
    setGrupoAbierto(null);
    setAcordeon(grupoActual(menu, pathname));
  }
  const cerrarTodo = () => {
    setMovilAbierto(false);
    setGrupoAbierto(null);
  };

  /**
   * ¿El mouse va hacia el panel? Baja (aunque sea en diagonal, hasta 3 a 1) y aún está dentro del
   * encabezado. Así, al bajar en diagonal desde «Conócenos» hasta su panel, pasar por encima de
   * «Siguiente paso» no cambia ni cierra el menú (sin esperas con temporizadores).
   */
  const haciaElPanel = (e: EventoPuntero) => {
    const fondo = navRef.current?.getBoundingClientRect().bottom ?? 0;
    // En pointermove, su propio desplazamiento; en la salida (que el navegador dispara antes del
    // pointermove, ya con la posición nueva), la diferencia con la última posición vista.
    const x = e.type === 'pointermove' ? e.movementX : e.clientX - posicion.current.x;
    const y = e.type === 'pointermove' ? e.movementY : e.clientY - posicion.current.y;
    return y > 0 && y * 3 >= Math.abs(x) && e.clientY <= fondo + 1;
  };

  // Panel de escritorio: Escape devuelve el foco a su botón; un clic fuera lo cierra.
  useEffect(() => {
    if (grupoAbierto === null) return;
    const panel = navRef.current?.querySelector(`#calida-panel-${grupoAbierto}`);
    if (enfocarPrimero.current) {
      enfocarPrimero.current = false;
      visibles(panel)[0]?.focus();
    }
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setGrupoAbierto(null);
      navRef.current
        ?.querySelector<HTMLButtonElement>(`button[aria-controls="calida-panel-${grupoAbierto}"]`)
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

  // Menú del celular: foco al primer elemento, Escape cierra, Tab da la vuelta dentro del menú,
  // la página de atrás no se desplaza y, si la ventana crece a escritorio, se cierra solo.
  useEffect(() => {
    if (!movilAbierto) return;
    const enfocables = () => [
      ...(botonMovil.current ? [botonMovil.current] : []),
      ...visibles(panelMovil.current),
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
    const escritorio = window.matchMedia('(min-width: 80rem)');
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

      <nav
        ref={navRef}
        aria-label="Principal"
        className="hidden self-stretch xl:block"
        onPointerMoveCapture={(e) => {
          posicion.current = { x: e.clientX, y: e.clientY };
        }}
      >
        <ul className="flex h-full items-stretch gap-[clamp(0rem,0.5vw,0.5rem)]">
          {menu.grupos.map((grupo, i) => {
            const abierto = grupoAbierto === i;
            const activo = grupo.items.some((item) => esActual(pathname, item.href));
            const panelId = `calida-panel-${i}`;
            return (
              <li
                key={grupo.titulo}
                className="flex items-center"
                onPointerMove={(e) => {
                  if (e.pointerType !== 'mouse' || grupoAbierto === i) return;
                  // Bajando hacia el panel abierto: cruzar este botón no cambia de grupo.
                  if (grupoAbierto !== null && haciaElPanel(e)) return;
                  setGrupoAbierto(i);
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType !== 'mouse' || haciaElPanel(e)) return;
                  setGrupoAbierto((actual) => (actual === i ? null : actual));
                }}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    setGrupoAbierto((actual) => (actual === i ? null : actual));
                  }
                }}
              >
                <button
                  type="button"
                  aria-expanded={abierto}
                  aria-controls={panelId}
                  onPointerDown={(e) => {
                    ultimoPuntero.current = e.pointerType;
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== 'ArrowDown') return;
                    e.preventDefault();
                    enfocarPrimero.current = true;
                    setGrupoAbierto(i);
                  }}
                  onClick={() => {
                    // Mouse: solo abre (cerrar es salir con el mouse). Teclado o táctil: alterna.
                    const mouse = ultimoPuntero.current === 'mouse';
                    ultimoPuntero.current = null;
                    setGrupoAbierto(mouse || !abierto ? i : null);
                  }}
                  className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[0.95rem] font-medium transition-colors ${
                    abierto
                      ? 'bg-accent-soft text-accent-strong'
                      : 'text-ink hover:text-accent-strong'
                  }`}
                >
                  <span className={`calida-trazo ${activo ? 'calida-trazo-fijo' : ''}`}>
                    {grupo.titulo}
                  </span>
                  <Icon
                    name="chevronDown"
                    className={`size-4 transition-transform motion-safe:duration-300 ${abierto ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Hijo del <li> aunque se dibuje bajo todo el encabezado: el mouse no «sale». */}
                <div
                  id={panelId}
                  hidden={!abierto}
                  className="absolute inset-x-0 top-full px-[clamp(1rem,4vw,3.5rem)] pt-2"
                >
                  <div className="calida-baja mx-auto grid max-w-[62rem] grid-cols-[minmax(0,5fr)_minmax(0,8fr)] gap-3 rounded-[1.25rem] bg-surface p-3 shadow-pop ring-1 ring-line">
                    <div className="relative isolate flex min-h-[15rem] flex-col justify-end gap-1.5 overflow-hidden rounded-[0.875rem] bg-(--d-noche) p-6 text-cream">
                      <Image
                        src={grupo.foto}
                        alt=""
                        fill
                        sizes="22rem"
                        className="-z-10 object-cover opacity-80"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 bg-linear-to-t from-(--d-noche) from-10% via-(--d-noche)/60 to-transparent"
                      />
                      <span className="font-display text-[2rem] leading-none">{grupo.titulo}</span>
                      <span className="max-w-[18rem] text-[0.95rem] leading-snug text-cream/90">
                        {grupo.resumen}
                      </span>
                    </div>
                    <ul className="grid grid-cols-2 content-center gap-1 py-2 pr-1">
                      {grupo.items.map((item) => {
                        const actual = esActual(pathname, item.href);
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={cerrarTodo}
                              aria-current={actual ? 'page' : undefined}
                              className={`group/item flex items-start gap-3 rounded-[0.875rem] px-4 py-3 transition-colors hover:bg-accent-soft focus-visible:bg-accent-soft ${actual ? 'bg-sunken' : ''}`}
                            >
                              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                                <span className="font-display text-[1.375rem] leading-tight text-ink">
                                  {item.label}
                                </span>
                                {item.description && (
                                  <span className="text-sm text-ink-soft">{item.description}</span>
                                )}
                              </span>
                              <Icon
                                name="arrowRight"
                                className="mt-1.5 size-4 shrink-0 text-accent-strong opacity-0 transition group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-visible/item:opacity-100 motion-safe:-translate-x-1"
                              />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
          {menu.sueltos.map((item) => (
            <li key={item.href} className="flex items-center">
              <Link
                href={item.href}
                className="inline-flex min-h-11 items-center rounded-full px-3 text-[0.95rem] font-medium text-ink transition-colors hover:text-accent-strong"
              >
                <span className="calida-trazo">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hidden md:block xl:ml-[clamp(0.5rem,1.2vw,1.5rem)]">
        <Link href={menu.visita.href} className={botonCalida('naranja', 'encabezado')}>
          {menu.visita.label}
          <Icon name="chevronRight" className="size-4" />
        </Link>
      </div>

      <button
        ref={botonMovil}
        type="button"
        className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-sunken xl:hidden"
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
        className="absolute inset-x-0 top-full h-[calc(100dvh-3.75rem)] overflow-y-auto overscroll-contain border-t border-line bg-canvas xl:hidden"
      >
        <nav
          aria-label="Principal (menú)"
          className="mx-auto flex max-w-[48rem] flex-col px-[clamp(1rem,4vw,2.5rem)] py-5"
        >
          {menu.grupos.map((grupo, i) => {
            const abierto = acordeon === i;
            const listaId = `calida-movil-${i}`;
            return (
              <div key={grupo.titulo} className="border-b border-line">
                <button
                  type="button"
                  aria-expanded={abierto}
                  aria-controls={listaId}
                  onClick={() => setAcordeon(abierto ? null : i)}
                  className="flex min-h-16 w-full items-center justify-between gap-3 text-left"
                >
                  <span
                    className={`font-display text-[clamp(1.625rem,1.35rem+1.3vw,2.125rem)] leading-tight ${abierto ? 'text-accent-strong' : 'text-ink'}`}
                  >
                    {grupo.titulo}
                  </span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-line">
                    <Icon
                      name="chevronDown"
                      className={`size-5 transition-transform motion-safe:duration-300 ${abierto ? 'rotate-180' : ''}`}
                    />
                  </span>
                </button>
                <ul
                  id={listaId}
                  hidden={!abierto}
                  className="calida-baja grid gap-x-4 pb-4 md:grid-cols-2"
                >
                  {grupo.items.map((item) => {
                    const actual = esActual(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={cerrarTodo}
                          aria-current={actual ? 'page' : undefined}
                          className={`flex min-h-13 items-center justify-between gap-3 rounded-[0.875rem] px-3 py-2 transition-colors hover:bg-accent-soft ${actual ? 'bg-sunken' : ''}`}
                        >
                          <span className="flex min-w-0 flex-col">
                            <span className="text-[1.0625rem] font-semibold text-ink">
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
            );
          })}
          <ul>
            {menu.sueltos.map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  onClick={cerrarTodo}
                  className="flex min-h-16 items-center justify-between gap-3"
                >
                  <span className="font-display text-[clamp(1.625rem,1.35rem+1.3vw,2.125rem)] leading-tight text-ink">
                    {item.label}
                  </span>
                  <Icon name="arrowRight" className="size-5 shrink-0 text-accent-strong" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="pt-7">
            <Link href={menu.visita.href} onClick={cerrarTodo} className={botonCalida('naranja')}>
              {menu.visita.label}
              <Icon name="arrowRight" className="size-5" />
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
