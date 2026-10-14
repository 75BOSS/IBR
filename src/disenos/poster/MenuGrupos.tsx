'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type KeyboardEvent, type PointerEvent, useId, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import { esActual } from './enlaces';
import { IconoPoster } from './IconoPoster';
import type { GrupoMenu, ItemMenu, MenuPoster, SueltoMenu } from './menu';

/** Un grupo se abre con clic/teclado (queda abierto) o al pasar el cursor (se cierra al salir). */
type Origen = 'clic' | 'cursor';

function grupoDe(grupos: GrupoMenu[], pathname: string): Record<string, Origen> {
  const actual = grupos.find((g) => g.items.some((i) => esActual(pathname, i.href)));
  return actual ? { [actual.titulo]: 'clic' } : {};
}

/** Sangría de los enlaces de un grupo en el lateral: bajo la palabra, no bajo el ícono. */
const SANGRIA_LATERAL =
  'pl-[calc(clamp(1.25rem,1.9vw,1.875rem)+1.4rem+clamp(0.625rem,1vw,1.125rem))]';
const FILA_LATERAL =
  'relative flex min-h-[clamp(2.75rem,6.2vh,3.6rem)] w-full items-center gap-[clamp(0.625rem,1vw,1.125rem)] pr-3 pl-[clamp(1.25rem,1.9vw,1.875rem)] text-left text-[clamp(0.9375rem,0.8rem+0.2vw,1.0625rem)] leading-tight transition-colors before:absolute before:inset-y-1 before:left-0 before:w-[0.2rem] hover:text-accent';
const FILA_DIALOGO =
  'group flex min-h-14 w-full items-center justify-between gap-4 py-2 text-left font-display text-[clamp(1.375rem,1.15rem+1vw,1.75rem)] leading-none font-extrabold uppercase font-stretch-[80%] hover:text-accent';

/**
 * Los grupos del menú de la propuesta como acordeón, con la misma estructura en el menú lateral
 * de escritorio y en el menú del celular. Cada grupo es un botón con `aria-expanded`; su panel
 * se despliega debajo (sin cambiar de lugar, así el cursor nunca «pierde» el menú). En el
 * lateral, además, un grupo se abre al pasar el cursor (solo con mouse) y se vuelve a cerrar al
 * salir del menú si no se abrió con clic; Escape cierra el grupo donde está el foco y lo devuelve
 * a su botón. El grupo de la página actual empieza abierto. Una guía roja sigue al cursor por
 * los enlaces del grupo (variables --guia-*, sin re-render).
 */
export function MenuGrupos({
  menu,
  variante,
}: {
  menu: MenuPoster;
  variante: 'lateral' | 'dialogo';
}) {
  const pathname = usePathname();
  const id = useId();
  const lateral = variante === 'lateral';
  const [abiertos, setAbiertos] = useState<Record<string, Origen>>(() =>
    grupoDe(menu.grupos, pathname),
  );
  const [rutaVista, setRutaVista] = useState(pathname);
  const botones = useRef(new Map<string, HTMLButtonElement>());

  // Al cambiar de página queda abierto solo el grupo de la página nueva (ajuste en el render).
  if (rutaVista !== pathname) {
    setRutaVista(pathname);
    setAbiertos(grupoDe(menu.grupos, pathname));
  }

  // Clic o Enter: cerrado → abierto; abierto por el cursor → se queda abierto (el clic que
  // llega después de pasar el cursor no debe cerrarlo); abierto con clic → cerrado.
  const alternar = (titulo: string) =>
    setAbiertos((prev) => {
      const sig = { ...prev };
      if (prev[titulo] === 'clic') delete sig[titulo];
      else sig[titulo] = 'clic';
      return sig;
    });

  const abrirConCursor = (titulo: string, e: PointerEvent) => {
    if (!lateral || e.pointerType !== 'mouse') return;
    setAbiertos((prev) => (prev[titulo] ? prev : { ...prev, [titulo]: 'cursor' }));
  };

  const cerrarLosDelCursor = () =>
    setAbiertos((prev) =>
      Object.values(prev).includes('cursor')
        ? Object.fromEntries(Object.entries(prev).filter(([, o]) => o === 'clic'))
        : prev,
    );

  const alTeclear = (e: KeyboardEvent<HTMLUListElement>) => {
    if (!lateral || e.key !== 'Escape') return;
    const titulo = (e.target as HTMLElement).closest('[data-grupo]')?.getAttribute('data-grupo');
    if (!titulo || !abiertos[titulo]) return;
    e.preventDefault();
    setAbiertos((prev) => {
      const sig = { ...prev };
      delete sig[titulo];
      return sig;
    });
    botones.current.get(titulo)?.focus();
  };

  const actualEn = (g: GrupoMenu) => g.items.some((i) => esActual(pathname, i.href));

  return (
    <ul
      className="flex flex-col"
      onPointerLeave={lateral ? cerrarLosDelCursor : undefined}
      onKeyDown={alTeclear}
    >
      <li className={lateral ? '' : 'border-b border-ink/25'}>
        <EnlaceRaiz
          item={menu.inicio}
          lateral={lateral}
          actual={esActual(pathname, menu.inicio.href)}
        />
      </li>
      {menu.grupos.map((g, n) => {
        const abierto = Boolean(abiertos[g.titulo]);
        const panel = `${id}-grupo-${n}`;
        const conActual = actualEn(g);
        return (
          <li
            key={g.titulo}
            data-grupo={g.titulo}
            onPointerEnter={(e) => abrirConCursor(g.titulo, e)}
            className={lateral ? '' : 'border-b border-ink/25'}
          >
            <button
              ref={(b) => {
                if (b) botones.current.set(g.titulo, b);
                else botones.current.delete(g.titulo);
              }}
              type="button"
              aria-expanded={abierto}
              aria-controls={panel}
              onClick={() => alternar(g.titulo)}
              className={
                lateral
                  ? `${FILA_LATERAL} ${conActual ? 'font-semibold text-accent before:bg-accent' : 'text-ink'}`
                  : `${FILA_DIALOGO} ${conActual ? 'text-accent' : 'text-ink'}`
              }
            >
              {lateral && <IconoPoster nombre={g.icono} className="size-[1.4rem]" />}
              <span className="min-w-0 flex-1">{g.titulo}</span>
              <Icon
                name={lateral ? 'chevronDown' : 'plus'}
                strokeWidth={lateral ? 2 : 2.75}
                className={`shrink-0 motion-safe:transition-transform motion-safe:duration-300 ${
                  lateral ? 'size-4' : 'size-6'
                } ${abierto ? (lateral ? 'rotate-180' : 'rotate-45') : ''}`}
              />
            </button>
            <div
              id={panel}
              inert={!abierto}
              className={`d-panel grid ${abierto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="min-h-0 overflow-hidden">
                <ListaGrupo items={g.items} lateral={lateral} pathname={pathname} />
              </div>
            </div>
          </li>
        );
      })}
      {menu.sueltos.map((s) => (
        <li key={s.href} className={lateral ? '' : 'border-b border-ink/25'}>
          <EnlaceRaiz item={s} lateral={lateral} actual={esActual(pathname, s.href)} />
        </li>
      ))}
    </ul>
  );
}

/** Inicio, Oración y Dar: enlaces del primer nivel. */
function EnlaceRaiz({
  item,
  lateral,
  actual,
}: {
  item: SueltoMenu;
  lateral: boolean;
  actual: boolean;
}) {
  return (
    <Link
      href={item.href}
      aria-current={actual ? 'page' : undefined}
      className={
        lateral
          ? `${FILA_LATERAL} ${actual ? 'font-semibold text-accent before:bg-accent' : 'text-ink'}`
          : `${FILA_DIALOGO} ${actual ? 'text-accent' : 'text-ink'}`
      }
    >
      {lateral && <IconoPoster nombre={item.icono} className="size-[1.4rem]" />}
      <span className="min-w-0 flex-1">{item.etiqueta}</span>
      {!lateral && <Icon name="arrowRight" className="d-flecha size-5 shrink-0" />}
    </Link>
  );
}

/** Enlaces de un grupo, con la guía que sigue al cursor (lateral) o con su descripción (celular). */
function ListaGrupo({
  items,
  lateral,
  pathname,
}: {
  items: ItemMenu[];
  lateral: boolean;
  pathname: string;
}) {
  const caja = useRef<HTMLDivElement>(null);

  const guiar = (e: PointerEvent<HTMLAnchorElement>) => {
    const c = caja.current;
    const fila = e.currentTarget.parentElement;
    if (!c || !fila || e.pointerType !== 'mouse') return;
    c.style.setProperty('--guia-y', `${fila.offsetTop}px`);
    c.style.setProperty('--guia-alto', `${fila.offsetHeight}px`);
    c.style.setProperty('--guia-ver', '1');
  };

  return (
    <div
      ref={caja}
      className={lateral ? 'relative pb-2' : 'relative pb-3'}
      onPointerLeave={() => caja.current?.style.setProperty('--guia-ver', '0')}
    >
      {lateral && (
        <span
          aria-hidden="true"
          className="d-guia pointer-events-none absolute top-0 left-[clamp(1.25rem,1.9vw,1.875rem)] w-[0.2rem] bg-accent"
        />
      )}
      <ul className="flex flex-col">
        {items.map((item) => {
          const actual = esActual(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={actual ? 'page' : undefined}
                onPointerEnter={lateral ? guiar : undefined}
                className={
                  lateral
                    ? `flex min-h-10 items-center pr-3 text-[clamp(0.875rem,0.8rem+0.15vw,0.9688rem)] leading-tight transition-colors hover:text-accent focus-visible:outline-offset-[-3px] ${SANGRIA_LATERAL} ${
                        actual ? 'font-semibold text-accent' : 'text-ink-soft'
                      }`
                    : 'group flex min-h-12 items-center justify-between gap-4 py-1.5 pl-4 focus-visible:outline-offset-[-3px]'
                }
              >
                {lateral ? (
                  item.etiqueta
                ) : (
                  <>
                    <span className="flex min-w-0 flex-col">
                      <span
                        className={`text-[1.0625rem] font-semibold group-hover:text-accent ${actual ? 'text-accent' : 'text-ink'}`}
                      >
                        {item.etiqueta}
                      </span>
                      {item.descripcion && (
                        <span className="text-sm text-ink-soft">{item.descripcion}</span>
                      )}
                    </span>
                    <Icon name="arrowRight" className="d-flecha size-4 shrink-0 text-ink" />
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
