import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { PREGUNTAS_VISITA, QUE_ESPERAR } from '@/disenos/contenido';
import { datosPrimeraVisita } from '@/disenos/datos';
import { Acordeon } from '@/disenos/escenario/Acordeon';
import { BandaFoto } from '@/disenos/escenario/BandaFoto';
import { Cabecera } from '@/disenos/escenario/Cabecera';
import { FLECHA, FLECHA_TARJETA, claseBoton } from '@/disenos/escenario/estilos';
import { FlechaEnlace } from '@/disenos/escenario/FlechaEnlace';
import { Foto } from '@/disenos/escenario/Foto';
import { IconoNavegar } from '@/disenos/escenario/IconoNavegar';
import { LineaTiempo, type PasoVisita } from '@/disenos/escenario/LineaTiempo';
import { Puntuacion } from '@/disenos/escenario/Puntuacion';
import { MINISTERIOS } from '@/disenos/escenario/rutas';
import { TituloPagina } from '@/disenos/escenario/TituloPagina';
import { edadText, ministerioName } from '@/lib/ministerios';

export const revalidate = 300;

export const metadata: Metadata = { title: 'D · Escenario · Primera visita' };

/** «Tu primera visita, paso a paso» de la propuesta D · Escenario (imagen 11). */
export default async function PrimeraVisitaEscenario() {
  const { content, config, horarios, comoLlegar, ministerios } = await datosPrimeraVisita();
  // Los ministerios de niños y adolescentes (hasta 17 años) para «Tus hijos también».
  const deNinos = ministerios.filter((m) => m.edad_max !== null && m.edad_max <= 17);

  // 01: los horarios reales y cómo llegar; sin ninguno de los dos, se ofrece preguntar.
  const antesDeVenir: PasoVisita = {
    titulo: 'Antes de venir',
    texto:
      horarios.length > 0
        ? 'Consulta los horarios y encuentra cómo llegar.'
        : 'Escríbenos y te contamos cuándo y dónde nos reunimos.',
    foto: {
      src: '/disenos/escenario/bienvenida.webp',
      alt: 'Un hermano de la iglesia recibe con una sonrisa a una joven en la entrada.',
    },
    etiquetas: horarios.map((h) => ({ texto: h })),
    enlace: comoLlegar ? (
      <FlechaEnlace href={comoLlegar} externo>
        Ver ubicación
      </FlechaEnlace>
    ) : content.horarios ? (
      <FlechaEnlace href="/reuniones">Ver horarios</FlechaEnlace>
    ) : (
      <FlechaEnlace href="/contacto#mensaje">Escríbenos</FlechaEnlace>
    ),
  };

  const alLlegar: PasoVisita = {
    titulo: 'Al llegar',
    texto: 'Te recibiremos con una sonrisa y te ayudaremos a encontrar tu lugar.',
    foto: {
      src: '/disenos/escenario/saludo.webp',
      alt: 'Un joven conversa y saluda a dos personas antes de la reunión.',
    },
    enlace: <FlechaEnlace href="#que-esperar">Conoce qué esperar</FlechaEnlace>,
  };

  // 03: los ministerios con contenido, cada uno con su edad y su fila en Ministerios.
  const enFamilia: PasoVisita = {
    titulo: 'Ven en familia',
    texto:
      'Niños, jóvenes y adultos son parte de esta gran familia. Hay un lugar especial para cada generación.',
    etiquetas: ministerios.map((m) => ({
      texto: ministerioName(m),
      detalle: edadText(m),
      href: `${MINISTERIOS}#${m.slug}`,
      tono: m.color,
    })),
  };

  return (
    <>
      <TituloPagina
        id="primera-visita"
        antes={
          <>
            Tu primera visita
            <Puntuacion signo="," />
          </>
        }
        destacado="paso a paso."
        texto="Queremos que te sientas en casa. Aquí te contamos cómo será tu domingo con nosotros, desde que te preparas hasta que vives la experiencia."
      />

      <div className="container-page pb-[clamp(2.5rem,6vw,3.5rem)]">
        <LineaTiempo pasos={[antesDeVenir, alLlegar, enFamilia]} />
      </div>

      <section
        aria-labelledby="que-esperar-titulo"
        id="que-esperar"
        className="bg-(--d-marino) text-cream on-dark"
      >
        <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)] py-[clamp(3rem,7vw,5rem)]">
          <Cabecera
            id="que-esperar-titulo"
            etiqueta="Qué esperar"
            tono="oscuro"
            titulo={
              <>
                Así es <em className="font-semibold italic">un domingo.</em>
              </>
            }
            texto="Una hora y media, más o menos, en cuatro momentos. Sin sorpresas incómodas: solo una familia que te recibe."
          />
          <div className="@container">
            <ol className="grid gap-[clamp(0.75rem,2cqi,1rem)] @2xl:grid-cols-2 @5xl:grid-cols-4">
              {QUE_ESPERAR.map((q, i) => (
                <li
                  key={q.titulo}
                  className="d-tarjeta flex flex-col gap-2 rounded-[1.25rem] bg-cream/[0.06] p-[clamp(1.25rem,4cqi,1.75rem)] ring-1 ring-cream/15"
                >
                  <span
                    aria-hidden="true"
                    className="font-serif text-[clamp(2.5rem,2rem+2cqi,3.25rem)] leading-none font-black text-(--d-rojo) italic"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-headline text-[clamp(1.25rem,1.1rem+0.7cqi,1.5rem)] leading-tight font-extrabold tracking-[-0.03em]">
                    {q.titulo}
                  </h3>
                  <p className="text-cream/85">{q.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {deNinos.length > 0 && (
        <section
          aria-labelledby="ninos-titulo"
          id="ninos"
          className="container-page flex flex-col gap-[clamp(1.5rem,4vw,2.25rem)] py-[clamp(3rem,7vw,5rem)]"
        >
          <Cabecera
            id="ninos-titulo"
            etiqueta="Niños y adolescentes"
            titulo={
              <>
                Tus hijos <em className="font-semibold italic">también.</em>
              </>
            }
            texto="Mientras estás en el culto, ellos tienen su propio espacio, con maestros preparados y la Biblia contada a su manera."
          />
          <div className="@container">
            <ul className="grid gap-[clamp(0.875rem,2.2cqi,1.25rem)] @2xl:grid-cols-2">
              {deNinos.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`${MINISTERIOS}#${m.slug}`}
                    className="d-tarjeta grid h-full overflow-hidden rounded-[1.5rem] bg-surface shadow-card ring-1 ring-line @md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"
                  >
                    {m.imagen_url ? (
                      <Foto
                        src={m.imagen_url}
                        alt=""
                        sizes="(min-width: 64rem) 16rem, 100vw"
                        marco="aspect-[16/9] @md:aspect-auto @md:min-h-[13rem]"
                      />
                    ) : (
                      <span className="aspect-[16/9] bg-(--d-marino) @md:aspect-auto" />
                    )}
                    <span className="flex flex-col gap-1.5 p-[clamp(1.125rem,3.5cqi,1.5rem)]">
                      {edadText(m) && <span className="caps text-accent">{edadText(m)}</span>}
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-headline text-[clamp(1.375rem,1.2rem+0.8cqi,1.75rem)] leading-tight font-extrabold tracking-[-0.03em] [overflow-wrap:anywhere] text-ink">
                          {ministerioName(m)}
                        </span>
                        <Icon name="arrowRight" className={FLECHA_TARJETA} />
                      </span>
                      {m.descripcion && (
                        <span className="line-clamp-3 text-ink-soft">{m.descripcion}</span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section
        aria-labelledby="preguntas-titulo"
        id="preguntas"
        className={`container-page grid gap-[clamp(1.5rem,4vw,3.5rem)] pb-[clamp(3rem,7vw,5rem)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] ${
          deNinos.length > 0 ? '' : 'pt-[clamp(3rem,7vw,5rem)]'
        }`}
      >
        <div className="flex flex-col gap-[clamp(1rem,3vw,1.5rem)] lg:sticky lg:top-28 lg:self-start">
          <Cabecera
            id="preguntas-titulo"
            etiqueta="Preguntas frecuentes"
            titulo={
              <>
                Lo que todos <em className="font-semibold italic">preguntan.</em>
              </>
            }
          />
          <div className="flex flex-col items-start gap-3 rounded-[1.25rem] bg-accent-soft p-[clamp(1.25rem,3.5vw,1.75rem)]">
            <p className="font-headline text-[1.25rem] leading-tight font-extrabold tracking-[-0.02em] text-ink">
              ¿Quieres que te esperemos?
            </p>
            <p className="text-ink-soft">
              Déjanos tus datos y alguien del equipo te escribe antes del domingo para recibirte en
              la entrada.
            </p>
            <Link href="/soy-nuevo" className={claseBoton('rojo')}>
              Déjanos tus datos
              <Icon name="arrowRight" className={FLECHA} />
            </Link>
          </div>
        </div>
        <Acordeon preguntas={PREGUNTAS_VISITA} nombre="primera-visita" />
      </section>

      {comoLlegar && (
        <section
          aria-labelledby="como-llegar-titulo"
          className="container-page pb-[clamp(3rem,7vw,5rem)]"
        >
          <div className="relative isolate grid items-center gap-5 overflow-hidden rounded-[1.75rem] bg-(--d-marino) p-[clamp(1.5rem,4.5vw,3rem)] text-cream on-dark md:grid-cols-[auto_minmax(0,1fr)_auto]">
            <span className="grid size-16 place-items-center rounded-full bg-(--d-rojo)/90 text-cream">
              <IconoNavegar className="size-7" />
            </span>
            <div className="flex flex-col gap-1">
              <h2
                id="como-llegar-titulo"
                className="font-headline text-[clamp(1.625rem,1.2rem+1.8vw,2.375rem)] leading-tight font-extrabold tracking-[-0.04em]"
              >
                Cómo <em className="font-semibold italic">llegar.</em>
              </h2>
              <p className="text-cream/85">
                {config.direccion ?? 'Abre el mapa y llega en auto, en bus o caminando.'}
              </p>
            </div>
            <a
              href={comoLlegar}
              target="_blank"
              rel="noopener noreferrer"
              className={claseBoton('rojo')}
            >
              Abrir en Google Maps
              <Icon name="arrowRight" className={FLECHA} />
              <span className="sr-only"> (abre en una pestaña nueva)</span>
            </a>
          </div>
        </section>
      )}

      <BandaFoto
        id="pregunta"
        titulo={
          <>
            ¿Tienes alguna pregunta
            <Puntuacion signo="?" />
          </>
        }
        texto="Nos encantaría ayudarte. Escríbenos y te acompañamos."
      >
        <Link href="/contacto#mensaje" className={claseBoton('rojo')}>
          Escríbenos
          <Icon name="arrowRight" className={FLECHA} />
        </Link>
      </BandaFoto>
    </>
  );
}
