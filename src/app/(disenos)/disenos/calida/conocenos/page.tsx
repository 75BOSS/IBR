import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { datosConocenos } from '@/disenos/datos';
import { ADN, HISTORIA } from '@/disenos/contenido';
import { CabeceraPagina } from '@/disenos/calida/CabeceraPagina';
import { Cifras, Creencias, VisionMision } from '@/disenos/calida/Conocenos';
import { Contenedor } from '@/disenos/calida/Contenedor';
import { EncabezadoSeccion } from '@/disenos/calida/EncabezadoSeccion';
import { Equipo } from '@/disenos/calida/Equipo';
import { Foto } from '@/disenos/calida/Foto';
import { LineaTiempo } from '@/disenos/calida/LineaTiempo';
import { RitmoPagina } from '@/disenos/calida/RitmoPagina';
import { SiguientePaso } from '@/disenos/calida/SiguientePaso';
import { Texto } from '@/disenos/calida/Texto';
import { ValoresADN } from '@/disenos/calida/ValoresADN';
import { botonCalida } from '@/disenos/calida/botones';
import { rutaCalida } from '@/disenos/calida/textos';
import { paragraphs } from '@/lib/text';

export const revalidate = 300;

export const metadata: Metadata = { title: 'A · Cálida · Conócenos' };

/** Si la iglesia aún no escribió su historia en el panel. */
const HISTORIA_BREVE =
  'Somos una familia de personas comunes que encontraron en Jesús una vida nueva. Nos reunimos cada domingo en Riobamba y, durante la semana, en grupos en casas por toda la ciudad.';

/**
 * Conócenos de la propuesta A · Cálida (como «Acerca de» de caminodevida): historia real de la
 * config con la línea de tiempo de ejemplo (la línea se dibuja con el scroll), visión y misión,
 * cifras reales, el ADN (#adn), en qué creemos (#creemos, solo con creencias) y el liderazgo
 * real (#equipo, solo con equipo visible).
 */
export default async function CalidaConocenos() {
  const { historia, mision, vision, creencias, imagen, anioFundacion, equipo, cifras } =
    await datosConocenos();
  const parrafos = paragraphs(historia);
  const [entrada, ...resto] = parrafos.length > 0 ? parrafos : [HISTORIA_BREVE];
  const pastores = equipo.filter((p) => p.es_pastor);
  const lideres = equipo.filter((p) => !p.es_pastor);

  const indice = [
    { href: '#historia', label: 'Historia' },
    { href: '#adn', label: 'Nuestro ADN' },
    ...(creencias.length > 0 ? [{ href: '#creemos', label: 'En qué creemos' }] : []),
    ...(equipo.length > 0 ? [{ href: '#equipo', label: 'Liderazgo' }] : []),
  ];

  return (
    <RitmoPagina>
      <CabeceraPagina
        id="calida-conocenos"
        etiqueta="Conócenos"
        titulo={
          <>
            Una familia en <em className="-mt-[0.08em] block">Riobamba.</em>
          </>
        }
        texto={entrada}
        acciones={
          <Link href={rutaCalida('/primera-visita')} className={botonCalida('naranja', 'normal')}>
            Planifica tu visita
            <Icon name="arrowRight" className="size-4" />
          </Link>
        }
        foto={{
          src: imagen ?? '/fotos-ejemplo/nosotros.webp',
          alt: 'Hermanos de la iglesia se abrazan y ríen durante una reunión',
          encuadre: 'object-[55%_center]',
        }}
        indice={indice}
      />

      <section id="historia" aria-labelledby="calida-historia">
        <Contenedor className="grid gap-[clamp(2.5rem,5vw,5rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="flex flex-col gap-[clamp(1.25rem,2.5vw,2rem)] lg:sticky lg:top-28 lg:self-start">
            <EncabezadoSeccion
              id="calida-historia"
              etiqueta="Nuestra historia"
              titulo={
                anioFundacion ? (
                  <>
                    Desde <em>{anioFundacion}</em>
                  </>
                ) : (
                  <>
                    Cómo <em>empezamos</em>
                  </>
                )
              }
            />
            {resto.length > 0 && (
              <div className="calida-aparece flex flex-col gap-4">
                {resto.map((p) => (
                  <Texto key={p.slice(0, 32)} className="max-w-[34rem] text-ink-soft">
                    {p}
                  </Texto>
                ))}
              </div>
            )}
            <Foto
              src="/disenos/calida/multitud.webp"
              alt="Una hermana levanta la mano durante la alabanza en el auditorio"
              sizes="(min-width: 64rem) 40vw, 100vw"
              paralaje
              encuadre="object-[30%_center]"
              className="calida-aparece relative aspect-[16/10] rounded-[0.875rem] max-lg:hidden"
            />
          </div>
          <LineaTiempo hitos={HISTORIA} />
        </Contenedor>
      </section>

      {(vision || mision) && (
        <section aria-labelledby="calida-proposito">
          <Contenedor className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
            <EncabezadoSeccion
              id="calida-proposito"
              etiqueta="Propósito"
              titulo={
                <>
                  Hacia dónde <em>vamos</em>
                </>
              }
            />
            <VisionMision vision={vision} mision={mision} />
            <Cifras cifras={cifras} />
          </Contenedor>
        </section>
      )}

      <section id="adn" aria-labelledby="calida-adn">
        <Contenedor className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
          <EncabezadoSeccion
            id="calida-adn"
            etiqueta="Nuestro ADN"
            titulo={
              <>
                Lo que nos <em>define</em>
              </>
            }
            texto="Seis convicciones que se notan en un domingo, en un grupo en casa y en cómo servimos a Riobamba."
          />
          <ValoresADN valores={ADN} />
        </Contenedor>
      </section>

      {creencias.length > 0 && (
        <section id="creemos" aria-labelledby="calida-creemos">
          <Contenedor ancho="amplio">
            <div
              data-luz=""
              className="calida-luz relative isolate flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)] overflow-clip bg-(--d-noche) px-[clamp(1.25rem,5vw,4.5rem)] py-[clamp(2.5rem,6vw,5rem)] text-cream on-dark md:rounded-[0.875rem]"
            >
              <EncabezadoSeccion
                id="calida-creemos"
                etiqueta="En qué creemos"
                claro
                titulo={
                  <>
                    Lo esencial de nuestra <em>fe</em>
                  </>
                }
                texto="Somos una iglesia bíblica: lo que creemos nace de la Palabra de Dios."
              />
              <Creencias creencias={creencias} />
            </div>
          </Contenedor>
        </section>
      )}

      {equipo.length > 0 && (
        <section id="equipo" aria-labelledby="calida-equipo">
          <Contenedor className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
            <EncabezadoSeccion
              id="calida-equipo"
              etiqueta="Liderazgo"
              titulo={
                <>
                  Quienes nos <em>acompañan</em>
                </>
              }
              texto="Pastores y líderes que sirven a la familia con cariño y con la Biblia abierta."
            />
            <Equipo pastores={pastores} lideres={lideres} />
          </Contenedor>
        </section>
      )}

      <SiguientePaso
        id="calida-conocenos-visita"
        etiqueta="Te esperamos"
        titulo={
          <>
            Ven a <em>conocernos</em>
          </>
        }
        texto="La mejor forma de conocer a una familia es sentarse a su mesa. Este domingo hay un lugar para ti."
        boton={{ href: rutaCalida('/primera-visita'), label: 'Planifica tu visita' }}
      />
    </RitmoPagina>
  );
}
