import { Icon } from '@/components/Icon';

/**
 * Preguntas frecuentes en acordeón: `<details>`/`<summary>` (se abre con clic, Enter o Espacio
 * y el lector de pantalla anuncia si está abierta; funciona sin JavaScript). Cada pregunta en la
 * sans gruesa con una cruz que gira al abrir. `oscuro` para fondos negros o rojos.
 */
export function Acordeon({
  preguntas,
  oscuro = false,
}: {
  preguntas: readonly { pregunta: string; respuesta: string }[];
  oscuro?: boolean;
}) {
  return (
    <ul className={`border-b-2 ${oscuro ? 'border-canvas/40' : 'border-ink'}`}>
      {preguntas.map((p) => (
        <li key={p.pregunta} className={`border-t-2 ${oscuro ? 'border-canvas/40' : 'border-ink'}`}>
          <details className="group/pregunta">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-[clamp(0.875rem,2vw,1.25rem)] [&::-webkit-details-marker]:hidden">
              <span className="font-display text-[clamp(1.1875rem,1rem+0.8vw,1.625rem)] leading-tight font-black tracking-[-0.03em] [overflow-wrap:anywhere]">
                {p.pregunta}
              </span>
              <span
                aria-hidden="true"
                className={`grid size-10 shrink-0 place-items-center rounded-full transition-[rotate,background-color] duration-300 group-open/pregunta:rotate-45 ${
                  oscuro
                    ? 'bg-canvas text-ink'
                    : 'bg-accent text-canvas group-hover/pregunta:bg-accent-strong'
                }`}
              >
                <Icon name="plus" className="size-5" />
              </span>
            </summary>
            <p
              className={`max-w-[60ch] pb-[clamp(1rem,2.5vw,1.5rem)] text-[clamp(1rem,0.95rem+0.25vw,1.125rem)] leading-relaxed ${
                oscuro ? 'text-(--d-crema-tenue)' : 'text-ink-soft'
              }`}
            >
              {p.respuesta}
            </p>
          </details>
        </li>
      ))}
    </ul>
  );
}
