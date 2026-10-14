import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { PREGUNTAS_VISITA, QUE_ESPERAR } from '@/disenos/contenido';
import { datosPrimeraVisita } from '@/disenos/datos';
import { Acordeon } from '@/disenos/vibrante/Acordeon';
import { Marquesina } from '@/disenos/vibrante/animacion/Marquesina';
import { BandaCierre } from '@/disenos/vibrante/BandaCierre';
import { botonClases } from '@/disenos/vibrante/boton';
import { FlechaEnlace } from '@/disenos/vibrante/FlechaEnlace';
import { FOTOS } from '@/disenos/vibrante/fotos';
import { IconoNavegar } from '@/disenos/vibrante/iconos';
import { PortadaPagina } from '@/disenos/vibrante/PortadaPagina';
import {
  ComoLlegarVisita,
  HorariosVisita,
  NinosVisita,
  QueEsperar,
} from '@/disenos/vibrante/primera-visita/SeccionesVisita';
import { CabeceraSeccion, Seccion } from '@/disenos/vibrante/Seccion';

export const revalidate = 300;

export const metadata: Metadata = { title: 'B · Vibrante · Primera visita' };

/**
 * Primera visita de la propuesta B · Vibrante (como «Soy nuevo» de caminodevida): horarios
 * reales, qué esperar, niños (ministerios reales), preguntas frecuentes, cómo llegar y
 * «Déjanos tus datos» (el formulario de /soy-nuevo).
 */
export default async function VibrantePrimeraVisita() {
  const { config, comoLlegar, reuniones, ministerios } = await datosPrimeraVisita();

  return (
    <>
      <PortadaPagina
        id="visita-titulo"
        fondo="rojo"
        etiqueta="Primera visita"
        lineas={['Te estamos']}
        enfasis="esperando."
        texto="Ven tal como eres. Te contamos qué esperar el domingo, qué hay para tus hijos y cómo llegar."
        fotos={[FOTOS.auditorio, FOTOS.bienvenida, FOTOS.abrazo]}
        acciones={
          <>
            <Link href="/soy-nuevo" className={botonClases({ variante: 'crema', tamano: 'lg' })}>
              Déjanos tus datos <Icon name="arrowRight" className="size-5" />
            </Link>
            {comoLlegar && (
              <a
                href={comoLlegar}
                target="_blank"
                rel="noopener noreferrer"
                className={botonClases({ variante: 'contorno', tamano: 'lg' })}
              >
                <IconoNavegar className="size-5" /> Cómo llegar
                <span className="sr-only"> (abre Google Maps en una pestaña nueva)</span>
              </a>
            )}
          </>
        }
      />
      <HorariosVisita reuniones={reuniones} />
      <QueEsperar momentos={QUE_ESPERAR} />
      <NinosVisita ministerios={ministerios} reuniones={reuniones} />
      <Marquesina
        etiqueta="Ven como eres"
        palabras={['Bienvenido', 'Ven como eres', 'Te esperamos', 'Riobamba']}
      />
      <Seccion id="preguntas" tituloId="preguntas-titulo">
        <div className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
          <CabeceraSeccion
            etiqueta="Preguntas frecuentes"
            id="preguntas-titulo"
            tamano="columna"
            lineas={['Lo que todos', <em key="preguntan">preguntan.</em>]}
            texto="¿Te queda otra duda? Escríbenos y te respondemos antes del domingo."
            className="self-start lg:sticky lg:top-28"
          >
            <FlechaEnlace href="/contacto#mensaje">Escríbenos un mensaje</FlechaEnlace>
          </CabeceraSeccion>
          <Acordeon preguntas={PREGUNTAS_VISITA} />
        </div>
      </Seccion>
      {comoLlegar && (
        <ComoLlegarVisita
          href={comoLlegar}
          direccion={config.direccion}
          referencia={config.referencia_llegada}
        />
      )}
      <BandaCierre
        id="visita-cierre"
        fondo="rojo"
        etiqueta="Te esperamos"
        linea="¿Vienes este"
        destacada="domingo?"
        texto="Déjanos tus datos y alguien del equipo de bienvenida te va a recibir en la entrada."
        accion={{ href: '/soy-nuevo', texto: 'Déjanos tus datos' }}
        foto={FOTOS.domingo}
      />
    </>
  );
}
