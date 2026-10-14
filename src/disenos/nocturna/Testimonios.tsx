import { TESTIMONIOS } from '../contenido';
import { ZonaBrillo } from './efectos';
import { CONTENEDOR, CURSIVA, Foto, TituloSeccion, iniciales } from './ui';

/**
 * «Historias de familia»: un testimonio grande sobre la foto (con la itálica durazno de la
 * propuesta) y los demás en tarjetas con las iniciales. Lo usan el inicio y Recursos
 * (id="testimonios", destino del menú).
 */
export function Testimonios({ id }: { id: string }) {
  const [principal, ...resto] = TESTIMONIOS;
  if (!principal) return null;
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="bg-canvas text-ink">
      <ZonaBrillo
        className={`${CONTENEDOR} grid gap-[clamp(2rem,4vw,3.5rem)] py-[clamp(3rem,8vw,6rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center`}
      >
        <div className="flex flex-col gap-[clamp(1.5rem,3vw,2.25rem)]">
          <TituloSeccion
            id={`${id}-titulo`}
            etiqueta="Testimonios"
            intro="Personas de distintos barrios de Riobamba que llegaron sin conocer a nadie y encontraron una familia."
          >
            Historias de <em>familia.</em>
          </TituloSeccion>
          <ul className="flex flex-col gap-3">
            {resto.map((t) => (
              <li
                key={t.nombre}
                className="d-brillo d-brillo-claro d-aparece flex gap-[clamp(0.875rem,2vw,1.25rem)] rounded-xl bg-surface p-[clamp(1rem,2.2vw,1.375rem)] ring-1 ring-line"
              >
                <span
                  aria-hidden="true"
                  className="grid size-12 shrink-0 place-items-center rounded-full bg-brand font-display font-bold text-peach"
                >
                  {iniciales(t.nombre)}
                </span>
                <figure className="flex min-w-0 flex-col gap-1.5">
                  <blockquote className="leading-snug text-ink">«{t.texto}»</blockquote>
                  <figcaption className="text-sm text-ink-soft">
                    <span className="font-semibold text-ink">{t.nombre}</span> · {t.barrio}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
        <figure className="d-brillo d-aparece relative isolate flex min-h-[clamp(24rem,52vw,34rem)] flex-col justify-end overflow-hidden rounded-2xl bg-(--d-tinta) p-[clamp(1.5rem,4vw,2.75rem)] text-cream on-dark">
          <Foto
            src="abrazo-risas.webp"
            sizes="(min-width: 64rem) 48vw, 100vw"
            capa
            encuadre="object-[50%_30%]"
            className="inset-0 -z-10"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-t from-(--d-tinta) from-25% via-(--d-tinta)/75 to-(--d-tinta)/10"
          />
          <span
            aria-hidden="true"
            className={`text-[clamp(4.5rem,9vw,7rem)] leading-[0.6] text-peach ${CURSIVA}`}
          >
            “
          </span>
          <blockquote
            className={`mt-2 text-[clamp(1.5rem,1.05rem+1.7vw,2.5rem)] leading-[1.15] break-words ${CURSIVA}`}
          >
            {principal.texto}
          </blockquote>
          <figcaption className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span aria-hidden="true" className="h-px w-8 bg-peach" />
            <span className="font-display font-semibold">{principal.nombre}</span>
            <span className="text-cream/75">· {principal.barrio}</span>
          </figcaption>
        </figure>
      </ZonaBrillo>
    </section>
  );
}
