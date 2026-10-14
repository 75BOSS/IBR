import { Icon } from '@/components/Icon';

/**
 * Índice «En esta página» como fila de casillas de periódico: cada ministerio con sus edades;
 * al pasar el cursor la casilla se invierte y la flecha baja. Lleva a la sección (#slug).
 */
export function IndiceAnclas({
  anclas,
}: {
  anclas: { href: string; nombre: string; nota: string | null }[];
}) {
  if (anclas.length === 0) return null;
  return (
    <nav aria-label="Ministerios en esta página">
      <ul className="grid grid-cols-2 gap-1 @2xl/pagina:grid-cols-4">
        {anclas.map((a) => (
          <li key={a.href} className="flex">
            <a
              href={a.href}
              className="group d-invierte flex flex-1 items-center justify-between gap-2 border-2 border-(--inv-borde) px-[clamp(0.625rem,1.5vw,1rem)] py-2.5"
            >
              <span className="flex min-w-0 flex-col">
                <span className="font-display text-[clamp(1rem,0.9rem+0.5vw,1.375rem)] leading-tight font-extrabold hyphens-auto font-stretch-[85%]">
                  {a.nombre}
                </span>
                {a.nota && <span className="text-[0.8125rem] text-(--inv-suave)">{a.nota}</span>}
              </span>
              <Icon
                name="arrowRight"
                className="size-4 shrink-0 rotate-90 text-(--inv-acento) motion-safe:transition-transform motion-safe:group-hover:translate-y-1"
              />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
