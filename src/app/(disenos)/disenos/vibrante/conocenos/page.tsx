import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { ADN, HISTORIA } from '@/disenos/contenido';
import { datosConocenos } from '@/disenos/datos';
import { BandaCierre } from '@/disenos/vibrante/BandaCierre';
import {
  Cifras,
  Creemos,
  Equipo,
  HistoriaVision,
  LineaTiempo,
} from '@/disenos/vibrante/conocenos/SeccionesConocenos';
import { FOTOS } from '@/disenos/vibrante/fotos';
import { RUTAS } from '@/disenos/vibrante/menu';
import { PortadaPagina } from '@/disenos/vibrante/PortadaPagina';
import { CabeceraSeccion, Seccion } from '@/disenos/vibrante/Seccion';
import { ValoresAdn } from '@/disenos/vibrante/secciones/ValoresAdn';
import { paragraphs } from '@/lib/text';

export const revalidate = 300;

export const metadata: Metadata = { title: 'B · Vibrante · Conócenos' };

/**
 * Conócenos de la propuesta B · Vibrante: historia, visión y misión (config), cifras reales,
 * línea de tiempo y ADN (ejemplo), en qué creemos (config) y el liderazgo (equipo de la BD).
 */
export default async function VibranteConocenos() {
  const { historia, mision, vision, creencias, imagen, anioFundacion, equipo, cifras } =
    await datosConocenos();

  const parrafos = paragraphs(historia);
  const portada = imagen
    ? { src: imagen, alt: 'La iglesia reunida en el auditorio' }
    : FOTOS.nosotros;

  return (
    <>
      <PortadaPagina
        id="conocenos-titulo"
        fondo="negro"
        etiqueta={anioFundacion ? `Conócenos · desde ${anioFundacion}` : 'Conócenos'}
        lineas={['Quiénes']}
        enfasis="somos."
        texto="Una iglesia de Riobamba que cree en la Palabra, vive como familia y sale a servir a su ciudad."
        fotos={[portada, FOTOS.predicador, FOTOS.risas]}
      />
      <HistoriaVision
        parrafos={
          parrafos.length > 0
            ? parrafos
            : [
                'Empezamos como un grupo pequeño que abría la Biblia en una casa y oraba por Riobamba. Hoy seguimos creyendo lo mismo: la Palabra cambia vidas y nadie camina solo.',
              ]
        }
        vision={vision}
        mision={mision}
      />
      <Cifras cifras={cifras} anioFundacion={anioFundacion} />
      <LineaTiempo hitos={HISTORIA} />
      <Seccion id="adn" tituloId="adn-titulo">
        <ValoresAdn
          valores={ADN}
          cabecera={
            <CabeceraSeccion
              etiqueta="Nuestro ADN"
              id="adn-titulo"
              tamano="columna"
              lineas={['Lo que nos', <em key="define">define.</em>]}
              texto="Seis convicciones que se notan en un domingo, en un grupo en casa y en cada equipo."
            />
          }
          cierre={
            <Link
              href={RUTAS.crecer}
              className="group flex flex-col justify-between gap-6 rounded-[0.5rem] bg-(--d-negro) p-[clamp(1.25rem,3vw,2rem)] text-canvas on-dark md:col-span-2 lg:col-span-1"
            >
              <span className="eyebrow">Vívelo</span>
              <span className="font-display text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] leading-[1] font-black tracking-[-0.04em] text-balance">
                Da tu siguiente paso con nosotros.
              </span>
              <span className="inline-flex items-center gap-2 font-bold text-(--d-rojo-vivo)">
                Crecer
                <Icon
                  name="arrowRight"
                  className="size-5 transition-transform motion-safe:group-hover:translate-x-1"
                />
              </span>
            </Link>
          }
        />
      </Seccion>
      <Creemos creencias={creencias} />
      <Equipo equipo={equipo} />
      <BandaCierre
        id="conocenos-cierre"
        etiqueta="Te esperamos"
        linea="Ven a conocernos"
        destacada="en persona."
        texto="La mejor forma de conocer una familia es compartir un domingo con ella."
        accion={{ href: RUTAS.primeraVisita, texto: 'Planifica tu visita' }}
        foto={FOTOS.lugar}
      />
    </>
  );
}
