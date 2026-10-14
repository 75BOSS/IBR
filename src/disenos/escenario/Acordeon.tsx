import { Icon } from '@/components/Icon';
import type { Pregunta } from '@/disenos/contenido';

/**
 * Preguntas frecuentes en acordeón nativo (<details>/<summary>: teclado, lectores de pantalla y
 * sin JavaScript). El «+» rojo gira a «×» al abrir y se llena de rojo. `nombre` agrupa los de una
 * misma lista para que se abra uno a la vez.
 */
export function Acordeon({ preguntas, nombre }: { preguntas: Pregunta[]; nombre: string }) {
  return (
    <ul className="border-t border-line">
      {preguntas.map((p) => (
        <li key={p.pregunta} className="border-b border-line">
          <details name={nombre} className="group">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-[clamp(1.0625rem,1rem+0.35vw,1.25rem)] leading-snug font-bold text-ink transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 [overflow-wrap:anywhere]">{p.pregunta}</span>
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-sunken text-accent transition duration-300 group-open:rotate-45 group-open:bg-(--d-rojo) group-open:text-cream"
              >
                <Icon name="plus" className="size-5" />
              </span>
            </summary>
            <p className="max-w-[42rem] pr-12 pb-5 text-[clamp(1rem,0.97rem+0.15vw,1.0625rem)] text-ink-soft">
              {p.respuesta}
            </p>
          </details>
        </li>
      ))}
    </ul>
  );
}
