import Image from 'next/image';
import { QUE_ESPERAR } from '@/disenos/contenido';
import { CabeceraSeccion, Numero, Titulo } from '../piezas';

/**
 * «Qué esperar» como grilla de periódico: la foto de la bienvenida a la izquierda (a todo el
 * alto en una página ancha) y los cuatro momentos del culto numerados en cajas que se invierten
 * al pasar el cursor.
 */
export function QueEsperar() {
  return (
    <section id="que-esperar" aria-labelledby="que-esperar-titulo" className="flex flex-col gap-1">
      <CabeceraSeccion
        id="que-esperar-titulo"
        lema="Tu primer domingo"
        titulo={
          <>
            Qué <em>esperar</em>
          </>
        }
      />
      <div className="grid gap-1 @2xl/pagina:grid-cols-2 @5xl/pagina:grid-cols-[minmax(0,1.15fr)_repeat(2,minmax(0,1fr))]">
        <div className="group relative min-h-[clamp(14rem,50vw,22rem)] overflow-hidden border-2 border-ink @2xl/pagina:col-span-2 @5xl/pagina:col-span-1 @5xl/pagina:row-span-2">
          <Image
            src="/disenos/poster/saludo.webp"
            alt="Un joven del equipo de bienvenida saluda a una familia en la entrada"
            fill
            sizes="(min-width: 80rem) 30vw, 100vw"
            className="d-foto object-cover"
          />
        </div>
        {QUE_ESPERAR.map((q, n) => (
          <article
            key={q.titulo}
            className="d-invierte @container grid reveal grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 border-2 border-(--inv-borde) p-[clamp(1rem,6cqi,1.75rem)] @2xl/pagina:flex @2xl/pagina:flex-col @2xl/pagina:gap-[clamp(0.75rem,5cqi,1.25rem)]"
          >
            <Numero className="row-span-2 text-[clamp(2.75rem,16cqi,4.5rem)] text-(--inv-acento) @2xl/pagina:text-[clamp(2.75rem,20cqi,4.5rem)]">
              {String(n + 1).padStart(2, '0')}
            </Numero>
            <Titulo as="h3" estilo="condensado" className="text-[clamp(1.375rem,8cqi,2.25rem)]">
              {q.titulo}
            </Titulo>
            <p className="leading-snug text-(--inv-suave)">{q.texto}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
