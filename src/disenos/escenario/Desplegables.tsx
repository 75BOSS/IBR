'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type FocusEvent, useEffect, useId, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import { claseEnlaceMenu } from './estilos';
import type { EnlaceMenu, GrupoMenu } from './menu';

/**
 * Un lado del menú de escritorio (el logo va al centro): los grupos con su panel desplegable
 * (mega menú, como el de caminodevida) y, a la derecha, los enlaces sueltos y la acción
 * principal (`children`). El panel baja desde el borde exterior de su lado, claro y con borde
 * rojo arriba: a la izquierda los enlaces del grupo y a la derecha una foto destacada; el enlace
 * bajo el cursor se resalta con una raya roja y una flecha que se desliza.
 *
 * Se abre al pasar el mouse y con clic o teclado (Enter/Espacio); Escape lo cierra y devuelve el
 * foco al botón, igual que un clic fuera, salir con Tab o cambiar de página. El relleno superior
 * del panel une el botón con el panel: mover el cursor hacia abajo no lo cierra.
 */
export function Desplegables({
  grupos,
  sueltos = [],
  tono,
  lado,
  children,
}: {
  grupos: GrupoMenu[];
  sueltos?: EnlaceMenu[];
  tono: 'oscuro' | 'claro';
  lado: 'izquierda' | 'derecha';
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState<string | null>(null);
  const [rutaVista, setRutaVista] = useState(pathname);
  const zona = useRef<HTMLDivElement>(null);
  const botones = useRef(new Map<string, HTMLButtonElement>());
  // Con mouse, el panel ya se abrió al pasar por encima: el clic no debe cerrarlo.
  const ultimoPuntero = useRef<string | null>(null);
  const base = useId();

  // Cambiar de página cierra el panel (ajuste durante el render, sin efecto).
  if (rutaVista !== pathname) {
    setRutaVista(pathname);
    setAbierto(null);
  }

  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      botones.current.get(abierto)?.focus();
      setAbierto(null);
    };
    const alTocar = (e: PointerEvent) => {
      if (!zona.current?.contains(e.target as Node)) setAbierto(null);
    };
    window.addEventListener('keydown', alTeclear);
    document.addEventListener('pointerdown', alTocar);
    return () => {
      window.removeEventListener('keydown', alTeclear);
      document.removeEventListener('pointerdown', alTocar);
    };
  }, [abierto]);

  // Salir del grupo con Tab lo cierra (el foco no queda en un panel que ya no se usa).
  const alSalir = (e: FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setAbierto(null);
  };

  return (
    <div
      ref={zona}
      className={`relative flex items-center gap-x-[clamp(0.875rem,1.6vw,2rem)] ${
        lado === 'derecha' ? 'justify-end' : ''
      }`}
    >
      <ul className="flex items-center gap-x-[clamp(0.875rem,1.6vw,2rem)]">
        {grupos.map((grupo, i) => {
          const estaAbierto = abierto === grupo.titulo;
          const panelId = `${base}-${i}`;
          return (
            <li
              key={grupo.titulo}
              onBlur={alSalir}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setAbierto(grupo.titulo)}
              onPointerLeave={(e) => e.pointerType === 'mouse' && setAbierto(null)}
            >
              <button
                type="button"
                ref={(el) => {
                  if (el) botones.current.set(grupo.titulo, el);
                  else botones.current.delete(grupo.titulo);
                }}
                aria-expanded={estaAbierto}
                aria-controls={panelId}
                onPointerDown={(e) => {
                  ultimoPuntero.current = e.pointerType;
                }}
                onClick={() => {
                  // Mouse: solo abre (cerrar lo hace salir con el mouse). Teclado o táctil: alterna.
                  const conMouse = ultimoPuntero.current === 'mouse';
                  ultimoPuntero.current = null;
                  setAbierto(conMouse || !estaAbierto ? grupo.titulo : null);
                }}
                className={`${claseEnlaceMenu(tono)} relative after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-(--d-rojo) after:transition-transform after:duration-300 aria-expanded:after:scale-x-100`}
              >
                {grupo.titulo}
                <Icon
                  name="chevronDown"
                  className={`size-3.5 opacity-70 transition-transform motion-safe:duration-200 ${
                    estaAbierto ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                id={panelId}
                hidden={!estaAbierto}
                className={`absolute top-full z-10 pt-[1.1875rem] ${
                  lado === 'izquierda' ? '-left-4' : '-right-4'
                }`}
              >
                <Panel grupo={grupo} alElegir={() => setAbierto(null)} />
              </div>
            </li>
          );
        })}
        {sueltos.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              className={claseEnlaceMenu(tono)}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
}

/** Panel de un grupo: enlaces con su explicación y la foto destacada. */
function Panel({ grupo, alElegir }: { grupo: GrupoMenu; alElegir: () => void }) {
  const { destacado } = grupo;
  return (
    <div className="d-panel grid w-[min(39rem,calc(100vw-2rem))] grid-cols-[minmax(0,1fr)_13rem] gap-2 rounded-b-2xl border-t-4 border-(--d-rojo) bg-surface p-2 text-ink shadow-pop ring-1 ring-line [--focus-ring:var(--color-accent)]">
      <ul className="flex flex-col py-1">
        {grupo.items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={alElegir}
              className="group/item relative flex items-center gap-3 rounded-xl py-2.5 pr-3 pl-6 transition-colors before:absolute before:inset-y-3 before:left-2.5 before:w-[3px] before:origin-center before:scale-y-0 before:rounded-full before:bg-(--d-rojo) before:transition-transform before:duration-300 hover:bg-sunken hover:before:scale-y-100 focus-visible:bg-sunken focus-visible:before:scale-y-100"
            >
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-display text-[1.0625rem] font-bold text-ink transition-colors group-hover/item:text-accent">
                  {item.label}
                </span>
                {item.description && (
                  <span className="text-sm text-ink-soft">{item.description}</span>
                )}
              </span>
              <Icon
                name="arrowRight"
                className="size-4 shrink-0 -translate-x-2 text-accent opacity-0 transition duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={destacado.href}
        onClick={alElegir}
        className="group/destacado relative isolate flex min-h-[15rem] flex-col justify-end gap-1 overflow-hidden rounded-xl bg-(--d-marino) p-4 text-cream on-dark"
      >
        <Image
          src={destacado.foto}
          alt=""
          fill
          sizes="13rem"
          className="-z-20 object-cover transition-transform duration-700 ease-(--ease-out-soft) group-hover/destacado:scale-110"
        />
        <span aria-hidden="true" className="absolute inset-0 -z-10 bg-(image:--d-velo-tarjeta)" />
        <span className="font-headline text-[1.25rem] leading-tight font-extrabold tracking-[-0.03em]">
          {destacado.titulo}
        </span>
        <span className="text-sm text-cream/90">{destacado.texto}</span>
        <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-peach">
          Ver más
          <Icon
            name="arrowRight"
            className="size-4 transition-transform group-hover/destacado:translate-x-1"
          />
        </span>
      </Link>
    </div>
  );
}
