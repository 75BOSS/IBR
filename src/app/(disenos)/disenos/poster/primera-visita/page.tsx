import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { PREGUNTAS_VISITA } from '@/disenos/contenido';
import { datosPrimeraVisita } from '@/disenos/datos';
import { Acordeon } from '@/disenos/poster/Acordeon';
import { BandaCierre } from '@/disenos/poster/BandaCierre';
import { botonPoster } from '@/disenos/poster/botones';
import { agruparHorarios } from '@/disenos/poster/horarios';
import { Marquesina } from '@/disenos/poster/movimiento/Marquesina';
import { A_LOS_BORDES, PaginaPoster, PortadaPagina } from '@/disenos/poster/PortadaPagina';
import { Lema, Raya, Titulo } from '@/disenos/poster/piezas';
import { Cartelera } from '@/disenos/poster/primera-visita/Cartelera';
import { ComoLlegar } from '@/disenos/poster/primera-visita/ComoLlegar';
import { Ninos } from '@/disenos/poster/primera-visita/Ninos';
import { QueEsperar } from '@/disenos/poster/primera-visita/QueEsperar';
import { edadText, ministerioName } from '@/lib/ministerios';

export const revalidate = 300;

export const metadata: Metadata = { title: 'E · Póster · Primera visita' };

/**
 * Primera visita de la propuesta Póster (como «Soy nuevo» de caminodevida.com): horarios reales
 * en cartelera, qué esperar, los ministerios reales de niños y adolescentes, preguntas
 * frecuentes en acordeón, cómo llegar (si hay ubicación) y «Déjanos tus datos» (/soy-nuevo).
 */
export default async function PrimeraVisitaPoster() {
  const { reuniones, ministerios, comoLlegar, config } = await datosPrimeraVisita();
  const horarios = agruparHorarios(reuniones);
  const ninos = ministerios
    .filter((m) => m.edad_min !== null && m.edad_min < 18)
    .map((m) => ({
      slug: m.slug,
      nombre: ministerioName(m),
      edad: edadText(m),
      descripcion: m.descripcion,
      imagen: m.imagen_url,
      horarios: agruparHorarios(reuniones.filter((r) => r.rango_edad_id === m.id)),
    }));

  return (
    <PaginaPoster>
      <PortadaPagina
        lema="Primera visita · Riobamba"
        titulo={
          <>
            <span className="block">Ven tal</span>
            <span className="block">
              como <em>eres</em>
            </span>
          </>
        }
        frase="Queremos que te sientas en casa desde el primer minuto."
        entrada="Horarios, qué esperar, qué hacer con tus hijos y cómo llegar: todo lo que necesitas saber antes de venir."
      >
        <div className="flex flex-wrap gap-2 pt-1">
          <Link href="/soy-nuevo" className={botonPoster('rojo')}>
            Déjanos tus datos
            <Icon name="arrowRight" className="d-flecha size-[1.1em]" />
          </Link>
          <a href="#horarios" className={botonPoster('contorno')}>
            Ver horarios
          </a>
        </div>
      </PortadaPagina>

      <Marquesina
        className={A_LOS_BORDES}
        tono="tinta"
        palabras={[
          'Ven tal como eres',
          ...horarios.map((h) => `${h.dia} ${h.hora}`),
          'Te esperamos',
          'Riobamba',
        ]}
      />

      <Cartelera horarios={horarios} comoLlegar={comoLlegar} />
      <QueEsperar />
      <Ninos ministerios={ninos} />

      <section
        id="preguntas"
        aria-labelledby="preguntas-titulo"
        className="grid gap-[clamp(1.5rem,4cqi,3rem)] @4xl/pagina:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] @4xl/pagina:items-start"
      >
        <div className="flex flex-col gap-4 @4xl/pagina:sticky @4xl/pagina:top-6">
          <Lema className="text-accent">Antes de venir</Lema>
          <Titulo
            id="preguntas-titulo"
            estilo="negro"
            className="pt-[0.1em] text-[clamp(2.5rem,13cqi,6rem)] font-stretch-[80%] @4xl/pagina:text-[7.2cqi]"
          >
            Tus <em>preguntas</em>
          </Titulo>
          <Raya />
          <p className="max-w-[40ch] text-[clamp(1rem,0.95rem+0.3vw,1.1875rem)] leading-snug">
            ¿Te quedó otra duda?{' '}
            <Link href="/contacto#mensaje" className="link">
              Escríbenos
            </Link>{' '}
            y te respondemos con gusto.
          </p>
        </div>
        <Acordeon preguntas={PREGUNTAS_VISITA} />
      </section>

      <ComoLlegar
        comoLlegar={comoLlegar}
        direccion={config.direccion}
        referencia={config.referencia_llegada}
      />

      <div className={A_LOS_BORDES}>
        <BandaCierre
          titulo="¿Vienes por primera vez?"
          accion="Déjanos tus datos"
          href="/soy-nuevo"
          icono="userPlus"
        />
      </div>
    </PaginaPoster>
  );
}
