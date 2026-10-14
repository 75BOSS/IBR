import { DEVOCIONALES } from '@/disenos/contenido';
import { Pestanas } from '../movimiento/Pestanas';
import { CabeceraSeccion, Lema, Titulo } from '../piezas';

/** «Miércoles» → «Mié» para la barra angosta. */
const corta = (dia: string) => dia.slice(0, 3);

/**
 * Devocionales de la semana (#devocionales, EJEMPLO): pestañas Semana · Lun · Mar… con el bloque
 * rojo que se desliza hasta el día elegido. «Semana» muestra los cinco días en columnas de
 * periódico; un día solo ocupa todo el ancho (auto-fit) y se lee en grande. Sin JavaScript se
 * ven todos.
 */
export function Devocionales() {
  return (
    <section
      id="devocionales"
      aria-labelledby="devocionales-titulo"
      className="flex flex-col gap-1"
    >
      <CabeceraSeccion
        id="devocionales-titulo"
        lema="Plan de lectura"
        titulo={
          <>
            Un pasaje <em>por día</em>
          </>
        }
      />
      <Pestanas
        etiqueta="Día del devocional"
        todos="Semana"
        claseLista="grid gap-1 @3xl/pagina:grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]"
        claseItem="flex"
        opciones={DEVOCIONALES.map((d) => ({
          clave: d.dia,
          etiqueta: d.dia,
          corta: corta(d.dia),
          contenido: (
            <article className="d-invierte @container flex flex-1 flex-col gap-[clamp(0.625rem,4cqi,1.25rem)] border-2 border-(--inv-borde) p-[clamp(1rem,6cqi,2.5rem)]">
              <Lema
                as="span"
                tamano="text-[clamp(0.6875rem,3cqi,0.875rem)]"
                className="text-(--inv-acento)"
              >
                {d.dia}
              </Lema>
              <span className="font-display text-[clamp(1.625rem,10cqi,4.5rem)] leading-[0.9] font-black tracking-[-0.02em] text-(--inv-acento) font-stretch-[75%]">
                {d.pasaje}
              </span>
              <Titulo as="h3" estilo="condensado" className="text-[clamp(1.25rem,8cqi,3rem)]">
                {d.titulo}
              </Titulo>
              <p className="text-[clamp(0.9688rem,4cqi,1.375rem)] leading-snug text-(--inv-suave)">
                {d.texto}
              </p>
            </article>
          ),
        }))}
      />
    </section>
  );
}
