import Link from 'next/link';

export type Etiqueta = { href: string; nombre: string; nota?: string | null };

/** Cuántas etiquetas caben sin alargar la fila: angosta (celular) y ancha (escritorio). */
const CABEN_ANGOSTA = 3;

/**
 * Los grupos, ministerios o áreas reales de una fila de Comunidad, como etiquetas con borde
 * (cada una lleva a su página). En la fila angosta muestra 3 y en la ancha hasta `maximo`
 * (según el contenedor de la fila, `@3xl`); el resto se enlaza a la página completa.
 */
export function Etiquetas({
  items,
  verTodos,
  maximo = 5,
}: {
  items: Etiqueta[];
  verTodos: { href: string; texto: string };
  maximo?: number;
}) {
  const restoAngosta = items.length - CABEN_ANGOSTA;
  const restoAncha = items.length - maximo;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.slice(0, maximo).map((i, n) => (
        <li key={i.href} className={n >= CABEN_ANGOSTA ? 'hidden @3xl:block' : ''}>
          <Link
            href={i.href}
            className="inline-flex min-h-9 items-center gap-1.5 border border-ink bg-canvas px-2.5 py-1 text-[0.875rem] leading-tight font-semibold transition-colors hover:bg-ink hover:text-canvas"
          >
            {i.nombre}
            {i.nota && <span className="font-normal opacity-75">· {i.nota}</span>}
          </Link>
        </li>
      ))}
      {restoAngosta > 0 && (
        <li className={restoAncha > 0 ? '' : '@3xl:hidden'}>
          <Link
            href={verTodos.href}
            className="inline-flex min-h-9 items-center px-1 text-[0.875rem] link"
          >
            <span className="@3xl:hidden">
              y {restoAngosta} {verTodos.texto}
            </span>
            <span className="hidden @3xl:inline">
              y {restoAncha} {verTodos.texto}
            </span>
          </Link>
        </li>
      )}
    </ul>
  );
}
