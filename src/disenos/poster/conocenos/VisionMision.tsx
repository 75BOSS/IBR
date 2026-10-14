import { Lema, Titulo } from '../piezas';

/**
 * Visión y misión (de la configuración) como dos carteles: la visión en azul noche y la misión en
 * rojo, cada una con su palabra enorme y el texto como cita. Si falta una, la otra ocupa todo el
 * ancho; sin ninguna, no se dibuja.
 */
export function VisionMision({ vision, mision }: { vision: string | null; mision: string | null }) {
  const carteles = [
    vision && { clave: 'vision', titulo: 'Visión', texto: vision, tono: 'bg-(--d-noche)' },
    mision && { clave: 'mision', titulo: 'Misión', texto: mision, tono: 'bg-accent' },
  ].filter((c) => c !== null && c !== '');
  if (carteles.length === 0) return null;
  return (
    <section
      aria-label="Visión y misión"
      className="grid gap-1 @4xl/pagina:auto-cols-fr @4xl/pagina:grid-flow-col"
    >
      {carteles.map((c) => (
        <article
          key={c.clave}
          aria-labelledby={`${c.clave}-titulo`}
          className={`@container flex flex-col justify-between gap-[clamp(1.5rem,6cqi,3rem)] p-[clamp(1.25rem,6cqi,3rem)] text-canvas on-dark ${c.tono}`}
        >
          <div className="flex items-end justify-between gap-4 border-b-2 border-canvas/70 pb-3">
            <Titulo
              id={`${c.clave}-titulo`}
              estilo="negro"
              className="pt-[0.1em] text-[clamp(2.75rem,19cqi,6.5rem)] font-stretch-[75%]"
            >
              {c.titulo}
            </Titulo>
            <Lema as="span" tamano="text-[0.75rem]" className="pb-2">
              {c.clave === 'vision' ? 'A dónde vamos' : 'Lo que hacemos'}
            </Lema>
          </div>
          <p className="font-display text-[clamp(1.5rem,7cqi,2.75rem)] leading-[1.05] font-extrabold tracking-[-0.015em] text-balance font-stretch-[85%]">
            {c.texto}
          </p>
        </article>
      ))}
    </section>
  );
}
