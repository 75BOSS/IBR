'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type FocusEvent, useEffect, useId, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import type { PublicNavGroup } from '@/lib/nav';
import { claseEnlaceMenu } from './estilos';

/**
 * Grupos del menú de escritorio (Conócenos, Conéctate, Recursos), cada uno con su desplegable.
 * Se abre con clic, teclado o al pasar el mouse; Escape lo cierra y devuelve el foco al botón,
 * igual que un clic fuera, salir con Tab o cambiar de página. Sobre el encabezado azul marino
 * (`oscuro`) los botones van en crema; el panel siempre es claro. `lado` alinea el panel con el
 * borde exterior del botón para que, cerca del borde de la ventana, no se salga de la pantalla.
 */
export function Desplegables({
  grupos,
  tono,
  lado,
}: {
  grupos: PublicNavGroup[];
  tono: 'oscuro' | 'claro';
  lado: 'izquierda' | 'derecha';
}) {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState<string | null>(null);
  const [rutaVista, setRutaVista] = useState(pathname);
  const lista = useRef<HTMLUListElement>(null);
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
      if (!lista.current?.contains(e.target as Node)) setAbierto(null);
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
    <ul ref={lista} className="flex items-center gap-x-[clamp(1.5rem,3.2vw,3.5rem)]">
      {grupos.map((grupo, i) => {
        const estaAbierto = abierto === grupo.title;
        const panelId = `${base}-${i}`;
        return (
          <li
            key={grupo.title}
            className="relative"
            onBlur={alSalir}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setAbierto(grupo.title)}
            onPointerLeave={(e) => e.pointerType === 'mouse' && setAbierto(null)}
          >
            <button
              type="button"
              ref={(el) => {
                if (el) botones.current.set(grupo.title, el);
                else botones.current.delete(grupo.title);
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
                setAbierto(conMouse || !estaAbierto ? grupo.title : null);
              }}
              className={claseEnlaceMenu(tono)}
            >
              {grupo.title}
              <Icon
                name="chevronDown"
                className={`size-3.5 opacity-70 transition-transform motion-safe:duration-200 ${
                  estaAbierto ? 'rotate-180' : ''
                }`}
              />
            </button>
            {/* El relleno superior mantiene el mouse dentro mientras baja al panel. */}
            <div
              id={panelId}
              hidden={!estaAbierto}
              className={`absolute top-full z-10 pt-3 ${lado === 'izquierda' ? '-left-4' : '-right-4'}`}
            >
              <ul className="w-[20rem] rounded-2xl bg-surface p-2 text-ink shadow-pop ring-1 ring-line [--focus-ring:var(--color-accent)] motion-safe:animate-toast-in">
                {grupo.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setAbierto(null)}
                      className="group/item flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-sunken"
                    >
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="font-display text-[1.0625rem] font-bold text-ink">
                          {item.label}
                        </span>
                        {item.description && (
                          <span className="text-sm text-ink-soft">{item.description}</span>
                        )}
                      </span>
                      <Icon
                        name="arrowRight"
                        className="size-4 text-accent opacity-0 transition group-hover/item:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
