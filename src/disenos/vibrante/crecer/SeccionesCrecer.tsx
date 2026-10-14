import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import type { BAUTISMO, Curso, SALVACION } from '@/disenos/contenido';
import { Acordeon } from '@/disenos/vibrante/Acordeon';
import { Inclinable } from '@/disenos/vibrante/animacion/Inclinable';
import { botonClases } from '@/disenos/vibrante/boton';
import { Foto } from '@/disenos/vibrante/Foto';
import { FOTOS } from '@/disenos/vibrante/fotos';
import { CabeceraSeccion, Seccion } from '@/disenos/vibrante/Seccion';
import type { Area } from '@/lib/servir';

/**
 * «Un nuevo comienzo» (SALVACION, fondo negro): el mensaje a la izquierda y, a la derecha, la
 * oración destacada en un bloque rojo con la itálica grande; debajo, «cuéntanos».
 */
export function Salvacion({ salvacion }: { salvacion: typeof SALVACION }) {
  return (
    <Seccion tono="negro" id="salvacion" tituloId="salvacion-titulo">
      <div className="grid items-center gap-[clamp(2rem,5vw,4.5rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <CabeceraSeccion
          oscuro
          etiqueta="Salvación"
          id="salvacion-titulo"
          tamano="columna"
          lineas={['Un nuevo', <em key="comienzo">comienzo.</em>]}
          texto={salvacion.texto}
        />
        <div className="flex flex-col gap-4">
          <Inclinable
            as="figure"
            grados={4}
            cursor={null}
            className="@container flex flex-col gap-4 rounded-[0.5rem] bg-accent p-[clamp(1.5rem,7cqi,3rem)] text-canvas on-dark"
          >
            <figcaption className="eyebrow">Una oración para empezar</figcaption>
            <blockquote className="font-script text-[clamp(1.625rem,7.5cqi,2.75rem)] leading-[1.15] text-balance italic">
              <p>«{salvacion.oracion}»</p>
            </blockquote>
          </Inclinable>
          <p className="max-w-[48ch] text-[clamp(1rem,0.95rem+0.25vw,1.125rem)] leading-snug text-(--d-crema-tenue)">
            {salvacion.siguiente}
          </p>
          <Link
            href="/contacto#mensaje"
            className={botonClases({ variante: 'crema', className: 'self-start' })}
          >
            Hice esta oración <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>
      </div>
    </Seccion>
  );
}

/**
 * «El bautismo» (BAUTISMO): foto con el aviso de la próxima fecha (de ejemplo), el texto y las
 * preguntas en acordeón.
 */
export function Bautismo({ bautismo }: { bautismo: typeof BAUTISMO }) {
  return (
    <Seccion id="bautismo" tituloId="bautismo-titulo">
      <div className="grid gap-[clamp(2rem,5vw,4.5rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="relative self-start">
          <Foto
            foto={FOTOS.bautismo}
            sizes="(min-width: 64rem) 40vw, 100vw"
            className="aspect-[4/3] rounded-[0.75rem] lg:aspect-[4/5]"
          />
          <p className="absolute right-[clamp(0.75rem,3vw,1.25rem)] bottom-[clamp(0.75rem,3vw,1.25rem)] left-[clamp(0.75rem,3vw,1.25rem)] flex items-start gap-3 rounded-[0.5rem] bg-(--d-negro-hondo) p-[clamp(0.875rem,3vw,1.25rem)] text-canvas on-dark">
            <Icon name="calendar" className="mt-0.5 size-6 text-(--d-rojo-vivo)" />
            <span className="font-semibold">{bautismo.proximo}</span>
          </p>
        </div>
        <div className="flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)]">
          <CabeceraSeccion
            etiqueta="Bautismo"
            id="bautismo-titulo"
            lineas={['Declara', <em key="fe">tu fe.</em>]}
            texto={bautismo.texto}
          >
            <Link
              href="/contacto#mensaje"
              className={botonClases({ className: 'mt-1 self-start' })}
            >
              Quiero bautizarme <Icon name="arrowRight" className="size-4" />
            </Link>
          </CabeceraSeccion>
          <Acordeon preguntas={bautismo.preguntas} />
        </div>
      </div>
    </Seccion>
  );
}

/**
 * Escuela de Discipulado (CURSOS, como los módulos de CIEM): cuatro módulos en orden, el primero
 * destacado en negro; cada uno con su duración. Se inclinan con el cursor.
 */
export function Formacion({ cursos }: { cursos: Curso[] }) {
  return (
    <Seccion tono="hundido" id="formacion" tituloId="formacion-titulo">
      <div className="grid gap-[clamp(2rem,5vw,3.5rem)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <CabeceraSeccion
            etiqueta="Formación"
            id="formacion-titulo"
            lineas={['Escuela de', <em key="discipulado">Discipulado.</em>]}
            texto="Bases firmes en la fe, paso a paso y en comunidad. Cada módulo se abre varias veces al año."
            className="max-w-[42rem] min-w-[min(100%,18rem)] flex-1"
          />
          <Link href="/contacto#mensaje" className={botonClases({ tamano: 'lg' })}>
            Inscribirme <Icon name="arrowRight" className="size-5" />
          </Link>
        </div>
        <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {cursos.map((c, i) => {
            const primero = i === 0;
            return (
              <li key={c.titulo} className="flex">
                <Inclinable
                  cursor={null}
                  className={`@container flex flex-1 flex-col gap-4 rounded-[0.5rem] p-[clamp(1.25rem,7cqi,2rem)] ${
                    primero
                      ? 'bg-(--d-negro-hondo) text-canvas on-dark'
                      : 'bg-surface ring-1 ring-line'
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className={`caps ${primero ? 'text-(--d-rojo-vivo)' : 'text-accent'}`}>
                      Módulo {i + 1}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-bold ${
                        primero ? 'bg-canvas text-ink' : 'bg-sunken text-ink'
                      }`}
                    >
                      {c.duracion}
                    </span>
                  </span>
                  <h3 className="font-display text-[clamp(1.625rem,12cqi,2.25rem)] leading-[1] font-black tracking-[-0.04em] text-balance [overflow-wrap:anywhere]">
                    {c.titulo}
                  </h3>
                  <p
                    className={`mt-auto leading-snug ${primero ? 'text-(--d-crema-tenue)' : 'text-ink-soft'}`}
                  >
                    {c.texto}
                  </p>
                  <span
                    aria-hidden="true"
                    className={`h-1.5 rounded-full ${primero ? 'bg-(--d-rojo-vivo)' : 'bg-accent'}`}
                  />
                </Inclinable>
              </li>
            );
          })}
        </ol>
      </div>
    </Seccion>
  );
}

/**
 * «Sirve con tus dones» (fondo negro): las áreas de servicio reales con su foto; cada una lleva
 * a Servir con el área elegida (si Servir tiene contenido) o a escribirnos.
 */
export function ServirAreas({ areas, verServir }: { areas: Area[]; verServir: boolean }) {
  if (areas.length === 0) return null;
  return (
    <Seccion tono="negro" id="servir" tituloId="servir-titulo">
      <div className="grid gap-[clamp(2rem,5vw,3.5rem)]">
        <CabeceraSeccion
          oscuro
          etiqueta="Servir"
          id="servir-titulo"
          lineas={['Sirve con', <em key="dones">tus dones.</em>]}
          texto="Hay un equipo para ti: elige dónde te gustaría servir y te acompañamos a empezar."
        />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {areas.map((a) => (
            <li key={a.id} className="flex">
              <Inclinable
                grados={5}
                className="group @container relative flex min-h-[clamp(11rem,22vw,15rem)] flex-1 flex-col justify-end overflow-hidden rounded-[0.5rem] bg-(--d-negro-hondo)"
              >
                {a.imagen_url && (
                  <Image
                    src={a.imagen_url}
                    alt=""
                    fill
                    sizes="(min-width: 48rem) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out-soft motion-safe:group-hover:scale-105"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-(--d-negro-hondo) via-(--d-negro-hondo)/45 to-transparent"
                />
                <div className="relative flex flex-col gap-1 p-[clamp(0.875rem,6cqi,1.5rem)]">
                  <h3 className="font-display text-[clamp(1.25rem,11cqi,2.25rem)] leading-none font-black tracking-[-0.03em] [overflow-wrap:anywhere]">
                    <Link
                      href={
                        verServir ? `/servir?area=${a.slug}#quiero-servir` : '/contacto#mensaje'
                      }
                      className="after:absolute after:inset-0"
                    >
                      {a.nombre}
                    </Link>
                  </h3>
                  {a.descripcion && (
                    <p className="line-clamp-2 text-sm leading-snug text-(--d-crema-tenue) @max-[14rem]:hidden">
                      {a.descripcion}
                    </p>
                  )}
                </div>
              </Inclinable>
            </li>
          ))}
        </ul>
      </div>
    </Seccion>
  );
}
