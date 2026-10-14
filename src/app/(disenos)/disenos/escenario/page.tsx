import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { ADN, TESTIMONIOS } from '@/disenos/contenido';
import { datosPortada } from '@/disenos/datos';
import { BandaFoto } from '@/disenos/escenario/BandaFoto';
import { Cabecera } from '@/disenos/escenario/Cabecera';
import { Camino } from '@/disenos/escenario/Camino';
import { FLECHA, claseBoton } from '@/disenos/escenario/estilos';
import { Eventos } from '@/disenos/escenario/Eventos';
import { FlechaEnlace } from '@/disenos/escenario/FlechaEnlace';
import { FranjaDomingos } from '@/disenos/escenario/FranjaDomingos';
import { Marquesina } from '@/disenos/escenario/Marquesina';
import { rutaCrecer } from '@/disenos/escenario/menu';
import { type Paso, Pasos } from '@/disenos/escenario/Pasos';
import { Portada } from '@/disenos/escenario/Portada';
import { Predica } from '@/disenos/escenario/Predica';
import { Puntuacion } from '@/disenos/escenario/Puntuacion';
import { COMUNIDAD, CONOCENOS, CRECER, PRIMERA_VISITA, RECURSOS } from '@/disenos/escenario/rutas';
import { Testimonios } from '@/disenos/escenario/Testimonios';

export const revalidate = 300;

export const metadata: Metadata = { title: 'D · Escenario · Inicio' };

/** Los tres pasos de «Ven. Conoce. Comparte.»: llevan a las páginas de la propuesta. */
const PASOS_PORTADA: Paso[] = [
  {
    href: PRIMERA_VISITA,
    titulo: 'Tu primera visita',
    texto: 'Todo lo que necesitas saber para sentirte en casa.',
  },
  {
    href: COMUNIDAD,
    titulo: 'Nuestra comunidad',
    texto: 'Personas reales, en todas las etapas de la vida.',
  },
  {
    href: CRECER,
    titulo: 'Un siguiente paso',
    texto: 'Descubre cómo servir, crecer y hacer la diferencia.',
  },
];

/** Inicio de la propuesta D · Escenario (imágenes 10 y 12). */
export default async function InicioEscenario() {
  const { content, config, reuniones, comoLlegar, eventos, ultimaPredica } = await datosPortada();
  return (
    <>
      <Portada />
      <FranjaDomingos
        reuniones={reuniones}
        hayHorarios={content.horarios}
        direccion={config.direccion}
        comoLlegar={comoLlegar}
      />

      <section
        aria-labelledby="ven-conoce"
        className="container-page flex flex-col items-center gap-[clamp(0.75rem,2.5vw,2rem)] pt-[clamp(2.75rem,6vw,4.25rem)] pb-[clamp(2.5rem,6vw,4.5rem)] text-center"
      >
        <h2
          id="ven-conoce"
          className="font-headline text-[clamp(1.75rem,0.95rem+4vw,4.875rem)] leading-none font-extrabold tracking-[-0.055em] text-ink"
        >
          Ven
          <Puntuacion />{' '}
          <span className="lg:text-(--d-rojo)">
            Conoce
            <Puntuacion />
          </span>{' '}
          <span className="font-serif font-medium tracking-[-0.01em] text-(--d-rojo) italic lg:font-display lg:font-extrabold lg:tracking-[-0.055em] lg:text-ink lg:not-italic">
            Comparte
            <Puntuacion className="lg:-ml-[0.09em]" />
          </span>
        </h2>
        <Pasos pasos={PASOS_PORTADA} />
      </section>

      <section aria-labelledby="adn-inicio" className="bg-(--d-marino) text-cream on-dark">
        <div className="container-page flex flex-col gap-2 pt-[clamp(2.5rem,6vw,4rem)] md:flex-row md:items-end md:justify-between md:gap-8">
          <Cabecera
            id="adn-inicio"
            etiqueta="Nuestro ADN"
            tono="oscuro"
            titulo={
              <>
                Lo que nos <em className="font-semibold italic">define.</em>
              </>
            }
          />
          <Link
            href={`${CONOCENOS}#adn`}
            className="group inline-flex min-h-11 items-center gap-2 font-semibold text-peach underline decoration-1 underline-offset-[0.3em] hover:decoration-2"
          >
            Conoce nuestra historia
            <Icon name="arrowRight" className={FLECHA} />
          </Link>
        </div>
        <div className="pb-[clamp(2rem,5vw,3.5rem)]">
          <Marquesina valores={ADN} />
        </div>
      </section>

      <section
        aria-labelledby="siguiente-paso-titulo"
        className="container-page flex flex-col gap-[clamp(1.75rem,4vw,2.75rem)] py-[clamp(3rem,7vw,5rem)]"
      >
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <Cabecera
            id="siguiente-paso-titulo"
            etiqueta="Crecer"
            titulo={
              <>
                Tu siguiente <em className="font-semibold italic">paso.</em>
              </>
            }
            texto="Cinco pasos para crecer en la fe, en comunidad y sirviendo a otros."
          />
          <FlechaEnlace href={CRECER}>Ver la ruta completa</FlechaEnlace>
        </div>
        <Camino pasos={rutaCrecer(content, false)} resumido />
      </section>

      <Predica predica={ultimaPredica} hayPredicas={content.predicas} />
      <Eventos eventos={eventos} verTodos={content.eventos} />

      <section aria-labelledby="testimonios-inicio" className="bg-sunken py-[clamp(3rem,7vw,5rem)]">
        <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)]">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <Cabecera
              id="testimonios-inicio"
              etiqueta="Testimonios"
              titulo={
                <>
                  Vidas <em className="font-semibold italic">cambiadas.</em>
                </>
              }
            />
            <FlechaEnlace href={`${RECURSOS}#testimonios`}>Más historias</FlechaEnlace>
          </div>
          <Testimonios testimonios={TESTIMONIOS} />
        </div>
      </section>

      <BandaFoto
        id="somos-familia"
        titulo={
          <>
            Somos Familia{' '}
            <span className="block font-serif font-medium tracking-[-0.01em] italic">
              para <em className="font-medium italic">toda la vida.</em>
            </span>
          </>
        }
        texto="Ven a descubrir una iglesia donde puedes pertenecer, crecer y ser parte."
      >
        <Link href={PRIMERA_VISITA} className={claseBoton('rojo')}>
          Planifica tu visita
          <Icon name="arrowRight" className={FLECHA} />
        </Link>
      </BandaFoto>
    </>
  );
}
