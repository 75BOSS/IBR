'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import { DISENOS, NOMBRE_PAGINA, destinoDiseno, ubicarDiseno } from '@/disenos/registro';

/**
 * Botón flotante para comparar las propuestas de diseño con el sitio original. Solo se monta en
 * las copias de prueba (lo decide el servidor con `isIndexable()`), nunca en ibriglesia.com.
 * Lleva a la misma página del otro diseño si la tiene; si no, a su inicio.
 */
export function SelectorDiseno() {
  const pathname = usePathname();
  const { diseno, pagina } = ubicarDiseno(pathname);
  const [abierto, setAbierto] = useState(false);
  const [rutaVista, setRutaVista] = useState(pathname);
  const caja = useRef<HTMLDivElement>(null);

  // Al cambiar de página se cierra solo (ajuste durante el render, sin efecto).
  if (rutaVista !== pathname) {
    setRutaVista(pathname);
    setAbierto(false);
  }

  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(false);
    const alTocar = (e: PointerEvent) => {
      if (!caja.current?.contains(e.target as Node)) setAbierto(false);
    };
    window.addEventListener('keydown', alTeclear);
    document.addEventListener('pointerdown', alTocar);
    return () => {
      window.removeEventListener('keydown', alTeclear);
      document.removeEventListener('pointerdown', alTocar);
    };
  }, [abierto]);

  return (
    <div
      ref={caja}
      className="fixed bottom-[calc(1rem+var(--selector-alto,0rem))] left-4 z-50 flex flex-col items-start gap-2 font-sans"
    >
      {abierto && (
        <nav
          id="selector-diseno"
          aria-label="Propuestas de diseño"
          className="w-[min(20rem,calc(100vw-2rem))] rounded-2xl bg-surface p-2 text-ink shadow-pop ring-1 ring-line"
        >
          <p className="px-3 pt-2 pb-1 caps text-ink-soft">Ver el sitio con el diseño…</p>
          <ul className="flex flex-col">
            {DISENOS.map((d) => {
              const actual = d.slug === diseno.slug;
              return (
                <li key={d.slug}>
                  <Link
                    href={destinoDiseno(d, pagina)}
                    aria-current={actual ? 'page' : undefined}
                    className={`flex flex-col rounded-xl px-3 py-2 transition hover:bg-sunken ${
                      actual ? 'bg-brand-soft' : ''
                    }`}
                  >
                    <span className="flex items-center gap-2 font-semibold">
                      {d.nombre}
                      {actual && <Icon name="check" className="size-4 text-accent-strong" />}
                    </span>
                    <span className="text-sm text-ink-soft">{d.resumen}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link href="/disenos" className="mx-3 my-2 inline-block text-sm link">
            Comparar todas
          </Link>
        </nav>
      )}
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls="selector-diseno"
        onClick={() => setAbierto((a) => !a)}
        className="flex min-h-11 items-center gap-2 rounded-full bg-night px-4 text-sm font-semibold text-cream shadow-pop ring-1 ring-cream/20 on-dark"
      >
        <span>
          Diseño: {diseno.nombre}
          {pagina && pagina !== 'inicio' ? ` · ${NOMBRE_PAGINA[pagina]}` : ''}
        </span>
        <Icon name="chevronDown" className={`size-4 transition ${abierto ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}
