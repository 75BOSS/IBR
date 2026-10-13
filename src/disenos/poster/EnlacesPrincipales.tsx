'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type EnlacePrincipal, esActual } from './enlaces';
import { IconoPoster } from './IconoPoster';

/**
 * Destinos principales con el actual en rojo: lista vertical del menú lateral (escritorio,
 * imagen 13) o barra de pestañas fija abajo (celular, imagen 15). Es cliente solo para saber la
 * ruta actual; los enlaces ya vienen filtrados por contenido (`enlacesPrincipales`).
 */
export function EnlacesPrincipales({
  enlaces,
  variante,
}: {
  enlaces: EnlacePrincipal[];
  variante: 'lateral' | 'barra';
}) {
  const pathname = usePathname();

  if (variante === 'lateral') {
    return (
      <ul className="flex flex-col gap-[clamp(0rem,1vh,0.75rem)]">
        {enlaces.map((e) => {
          const actual = esActual(pathname, e.href);
          return (
            <li key={e.href}>
              <Link
                href={e.href}
                aria-current={actual ? 'page' : undefined}
                className={`relative flex min-h-[clamp(3rem,7.2vh,4.4rem)] items-center gap-[clamp(0.875rem,1.5vw,1.5rem)] pr-3 pl-[clamp(1.25rem,1.9vw,1.875rem)] text-[clamp(1rem,0.85rem+0.25vw,1.125rem)] transition-colors before:absolute before:inset-y-1 before:left-0 before:w-[0.2rem] hover:text-accent ${
                  actual ? 'font-semibold text-accent before:bg-accent' : 'text-ink'
                }`}
              >
                <IconoPoster nombre={e.icono} className="size-[1.4rem]" />
                {e.etiqueta}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="grid h-full auto-cols-fr grid-flow-col">
      {enlaces
        .filter((e) => !e.soloLateral)
        .map((e) => {
          const actual = esActual(pathname, e.href);
          return (
            <li key={e.href} className="flex">
              <Link
                href={e.href}
                aria-current={actual ? 'page' : undefined}
                className={`flex flex-1 flex-col items-center justify-center gap-1 text-[clamp(0.75rem,0.68rem+0.35vw,0.9375rem)] ${
                  actual ? 'font-bold text-accent' : 'text-ink'
                }`}
              >
                <IconoPoster
                  nombre={e.icono}
                  className="size-[clamp(1.375rem,1.2rem+0.8vw,1.75rem)]"
                />
                {e.etiqueta}
              </Link>
            </li>
          );
        })}
    </ul>
  );
}
