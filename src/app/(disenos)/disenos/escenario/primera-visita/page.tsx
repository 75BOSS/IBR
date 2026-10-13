import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { datosPrimeraVisita } from '@/disenos/datos';
import { BandaFoto } from '@/disenos/escenario/BandaFoto';
import { FLECHA, claseBoton } from '@/disenos/escenario/estilos';
import { FlechaEnlace } from '@/disenos/escenario/FlechaEnlace';
import { LineaTiempo, type PasoVisita } from '@/disenos/escenario/LineaTiempo';
import { Puntuacion } from '@/disenos/escenario/Puntuacion';
import { edadText, ministerioName } from '@/lib/ministerios';

export const revalidate = 300;

export const metadata: Metadata = { title: 'D · Escenario · Primera visita' };

/** «Tu primera visita, paso a paso» de la propuesta D · Escenario (imagen 11). */
export default async function PrimeraVisitaEscenario() {
  const { content, horarios, comoLlegar, ministerios } = await datosPrimeraVisita();

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
    enlace: <FlechaEnlace href="/soy-nuevo">Conoce qué esperar</FlechaEnlace>,
  };

  // 03: los ministerios con contenido, cada uno con su edad y su página.
  const enFamilia: PasoVisita = {
    titulo: 'Ven en familia',
    texto:
      'Niños, jóvenes y adultos son parte de esta gran familia. Hay un lugar especial para cada generación.',
    etiquetas: ministerios.map((m) => ({
      texto: ministerioName(m),
      detalle: edadText(m),
      href: `/ministerios/${m.slug}`,
      tono: m.color,
    })),
  };

  return (
    <>
      <section
        aria-labelledby="primera-visita"
        className="container-page flex flex-col items-center gap-[clamp(0.75rem,2vw,1.25rem)] pt-[clamp(2.25rem,5vw,2.75rem)] text-center"
      >
        <h1
          id="primera-visita"
          className="font-headline text-[clamp(2.375rem,1.3rem+3.9vw,4.25rem)] leading-[0.98] font-extrabold tracking-[-0.05em] text-ink"
        >
          Tu primera visita
          <Puntuacion signo="," />{' '}
          <em className="block font-medium tracking-[-0.02em] italic">paso a paso.</em>
        </h1>
        <p className="max-w-[38rem] text-[clamp(1.0625rem,1rem+0.2vw,1.125rem)] text-balance text-ink-soft">
          Queremos que te sientas en casa. Aquí te contamos cómo será tu domingo con nosotros, desde
          que te preparas hasta que vives la experiencia.
        </p>
      </section>

      <div className="container-page pb-[clamp(2.5rem,6vw,3.5rem)]">
        <LineaTiempo pasos={[antesDeVenir, alLlegar, enFamilia]} />
      </div>

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
