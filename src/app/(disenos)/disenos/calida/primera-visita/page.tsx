import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { datosPrimeraVisita } from '@/disenos/datos';
import { PREGUNTAS_VISITA, QUE_ESPERAR } from '@/disenos/contenido';
import { Acordeon } from '@/disenos/calida/Acordeon';
import { CabeceraPagina } from '@/disenos/calida/CabeceraPagina';
import { Contenedor } from '@/disenos/calida/Contenedor';
import { EncabezadoSeccion } from '@/disenos/calida/EncabezadoSeccion';
import {
  ComoLlegarBanda,
  HorariosVisita,
  NinosVisita,
  OtraPregunta,
  QueEsperar,
} from '@/disenos/calida/PrimeraVisita';
import { RitmoPagina } from '@/disenos/calida/RitmoPagina';
import { SiguientePaso } from '@/disenos/calida/SiguientePaso';
import { botonCalida } from '@/disenos/calida/botones';

export const revalidate = 300;

export const metadata: Metadata = { title: 'A · Cálida · Primera visita' };

/**
 * Primera visita de la propuesta A · Cálida (como «Soy nuevo» de caminodevida y «Tu primer paso»
 * de masvida): horarios reales, qué esperar, los ministerios reales para niños y adolescentes,
 * preguntas frecuentes en acordeón, cómo llegar (si hay ubicación) y «Déjanos tus datos».
 */
export default async function CalidaPrimeraVisita() {
  const { config, reuniones, ministerios, comoLlegar } = await datosPrimeraVisita();
  const paraNinos = ministerios.filter((m) => m.edad_min !== null && m.edad_min < 18);
  const respuestaNinos = PREGUNTAS_VISITA.find((p) => p.pregunta.includes('hijos'))?.respuesta;

  const indice = [
    ...(reuniones.length > 0 ? [{ href: '#horarios', label: 'Horarios' }] : []),
    { href: '#que-esperar', label: 'Qué esperar' },
    ...(paraNinos.length > 0 ? [{ href: '#ninos', label: 'Niños' }] : []),
    { href: '#preguntas', label: 'Preguntas' },
    ...(comoLlegar ? [{ href: '#como-llegar', label: 'Cómo llegar' }] : []),
  ];

  return (
    <RitmoPagina>
      <CabeceraPagina
        id="calida-visita"
        etiqueta="Primera visita"
        titulo={
          <>
            Te estamos <em className="-mt-[0.08em] block">esperando.</em>
          </>
        }
        texto="Queremos que te sientas en casa desde que cruzas la puerta. Así es un domingo en IBR, para que vengas tranquilo."
        acciones={
          <>
            <Link href="/soy-nuevo" className={botonCalida('naranja', 'normal')}>
              Déjanos tus datos
              <Icon name="arrowRight" className="size-4" />
            </Link>
            {comoLlegar && (
              <a
                href={comoLlegar}
                target="_blank"
                rel="noopener noreferrer"
                className={botonCalida('contorno', 'normal')}
              >
                Cómo llegar
                <span className="sr-only"> (abre Google Maps en una pestaña nueva)</span>
              </a>
            )}
          </>
        }
        foto={{
          src: '/fotos-ejemplo/evento-domingo.webp',
          alt: 'Hermanos conversan y ríen en el auditorio antes del culto del domingo',
          encuadre: 'object-[45%_center]',
        }}
        indice={indice}
      />

      {reuniones.length > 0 && (
        <section id="horarios" aria-labelledby="calida-horarios">
          <Contenedor className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
            <EncabezadoSeccion
              id="calida-horarios"
              etiqueta="Horarios"
              titulo={
                <>
                  Cuándo nos <em>reunimos</em>
                </>
              }
              texto="El domingo es para toda la familia; entre semana hay reuniones de oración y para cada edad."
            />
            <HorariosVisita reuniones={reuniones} comoLlegar={comoLlegar} />
          </Contenedor>
        </section>
      )}

      <section id="que-esperar" aria-labelledby="calida-esperar">
        <Contenedor className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
          <EncabezadoSeccion
            id="calida-esperar"
            etiqueta="Qué esperar"
            titulo={
              <>
                Tu primer <em>domingo</em>
              </>
            }
            texto="Un culto dura alrededor de una hora y media. Esto es lo que vas a vivir."
          />
          <QueEsperar momentos={QUE_ESPERAR} />
        </Contenedor>
      </section>

      {paraNinos.length > 0 && (
        <section id="ninos" aria-labelledby="calida-ninos">
          <Contenedor className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
            <EncabezadoSeccion
              id="calida-ninos"
              etiqueta="Niños y adolescentes"
              titulo={
                <>
                  ¿Vienes con tus <em>hijos?</em>
                </>
              }
              texto={respuestaNinos}
            />
            <NinosVisita ministerios={paraNinos} reuniones={reuniones} />
          </Contenedor>
        </section>
      )}

      <section id="preguntas" aria-labelledby="calida-preguntas">
        <Contenedor className="grid gap-[clamp(1.5rem,4vw,4rem)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="flex flex-col gap-[clamp(1.25rem,2.5vw,2rem)] lg:sticky lg:top-28 lg:self-start">
            <EncabezadoSeccion
              id="calida-preguntas"
              etiqueta="Preguntas"
              titulo={
                <>
                  Lo que todos <em>preguntan</em>
                </>
              }
            />
            <OtraPregunta />
          </div>
          <div className="calida-aparece">
            <Acordeon preguntas={PREGUNTAS_VISITA} />
          </div>
        </Contenedor>
      </section>

      {comoLlegar && (
        <section id="como-llegar" aria-labelledby="calida-llegar">
          <Contenedor>
            <ComoLlegarBanda id="calida-llegar" href={comoLlegar} direccion={config.direccion} />
          </Contenedor>
        </section>
      )}

      <SiguientePaso
        id="calida-visita-datos"
        etiqueta="Antes de venir"
        titulo={
          <>
            Déjanos tus <em>datos</em>
          </>
        }
        texto="Cuéntanos un poco de ti y te ayudamos a preparar tu primera visita. Queremos conocerte."
        boton={{ href: '/soy-nuevo', label: 'Déjanos tus datos' }}
      />
    </RitmoPagina>
  );
}
