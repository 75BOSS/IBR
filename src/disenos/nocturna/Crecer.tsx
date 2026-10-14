import Link from 'next/link';
import { Icon } from '@/components/Icon';
import type { SiteContent } from '@/lib/nav';
import { BAUTISMO, CURSOS, SALVACION } from '../contenido';
import { FocoCursor, ZonaBrillo } from './efectos';
import { RutaPasos } from './Inicio';
import { FranjaCierre, PortadaInterior } from './Secciones';
import {
  Acordeon,
  CONTENEDOR,
  CURSIVA,
  ENTRADA,
  Etiqueta,
  Foto,
  SUBTITULAR,
  TituloSeccion,
  pildora,
} from './ui';

const CONTACTO = '/contacto#mensaje';

/** Portada de Crecer: «Da tu siguiente paso.». */
export function PortadaCrecer() {
  return (
    <PortadaInterior
      id="crecer-titulo"
      etiquetas={['Siguiente paso', 'Crecer']}
      foto="adoracion.webp"
      encuadre="object-[35%_center]"
      titulo={
        <>
          Da tu siguiente <em className="block text-[1em]">paso.</em>
        </>
      }
      texto="Seguir a Jesús es un camino, no un momento. Te acompañamos en cada paso: desde conocerlo hasta servir con tus dones."
    >
      <Link href="#ruta" className={pildora({ tono: 'durazno', tamano: 'lg' })}>
        Empieza aquí
        <Icon name="arrowRight" className="size-[1.2em]" />
      </Link>
      <Link href={CONTACTO} className={pildora({ tono: 'contornoClaro', tamano: 'lg' })}>
        Hablar con alguien
      </Link>
    </PortadaInterior>
  );
}

/** La ruta de cinco pasos (id="ruta"): cada paso lleva a su sección o a su página. */
export function Ruta({ content }: { content: Pick<SiteContent, 'grupos' | 'servir'> }) {
  return (
    <section
      id="ruta"
      aria-labelledby="ruta-titulo"
      className="relative isolate bg-(--d-tinta) text-cream on-dark"
    >
      <FocoCursor />
      <div
        className={`${CONTENEDOR} flex flex-col gap-[clamp(2rem,4vw,3rem)] py-[clamp(3rem,8vw,6rem)]`}
      >
        <TituloSeccion
          id="ruta-titulo"
          etiqueta="La ruta"
          oscuro
          intro="Cinco pasos que damos juntos. No hay prisa: empieza donde estás."
        >
          Un camino de cinco <em>pasos.</em>
        </TituloSeccion>
        <RutaPasos content={content} enCrecer />
      </div>
    </section>
  );
}

/**
 * Salvación (id="salvacion"): el mensaje a la izquierda y la oración destacada en una tarjeta
 * azul con la itálica durazno (el borde brilla con el cursor).
 */
export function Salvacion() {
  return (
    <section id="salvacion" aria-labelledby="salvacion-titulo" className="bg-canvas text-ink">
      <ZonaBrillo
        className={`${CONTENEDOR} grid gap-[clamp(2rem,4.5vw,4.5rem)] py-[clamp(3rem,8vw,6rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center`}
      >
        <div className="flex flex-col items-start gap-[clamp(1rem,2vw,1.5rem)]">
          <TituloSeccion id="salvacion-titulo" etiqueta="Paso 1 · Conoce a Jesús">
            Un nuevo <em>comienzo.</em>
          </TituloSeccion>
          <p className={`d-aparece max-w-[34rem] text-ink-soft ${ENTRADA}`}>{SALVACION.texto}</p>
          <p className="d-aparece max-w-[34rem] font-semibold text-ink">{SALVACION.siguiente}</p>
          <Link href={CONTACTO} className={pildora({ tono: 'naranja' })}>
            Hice esta oración
            <Icon name="arrowRight" className="size-[1.15em]" />
          </Link>
        </div>
        <figure className="d-brillo d-aparece @container relative isolate flex min-h-[clamp(22rem,44vw,30rem)] flex-col justify-end overflow-hidden rounded-2xl bg-(--d-noche) p-[clamp(1.5rem,7cqi,3rem)] text-cream ring-1 ring-peach/30 on-dark">
          <Foto
            src="adoracion-ancha.webp"
            sizes="(min-width: 64rem) 45vw, 100vw"
            capa
            encuadre="object-[30%_center]"
            className="inset-x-0 top-0 -z-10 h-[62%] mask-b-from-30%"
          />
          <Etiqueta className="text-(--d-arena)">Una oración</Etiqueta>
          <blockquote
            className={`mt-3 text-[clamp(1.5rem,7.5cqi,2.5rem)] leading-[1.15] text-peach ${CURSIVA}`}
          >
            «{SALVACION.oracion}»
          </blockquote>
          <figcaption className="mt-4 text-sm text-cream/75">
            Puedes decirla con tus palabras: Dios mira el corazón.
          </figcaption>
        </figure>
      </ZonaBrillo>
    </section>
  );
}

/**
 * Bautismo (id="bautismo"): la foto con el aviso de la próxima fecha (de ejemplo), el texto y
 * las preguntas en acordeón.
 */
export function Bautismo() {
  return (
    <section
      id="bautismo"
      aria-labelledby="bautismo-titulo"
      className="relative isolate bg-(--d-noche) text-cream on-dark"
    >
      <FocoCursor />
      <div
        className={`${CONTENEDOR} grid gap-[clamp(2rem,4.5vw,4.5rem)] py-[clamp(3rem,8vw,6rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]`}
      >
        <div className="relative lg:sticky lg:top-[calc(var(--d-cabecera)+2rem)] lg:self-start">
          <Foto
            src="/fotos-ejemplo/evento-bautismos.webp"
            sizes="(min-width: 64rem) 40vw, 100vw"
            encuadre="object-[50%_35%]"
            className="d-aparece aspect-[4/3.2] rounded-2xl ring-1 ring-cream/10 md:aspect-[16/8] lg:aspect-[4/3.2]"
          />
          <p className="absolute right-[clamp(0.75rem,2vw,1.25rem)] bottom-[clamp(0.75rem,2vw,1.25rem)] left-[clamp(0.75rem,2vw,1.25rem)] flex items-center gap-3 rounded-xl bg-(--d-tinta)/90 px-4 py-3 text-sm font-semibold ring-1 ring-peach/30">
            <Icon name="calendar" className="size-5 shrink-0 text-peach" />
            <span className="min-w-0">{BAUTISMO.proximo}</span>
          </p>
        </div>
        <div className="flex flex-col gap-[clamp(1.25rem,2.4vw,1.75rem)]">
          <TituloSeccion id="bautismo-titulo" etiqueta="Paso 2 · Bautízate" oscuro>
            El <em>bautismo.</em>
          </TituloSeccion>
          <p className={`d-aparece max-w-[38rem] text-cream/85 ${ENTRADA}`}>{BAUTISMO.texto}</p>
          <div className="d-aparece">
            <Acordeon nombre="bautismo" preguntas={BAUTISMO.preguntas} oscuro />
          </div>
          <div>
            <Link href={CONTACTO} className={pildora({ tono: 'durazno' })}>
              Quiero bautizarme
              <Icon name="arrowRight" className="size-[1.15em]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Escuela de Discipulado (id="formacion", como los módulos de CIEM): cuatro módulos en
 * escalera, el primero destacado en azul («Empieza aquí»).
 */
export function Formacion() {
  return (
    <section id="formacion" aria-labelledby="formacion-titulo" className="bg-canvas text-ink">
      <div
        className={`${CONTENEDOR} flex flex-col gap-[clamp(2rem,4vw,3rem)] py-[clamp(3rem,8vw,6rem)]`}
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <TituloSeccion
            id="formacion-titulo"
            etiqueta="Paso 4 · Fórmate"
            intro="Bases firmes en la fe, paso a paso y en comunidad. Cada módulo se cursa en grupo, con un maestro y material para la casa."
          >
            Escuela de <em>Discipulado.</em>
          </TituloSeccion>
          <Link href={CONTACTO} className={pildora({ tono: 'contornoOscuro' })}>
            Inscribirme
          </Link>
        </div>
        <ZonaBrillo
          as="ol"
          className="grid items-start gap-[clamp(0.75rem,1.4vw,1rem)] md:grid-cols-2 lg:grid-cols-4"
        >
          {CURSOS.map((curso, i) => {
            const primero = i === 0;
            return (
              <li
                key={curso.titulo}
                className={`d-brillo d-aparece @container flex flex-col gap-3 rounded-2xl p-[clamp(1.25rem,8cqi,1.75rem)] md:min-h-[clamp(15rem,24vw,18rem)] ${
                  primero
                    ? 'bg-(--d-noche) text-cream ring-1 ring-peach/30 on-dark'
                    : 'd-brillo-claro bg-surface ring-1 ring-line'
                } ${i % 2 === 1 ? 'lg:mt-[clamp(1.5rem,3vw,3rem)]' : ''}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`text-[clamp(1.5rem,11cqi,2rem)] leading-none ${CURSIVA} ${
                      primero ? 'text-peach' : 'text-accent-strong'
                    }`}
                  >
                    Módulo {i + 1}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                      primero ? 'bg-cream/10 text-cream' : 'bg-sunken text-ink'
                    }`}
                  >
                    {curso.duracion}
                  </span>
                </div>
                <h3 className={`${SUBTITULAR} mt-auto`}>{curso.titulo}</h3>
                <p
                  className={`text-[0.9375rem] leading-snug ${primero ? 'text-cream/85' : 'text-ink-soft'}`}
                >
                  {curso.texto}
                </p>
                {primero && (
                  <span className="mt-1 inline-flex items-center gap-2 font-display text-sm font-semibold text-peach">
                    <Icon name="sparkle" className="size-4" />
                    Empieza aquí
                  </span>
                )}
              </li>
            );
          })}
        </ZonaBrillo>
      </div>
    </section>
  );
}

/** Cierre de Crecer: «Quiero dar mi siguiente paso» lleva a escribir un mensaje. */
export function CierreCrecer() {
  return (
    <FranjaCierre
      id="cierre-crecer-titulo"
      etiqueta="Te acompañamos"
      foto="mesa-familia.webp"
      encuadre="object-[40%_center]"
      titulo={
        <>
          No camines <em>solo.</em>
        </>
      }
      texto="Cuéntanos en qué paso estás y alguien del equipo de pastores te escribirá para acompañarte."
    >
      <Link href={CONTACTO} className={pildora({ tono: 'durazno' })}>
        Quiero dar mi siguiente paso
        <Icon name="arrowRight" className="size-[1.15em]" />
      </Link>
    </FranjaCierre>
  );
}
