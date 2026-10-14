import Link from 'next/link';
import { Icon } from '@/components/Icon';
import type { PasoCamino } from './menu';

/**
 * «Tu siguiente paso» como un camino de cinco pasos (RUTA_CRECER). Mide su contenedor: angosto,
 * los pasos bajan sobre una línea vertical como la línea de tiempo; ancho, cinco columnas unidas
 * por una línea horizontal. La línea se dibuja al hacer scroll y cada círculo se enciende en rojo
 * al pasar (tema.css). Cada paso es un enlace (ancla de Crecer, Grupos, Servir o Contacto).
 * `resumido` deja solo el título y la acción (inicio y comunidad).
 */
export function Camino({ pasos, resumido = false }: { pasos: PasoCamino[]; resumido?: boolean }) {
  return (
    <div className="@container relative">
      <span
        aria-hidden="true"
        className="d-trazo-x absolute top-6 right-[10%] left-[10%] hidden h-0.5 -translate-y-1/2 bg-(--d-rojo)/75 @4xl:block"
      />
      <ol className="grid @4xl:grid-cols-5 @4xl:gap-x-[clamp(0.75rem,2cqi,1.75rem)]">
        {pasos.map((paso, i) => (
          <li key={paso.numero} className="d-paso relative pb-[clamp(1.25rem,5cqi,2rem)] @4xl:pb-0">
            {i < pasos.length - 1 && (
              <span
                aria-hidden="true"
                className="d-trazo-y absolute top-6 -bottom-6 left-6 w-0.5 -translate-x-1/2 bg-(--d-rojo)/75 @4xl:hidden"
              />
            )}
            <Link
              href={paso.href}
              className="group grid grid-cols-[3rem_minmax(0,1fr)] gap-x-[clamp(1rem,4cqi,1.5rem)] rounded-2xl @4xl:grid-cols-1 @4xl:justify-items-center @4xl:gap-y-4 @4xl:text-center"
            >
              <span
                aria-hidden="true"
                className="d-circulo relative z-10 grid size-12 place-items-center rounded-full border-2 border-(--d-rojo) bg-(--d-rojo) font-display text-[1.25rem] font-bold text-cream ring-[6px] ring-canvas"
              >
                {paso.numero}
              </span>
              <span className="flex min-w-0 flex-col items-start gap-1.5 pt-2 @4xl:items-center @4xl:pt-0">
                <span className="font-headline text-[clamp(1.25rem,1.05rem+1cqi,1.5rem)] leading-tight font-extrabold tracking-[-0.03em] text-ink transition-colors group-hover:text-accent">
                  {paso.titulo}
                </span>
                {!resumido && (
                  <span className="max-w-[24rem] text-[clamp(0.97rem,0.94rem+0.2cqi,1.0625rem)] text-ink-soft">
                    {paso.texto}
                  </span>
                )}
                <span className="mt-1 inline-flex min-h-9 items-center gap-2 font-semibold text-accent underline decoration-1 underline-offset-[0.3em] group-hover:decoration-2">
                  {paso.accion}
                  <Icon
                    name="arrowRight"
                    className="size-5 shrink-0 transition-transform motion-safe:group-hover:translate-x-1"
                  />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
