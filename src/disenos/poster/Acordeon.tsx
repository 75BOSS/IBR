import { Icon } from '@/components/Icon';
import type { Pregunta } from '@/disenos/contenido';

/**
 * Preguntas frecuentes en acordeón con `<details>`/`<summary>` (accesible y funciona sin
 * JavaScript): filas separadas por rayas azul marino, la pregunta en la letra del titular y un
 * cuadro con + que gira a × al abrir. Al pasar el cursor la fila se pone durazno.
 */
export function Acordeon({
  preguntas,
  className = '',
}: {
  preguntas: Pregunta[];
  className?: string;
}) {
  return (
    <div className={`flex flex-col border-t-2 border-ink ${className}`}>
      {preguntas.map((p) => (
        <details key={p.pregunta} className="d-acordeon group border-b-2 border-ink">
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-[clamp(0.25rem,1.5vw,1rem)] py-3 transition-colors group-open:text-accent-strong hover:bg-(--d-arena) focus-visible:outline-offset-[-3px]">
            <span className="font-display text-[clamp(1.125rem,1rem+0.7vw,1.625rem)] leading-tight font-extrabold font-stretch-[85%]">
              {p.pregunta}
            </span>
            <span className="d-mas grid size-9 shrink-0 place-items-center border-2 border-current">
              <Icon name="plus" strokeWidth={2.75} className="size-5" />
            </span>
          </summary>
          <p className="max-w-[60ch] px-[clamp(0.25rem,1.5vw,1rem)] pb-5 text-[clamp(1rem,0.95rem+0.25vw,1.125rem)] leading-relaxed text-ink-soft">
            {p.respuesta}
          </p>
        </details>
      ))}
    </div>
  );
}
