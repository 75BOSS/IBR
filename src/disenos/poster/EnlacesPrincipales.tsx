'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PESTANAS, esActual } from './enlaces';
import { IconoPoster } from './IconoPoster';

/**
 * Pestañas de la barra fija del celular (imagen 15) con la actual en rojo. Es cliente solo para
 * saber la ruta actual.
 */
export function EnlacesPrincipales() {
  const pathname = usePathname();
  return (
    <ul className="grid h-full auto-cols-fr grid-flow-col">
      {PESTANAS.map((e) => {
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
