'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type PointerEvent as EventoPuntero, useEffect, useRef, useState } from 'react';
import { BrandLogo } from '@/components/BrandMark';
import { Icon } from '@/components/Icon';
import { FocoCursor } from './efectos';
import { type GrupoMenu, type MenuNocturna, esPaginaActual, grupoActivo } from './menu';
import { RUTAS } from './rutas';
import { CONTENEDOR, CURSIVA, Etiqueta, Foto, pildora } from './ui';

const idPanel = (i: number) => `nocturna-panel-${i}`;
const idGrupoMovil = (i: number) => `nocturna-movil-${i}`;
const esMouse = (e: EventoPuntero) => e.pointerType === 'mouse';

/**
 * Panel del mega menú (como el de caminodevida): baja del encabezado a todo lo ancho, azul de
 * noche con un borde fino durazno. A la izquierda el grupo y su frase, al centro los enlaces (el
 * que está bajo el cursor se ilumina y su flecha avanza) y, en pantallas anchas, una tarjeta con
 * foto. Un foco de luz sigue al cursor por el panel.
 */
function PanelMega({
  grupo,
  ruta,
  animar,
  alElegir,
}: {
  grupo: GrupoMenu;
  ruta: string;
  /** Solo al abrir desde cerrado: al pasar de un grupo a otro el panel no vuelve a bajar. */
  animar: boolean;
  alElegir: () => void;
}) {
  const { destacado } = grupo;
  return (
    <div
      className={`relative isolate overflow-hidden border-y border-peach/30 bg-(--d-noche) text-cream shadow-lift on-dark ${
        animar ? 'd-baja' : ''
      }`}
    >
      <FocoCursor />
      <div
        className={`${CONTENEDOR} grid grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)] gap-[clamp(1.5rem,3vw,3rem)] py-[clamp(1.75rem,2.6vw,2.5rem)] xl:max-w-[80rem] xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)_minmax(0,0.95fr)]`}
      >
        <div className="flex flex-col gap-4 border-r border-cream/10 pr-[clamp(1rem,2vw,2rem)]">
          <Etiqueta className="text-(--d-arena)">{grupo.titulo}</Etiqueta>
          <p className="font-display text-[clamp(1.75rem,0.9rem+1.5vw,2.5rem)] leading-[1] font-extrabold tracking-[-0.03em] break-words">
            {grupo.lema[0]}{' '}
            <span className={`text-[1.08em] tracking-normal text-peach ${CURSIVA}`}>
              {grupo.lema[1]}
            </span>
          </p>
        </div>
        <ul className="grid grid-cols-2 content-start gap-x-3 gap-y-1">
          {grupo.items.map((item) => {
            const actual = esPaginaActual(ruta, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={alElegir}
                  aria-current={actual ? 'page' : undefined}
                  className={`group/enlace flex items-start justify-between gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-cream/8 focus-visible:bg-cream/8 ${
                    actual ? 'bg-cream/5' : ''
                  }`}
                >
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span
                      className={`font-display text-[1.0625rem] leading-snug font-semibold transition-colors group-hover/enlace:text-peach ${
                        actual ? 'text-peach' : ''
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="text-sm leading-snug text-cream/70">{item.descripcion}</span>
                  </span>
                  <Icon
                    name="arrowRight"
                    className="mt-1 size-4 shrink-0 -translate-x-1 text-peach opacity-0 transition group-hover/enlace:translate-x-0 group-hover/enlace:opacity-100 group-focus-visible/enlace:translate-x-0 group-focus-visible/enlace:opacity-100 motion-safe:duration-200"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href={destacado.href}
          onClick={alElegir}
          className="group/destacado relative isolate hidden min-h-[12.5rem] flex-col justify-end gap-1 overflow-hidden rounded-xl p-5 ring-1 ring-peach/25 xl:flex"
        >
          <Foto
            src={destacado.foto}
            sizes="22vw"
            capa
            efecto="transition-transform duration-700 motion-safe:group-hover/destacado:scale-105"
            className="inset-0 -z-10"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-t from-(--d-tinta) via-(--d-tinta)/60 to-(--d-tinta)/5"
          />
          <span className="font-display text-xl leading-tight font-bold">{destacado.titulo}</span>
          <span className="text-sm leading-snug text-cream/85">{destacado.texto}</span>
          <span className="mt-2 inline-flex items-center gap-2 font-display text-sm font-semibold text-peach">
            {destacado.accion}
            <Icon
              name="arrowRight"
              className="size-4 transition-transform motion-safe:group-hover/destacado:translate-x-1"
            />
          </span>
        </Link>
      </div>
    </div>
  );
}

/**
 * Encabezado de la propuesta Nocturna. En el inicio es azul marino con el logo en durazno y el
 * botón «Planifica tu visita» (imágenes 7 y 9); en las páginas interiores es crema con el logo
 * azul y el botón naranja «Soy nuevo» (imagen 8); los dos llevan a la Primera visita.
 * Escritorio: mega menú que se abre al pasar el cursor y también con clic o teclado (Enter,
 * Espacio o flecha abajo; Escape cierra y devuelve el foco), y no se cierra mientras el cursor
 * baja al panel. Celular y tablet: menú a pantalla completa con los grupos en acordeón.
 */
export function Encabezado({ nombre, menu }: { nombre: string; menu: MenuNocturna }) {
  const pathname = usePathname();
  const ruta = pathname.replace(/\/+$/, '');
  const oscuro = ruta === RUTAS.inicio;
  const [movilAbierto, setMovilAbierto] = useState(false);
  const [movilGrupo, setMovilGrupo] = useState<string | null>(null);
  const [grupoAbierto, setGrupoAbierto] = useState<string | null>(null);
  const [animarPanel, setAnimarPanel] = useState(true);
  const [rutaVista, setRutaVista] = useState(pathname);
  const navRef = useRef<HTMLElement>(null);
  const botonMovil = useRef<HTMLButtonElement>(null);
  const panelMovil = useRef<HTMLDivElement>(null);
  const botones = useRef(new Map<string, HTMLButtonElement>());
  // Con mouse, el panel ya se abrió al pasar por encima: el clic no debe cerrarlo.
  const ultimoPuntero = useRef<string | null>(null);
  // Flecha abajo sobre un grupo: al abrirse su panel, el foco entra a su primer enlace.
  const enfocarPanel = useRef(false);

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
  /** Abre un grupo (o cierra con null). El panel baja animado solo si no había otro abierto. */
  const abrir = (titulo: string | null) => {
    if (titulo === grupoAbierto) return;
    setAnimarPanel(grupoAbierto === null);
    setGrupoAbierto(titulo);
  };

  useEffect(() => {
    if (!movilAbierto && !grupoAbierto) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (movilAbierto) botonMovil.current?.focus();
      else if (grupoAbierto && navRef.current?.contains(document.activeElement)) {
        botones.current.get(grupoAbierto)?.focus();
      }
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

  // Panel abierto con la flecha abajo: el foco pasa a su primer enlace.
  useEffect(() => {
    if (!grupoAbierto || !enfocarPanel.current) return;
    enfocarPanel.current = false;
    const i = menu.grupos.findIndex((g) => g.titulo === grupoAbierto);
    document.getElementById(idPanel(i))?.querySelector<HTMLElement>('a')?.focus();
  }, [grupoAbierto, menu.grupos]);

  // Al abrir el menú del celular, el foco entra en su primer control.
  useEffect(() => {
    if (movilAbierto) panelMovil.current?.querySelector<HTMLElement>('button, a')?.focus();
  }, [movilAbierto]);

  const tono = oscuro
    ? {
        barra: 'border-cream/12 bg-brand text-cream on-dark',
        logo: 'text-peach',
        grupo: 'text-cream hover:text-peach',
        flecha: 'text-cream/70',
        cta: pildora({ tono: 'durazno', tamano: 'sm' }),
        ctaTexto: 'Planifica tu visita',
      }
    : {
        barra: 'border-line bg-canvas text-ink',
        logo: 'text-ink',
        grupo: 'text-ink hover:text-accent-strong',
        flecha: 'text-ink-soft',
        cta: pildora({ tono: 'naranja', tamano: 'sm' }),
        ctaTexto: 'Soy nuevo',
      };
  const claseEnlace = `inline-flex min-h-11 items-center gap-1 rounded-full px-[clamp(0.5rem,0.75vw,0.75rem)] text-[clamp(0.875rem,0.75rem+0.2vw,0.9375rem)] font-medium whitespace-nowrap transition-colors ${tono.grupo}`;

  return (
    <header className={`sticky top-0 z-40 h-(--d-cabecera) border-b ${tono.barra}`}>
      <div
        className={`${CONTENEDOR} flex h-full items-center gap-[clamp(0.5rem,1.4vw,2rem)] xl:max-w-[80rem]`}
      >
        <Link
          href={RUTAS.inicio}
          onClick={cerrarTodo}
          className={`mr-auto flex min-w-0 items-center rounded-lg ${tono.logo}`}
        >
          <BrandLogo className="h-[clamp(2.125rem,1.7rem+1.1vw,3.125rem)]" />
          <span className="sr-only">{nombre}, ir al inicio</span>
        </Link>

        <nav
          ref={navRef}
          aria-label="Principal"
          className="hidden h-full lg:block"
          onPointerLeave={(e) => esMouse(e) && abrir(null)}
        >
          <ul className="flex h-full items-center gap-[clamp(0rem,0.5vw,0.5rem)]">
            {menu.grupos.map((grupo, i) => {
              const abierto = grupoAbierto === grupo.titulo;
              const activo = grupoActivo(pathname, grupo);
              return (
                // El li ocupa todo el alto del encabezado y el panel es su hijo: el cursor baja
                // del botón al panel sin salir del grupo, así el panel no se cierra en el camino.
                <li
                  key={grupo.titulo}
                  className="flex h-full items-center"
                  onPointerEnter={(e) => esMouse(e) && abrir(grupo.titulo)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null) && abierto) {
                      setGrupoAbierto(null);
                    }
                  }}
                >
                  <button
                    ref={(el) => {
                      if (el) botones.current.set(grupo.titulo, el);
                      else botones.current.delete(grupo.titulo);
                    }}
                    type="button"
                    aria-expanded={abierto}
                    aria-controls={idPanel(i)}
                    onPointerDown={(e) => {
                      ultimoPuntero.current = e.pointerType;
                    }}
                    onClick={() => {
                      // Mouse: solo abre (cierra al salir). Teclado o táctil: alterna.
                      const mouse = ultimoPuntero.current === 'mouse';
                      ultimoPuntero.current = null;
                      abrir(mouse || !abierto ? grupo.titulo : null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== 'ArrowDown') return;
                      e.preventDefault();
                      if (abierto) {
                        document
                          .getElementById(idPanel(i))
                          ?.querySelector<HTMLElement>('a')
                          ?.focus();
                      } else {
                        enfocarPanel.current = true;
                        abrir(grupo.titulo);
                      }
                    }}
                    className={claseEnlace}
                  >
                    <span
                      className={`decoration-2 underline-offset-8 ${
                        activo || abierto ? 'underline decoration-(--d-durazno)' : ''
                      }`}
                    >
                      {grupo.titulo}
                    </span>
                    <Icon
                      name="chevronDown"
                      className={`size-4 transition-transform motion-safe:duration-200 ${tono.flecha} ${
                        abierto ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div id={idPanel(i)} hidden={!abierto} className="absolute inset-x-0 top-full">
                    <PanelMega
                      grupo={grupo}
                      ruta={ruta}
                      animar={animarPanel}
                      alElegir={cerrarTodo}
                    />
                  </div>
                </li>
              );
            })}
            {menu.sueltos.map((item) => (
              <li
                key={item.href}
                className="flex h-full items-center"
                onPointerEnter={(e) => esMouse(e) && abrir(null)}
              >
                <Link
                  href={item.href}
                  aria-current={esPaginaActual(ruta, item.href) ? 'page' : undefined}
                  className={claseEnlace}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <Link
            href={RUTAS.primeraVisita}
            aria-current={ruta === RUTAS.primeraVisita ? 'page' : undefined}
            className={tono.cta}
          >
            {tono.ctaTexto}
          </Link>
        </div>

        <button
          ref={botonMovil}
          type="button"
          aria-expanded={movilAbierto}
          aria-controls="nocturna-menu-movil"
          onClick={() => {
            if (!movilAbierto) {
              setMovilGrupo(menu.grupos.find((g) => grupoActivo(pathname, g))?.titulo ?? null);
            }
            setMovilAbierto((v) => !v);
          }}
          className="-mr-2 grid size-11 place-items-center rounded-full lg:hidden"
        >
          <Icon name={movilAbierto ? 'close' : 'menu'} className="size-7" />
          <span className="sr-only">{movilAbierto ? 'Cerrar menú' : 'Abrir menú'}</span>
        </button>
      </div>

      {/* Velo sobre la página mientras un panel está abierto (no atrapa el cursor). */}
      {grupoAbierto && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-(--d-cabecera) bottom-0 -z-10 hidden bg-(--d-tinta)/45 motion-safe:animate-toast-in lg:block"
        />
      )}

      <div
        id="nocturna-menu-movil"
        ref={panelMovil}
        hidden={!movilAbierto}
        className="fixed inset-x-0 top-(--d-cabecera) bottom-0 overflow-y-auto overscroll-contain bg-(--d-noche) text-cream on-dark lg:hidden"
      >
        <nav
          aria-label="Principal (menú)"
          className={`${CONTENEDOR} flex flex-col gap-[clamp(1.5rem,5vw,2.25rem)] py-[clamp(1rem,4vw,2rem)]`}
        >
          <ul className="flex flex-col">
            {menu.grupos.map((grupo, i) => {
              const abierto = movilGrupo === grupo.titulo;
              return (
                <li key={grupo.titulo} className="border-b border-cream/12">
                  <button
                    type="button"
                    aria-expanded={abierto}
                    aria-controls={idGrupoMovil(i)}
                    onClick={() => setMovilGrupo(abierto ? null : grupo.titulo)}
                    className="flex min-h-16 w-full items-center justify-between gap-3 py-3 text-left"
                  >
                    <span
                      className={`font-display text-[clamp(1.5rem,1.2rem+1.4vw,2rem)] leading-tight font-bold ${
                        grupoActivo(pathname, grupo) ? 'text-peach' : ''
                      }`}
                    >
                      {grupo.titulo}
                    </span>
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center rounded-full border border-peach/40 text-peach"
                    >
                      <Icon
                        name="chevronDown"
                        className={`size-5 transition-transform motion-safe:duration-200 ${
                          abierto ? 'rotate-180' : ''
                        }`}
                      />
                    </span>
                  </button>
                  <ul
                    id={idGrupoMovil(i)}
                    hidden={!abierto}
                    className="grid gap-x-8 pb-4 motion-safe:animate-toast-in md:grid-cols-2"
                  >
                    {grupo.items.map((item) => {
                      const actual = esPaginaActual(ruta, item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={cerrarTodo}
                            aria-current={actual ? 'page' : undefined}
                            className="flex min-h-14 items-center justify-between gap-3 border-l-2 border-peach/25 py-2 pl-4"
                          >
                            <span className="flex min-w-0 flex-col">
                              <span
                                className={`font-display text-[clamp(1.125rem,1rem+0.6vw,1.3125rem)] leading-tight font-semibold ${
                                  actual ? 'text-peach' : ''
                                }`}
                              >
                                {item.label}
                              </span>
                              <span className="text-sm text-cream/70">{item.descripcion}</span>
                            </span>
                            <Icon name="arrowRight" className="size-5 shrink-0 text-peach" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link
              href={RUTAS.primeraVisita}
              onClick={cerrarTodo}
              className={pildora({ tono: 'durazno', tamano: 'lg', className: 'grow' })}
            >
              Planifica tu visita <Icon name="arrowRight" className="size-5" />
            </Link>
            {menu.sueltos.map((item) => (
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
