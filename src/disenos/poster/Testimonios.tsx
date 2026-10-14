import { TESTIMONIOS } from '@/disenos/contenido';
import { CabeceraSeccion, Lema } from './piezas';

/** El testimonio grande ocupa tantos renglones como testimonios hay a su lado. */
const ALTO_PRIMERO: Record<number, string> = {
  2: '@3xl:row-span-2',
  3: '@3xl:row-span-3',
};

/**
 * Testimonios como citas de periódico: el primero grande sobre durazno (a la izquierda, a todo
 * el alto, en una sección ancha) y los demás apilados en cajas con borde que se invierten al
 * pasar el cursor. Texto de
 * EJEMPLO (contenido.ts): la iglesia debe reemplazarlo por historias reales con permiso.
 */
export function Testimonios({
  id = 'testimonios',
  cantidad = TESTIMONIOS.length,
  accion,
  className = '',
}: {
  id?: string;
  cantidad?: number;
  accion?: { href: string; texto: string };
  className?: string;
}) {
  const [primero, ...resto] = TESTIMONIOS.slice(0, cantidad);
  if (!primero) return null;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className={`flex flex-col gap-1 ${className}`}
    >
      <CabeceraSeccion
        id={`${id}-titulo`}
        lema="Historias de la familia"
        titulo={
          <>
            Vidas <em>cambiadas</em>
          </>
        }
        accion={accion}
      />
      <ul className="@container grid gap-1 @3xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <li className={`flex ${ALTO_PRIMERO[resto.length] ?? ''}`}>
          <figure className="flex flex-1 flex-col justify-between gap-6 bg-(--d-durazno) p-[clamp(1.25rem,4cqi,2.5rem)]">
            <span
              aria-hidden="true"
              className="font-display text-[clamp(5rem,14cqi,9rem)] leading-[0.6] font-black text-accent-strong"
            >
              “
            </span>
            <blockquote className="font-display text-[clamp(1.5rem,5.2cqi,2.75rem)] leading-[1.05] font-extrabold tracking-[-0.015em] text-balance font-stretch-[82%] @3xl:text-[clamp(1.75rem,3.6cqi,3rem)]">
              {primero.texto}
            </blockquote>
            <figcaption>
              <Lema as="span" className="text-accent-strong">
                {primero.nombre} · {primero.barrio}
              </Lema>
            </figcaption>
          </figure>
        </li>
        {resto.map((t) => (
          <li key={t.nombre} className="flex reveal">
            <figure className="d-invierte flex flex-1 flex-col gap-4 border-2 border-(--inv-borde) p-[clamp(1.125rem,4cqi,1.75rem)]">
              <span
                aria-hidden="true"
                className="font-display text-[4.5rem] leading-[0.55] font-black text-(--inv-acento)"
              >
                “
              </span>
              <blockquote className="flex-1 text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] leading-snug font-semibold">
                {t.texto}
              </blockquote>
              <figcaption>
                <Lema as="span" tamano="text-[0.75rem]" className="text-(--inv-acento)">
                  {t.nombre} · {t.barrio}
                </Lema>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
