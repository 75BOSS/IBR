import Image from 'next/image';
import type { Creencia } from '@/lib/config-fields';
import { Lema, Numero, Raya, Titulo } from '../piezas';

/**
 * «En qué creemos» (lo que la iglesia escribió en el panel): a la izquierda el titular y una
 * foto de adoración que acompaña al leer (fija en una página ancha); a la derecha cada creencia
 * numerada como un artículo, con una raya roja que se dibuja al pasar el cursor. Sin creencias
 * cargadas, la sección no existe (y el menú no la enlaza).
 */
export function Creencias({ creencias }: { creencias: Creencia[] }) {
  if (creencias.length === 0) return null;
  return (
    <section
      id="creemos"
      aria-labelledby="creemos-titulo"
      className="grid gap-[clamp(1.5rem,4cqi,3rem)] @4xl/pagina:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] @4xl/pagina:items-start"
    >
      <div className="flex flex-col gap-4 @4xl/pagina:sticky @4xl/pagina:top-6">
        <Lema className="text-accent">Nuestra fe</Lema>
        <Titulo
          id="creemos-titulo"
          estilo="negro"
          className="pt-[0.1em] text-[clamp(2.5rem,13cqi,6rem)] font-stretch-[80%] @4xl/pagina:text-[6.6cqi]"
        >
          En qué <em>creemos</em>
        </Titulo>
        <Raya />
        <div className="group relative hidden aspect-[16/10] overflow-hidden border-2 border-ink @4xl/pagina:block">
          <Image
            src="/disenos/poster/adoracion.webp"
            alt="Personas adoran con los ojos cerrados durante un culto"
            fill
            sizes="30vw"
            className="d-foto object-cover"
          />
        </div>
      </div>
      <ol className="flex flex-col border-t-2 border-ink">
        {creencias.map((c, n) => (
          <li
            key={n}
            className="d-fila grid grid-cols-[auto_minmax(0,1fr)] gap-x-[clamp(1rem,3cqi,2rem)] border-b-2 border-ink py-[clamp(1rem,2.5cqi,1.75rem)]"
          >
            <Numero className="text-[clamp(2.25rem,8cqi,3.5rem)] text-accent">
              {String(n + 1).padStart(2, '0')}
            </Numero>
            <div className="flex flex-col gap-1.5">
              {c.titulo && (
                <Titulo
                  as="h3"
                  estilo="condensado"
                  className="text-[clamp(1.375rem,1.1rem+1.2vw,2.25rem)]"
                >
                  {c.titulo}
                </Titulo>
              )}
              <p className="max-w-[62ch] text-[clamp(1rem,0.95rem+0.25vw,1.1875rem)] leading-relaxed text-ink-soft">
                {c.texto}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
