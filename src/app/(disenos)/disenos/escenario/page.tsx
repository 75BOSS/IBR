import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { datosPortada } from '@/disenos/datos';
import { BandaFoto } from '@/disenos/escenario/BandaFoto';
import { FLECHA, claseBoton } from '@/disenos/escenario/estilos';
import { Eventos } from '@/disenos/escenario/Eventos';
import { FranjaDomingos } from '@/disenos/escenario/FranjaDomingos';
import { type Paso, Pasos } from '@/disenos/escenario/Pasos';
import { Portada } from '@/disenos/escenario/Portada';
import { Predica } from '@/disenos/escenario/Predica';
import { Puntuacion } from '@/disenos/escenario/Puntuacion';
import { PRIMERA_VISITA } from '@/disenos/escenario/rutas';
import type { SiteContent } from '@/lib/nav';

export const revalidate = 300;

export const metadata: Metadata = { title: 'D · Escenario · Inicio' };

/**
 * Los tres pasos de «Ven. Conoce. Comparte.». Cada uno lleva a una página con contenido: la
 * comunidad a Grupos o, si aún no hay grupos, a Ministerios (sin ninguno, el paso no aparece); el
 * siguiente paso a Servir o, si no hay áreas, a Soy nuevo.
 */
function pasosPortada(content: SiteContent): Paso[] {
  const comunidad = content.grupos ? '/grupos' : content.ministerios ? '/ministerios' : null;
  return [
    {
      href: PRIMERA_VISITA,
      titulo: 'Tu primera visita',
      texto: 'Todo lo que necesitas saber para sentirte en casa.',
    },
    ...(comunidad
      ? [
          {
            href: comunidad,
            titulo: 'Nuestra comunidad',
            texto: 'Personas reales, en todas las etapas de la vida.',
          },
        ]
      : []),
    content.servir
      ? {
          href: '/servir',
          titulo: 'Un siguiente paso',
          texto: 'Descubre cómo servir, crecer y hacer la diferencia.',
        }
      : {
          href: '/soy-nuevo',
          titulo: 'Un siguiente paso',
          texto: 'Cuéntanos de ti y te ayudamos a dar el primer paso.',
        },
  ];
}

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
        <Pasos pasos={pasosPortada(content)} />
      </section>

      <Predica predica={ultimaPredica} hayPredicas={content.predicas} />
      <Eventos eventos={eventos} verTodos={content.eventos} />

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
