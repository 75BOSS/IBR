import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { RUTA_CRECER } from '@/disenos/contenido';
import type { SiteContent } from '@/lib/nav';
import { Numero, Titulo } from '../piezas';
import { destinoPaso } from '../SiguientePaso';

/** Escalera: en una página ancha cada paso sube un escalón respecto del anterior. */
const ESCALON = [
  '@5xl/pagina:mt-[12cqi]',
  '@5xl/pagina:mt-[9cqi]',
  '@5xl/pagina:mt-[6cqi]',
  '@5xl/pagina:mt-[3cqi]',
  '@5xl/pagina:mt-0',
];

/**
 * La ruta de crecimiento como una escalera de cinco escalones (página ancha) o una lista con
 * su línea a la izquierda (angosta). Cada escalón: número enorme, paso, explicación y su acción
 * (las anclas bajan a su sección de esta página; Grupos y Servir solo si tienen contenido).
 * Se invierten al pasar el cursor; el último, «Sirve», es la cima en rojo.
 */
export function Ruta({ content }: { content: SiteContent }) {
  return (
    <section aria-labelledby="ruta-titulo" className="flex flex-col gap-4">
      <h2 id="ruta-titulo" className="sr-only">
        La ruta en cinco pasos
      </h2>
      <ol className="grid gap-1 @5xl/pagina:grid-cols-5 @5xl/pagina:items-start">
        {RUTA_CRECER.map((p, n) => {
          const cima = n === RUTA_CRECER.length - 1;
          return (
            <li key={p.numero} className={`flex ${ESCALON[n] ?? ''}`}>
              <Link
                href={destinoPaso(p, content, true)}
                className={`group @container flex flex-1 flex-col gap-[clamp(0.75rem,5cqi,1.25rem)] p-[clamp(1.125rem,7cqi,1.75rem)] ${
                  cima
                    ? 'bg-accent text-canvas on-dark'
                    : 'd-invierte border-2 border-(--inv-borde)'
                }`}
              >
                <span className="flex items-end justify-between gap-3 border-b-2 border-current pb-2">
                  <Numero className="text-[clamp(3rem,22cqi,6.5rem)]">{p.numero}</Numero>
                  <span className="pb-2 font-display text-[0.75rem] font-bold tracking-[0.3em] uppercase">
                    Paso
                  </span>
                </span>
                <Titulo as="h3" estilo="condensado" className="text-[clamp(1.5rem,12cqi,2.25rem)]">
                  {p.titulo}
                </Titulo>
                <span
                  className={`flex-1 leading-snug ${cima ? 'text-canvas/90' : 'text-(--inv-suave)'}`}
                >
                  {p.texto}
                </span>
                <span
                  className={`flex items-center gap-2 font-display text-[clamp(1rem,7cqi,1.1875rem)] font-bold font-stretch-[92%] ${
                    cima ? '' : 'text-(--inv-acento)'
                  }`}
                >
                  {p.accion}
                  <Icon name="arrowRight" className="d-flecha size-[1.1em]" />
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
