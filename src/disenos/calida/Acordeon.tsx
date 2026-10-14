import { Icon } from '@/components/Icon';

/**
 * Preguntas frecuentes en acordeón con `<details>`/`<summary>` (accesible y funciona sin
 * JavaScript): la pregunta en serifa y un botón redondo «+» que gira a «×» y se pinta naranja al
 * abrir; la respuesta aparece suave (tema.css).
 */
export function Acordeon({ preguntas }: { preguntas: { pregunta: string; respuesta: string }[] }) {
  return (
    <div className="border-t border-line">
      {preguntas.map((p) => (
        <details key={p.pregunta} className="calida-acordeon group border-b border-line">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-4 [&::-webkit-details-marker]:hidden">
            <span className="min-w-0 font-display text-[clamp(1.25rem,1.1rem+0.6vw,1.625rem)] leading-tight text-ink">
              {p.pregunta}
            </span>
            <span
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-full text-accent-strong ring-1 ring-line transition-colors group-open:bg-accent group-open:text-cream group-open:ring-accent"
            >
              <Icon
                name="plus"
                className="size-5 transition-transform duration-300 group-open:rotate-45"
              />
            </span>
          </summary>
          <div className="calida-acordeon-cuerpo pr-[clamp(0rem,6vw,3.5rem)] pb-5">
            <p className="text-[clamp(1rem,0.96rem+0.25vw,1.125rem)] leading-normal text-ink-soft">
              {p.respuesta}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
