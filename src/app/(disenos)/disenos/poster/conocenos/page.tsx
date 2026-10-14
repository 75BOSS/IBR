import type { Metadata } from 'next';
import { datosConocenos } from '@/disenos/datos';
import { BandaCierre } from '@/disenos/poster/BandaCierre';
import { Adn } from '@/disenos/poster/conocenos/Adn';
import { Cifras } from '@/disenos/poster/conocenos/Cifras';
import { Creencias } from '@/disenos/poster/conocenos/Creencias';
import { Equipo } from '@/disenos/poster/conocenos/Equipo';
import { Historia } from '@/disenos/poster/conocenos/Historia';
import { LineaTiempo } from '@/disenos/poster/conocenos/LineaTiempo';
import { VisionMision } from '@/disenos/poster/conocenos/VisionMision';
import { RUTA_PRIMERA_VISITA } from '@/disenos/poster/enlaces';
import { A_LOS_BORDES, PaginaPoster, PortadaPagina } from '@/disenos/poster/PortadaPagina';

export const revalidate = 300;

export const metadata: Metadata = { title: 'E · Póster · Conócenos' };

/**
 * Conócenos de la propuesta Póster (como «Acerca de» de caminodevida.com): la historia como nota
 * de periódico, visión y misión en carteles, la línea de tiempo, las cifras reales que cuentan
 * al aparecer, el ADN (#adn), en qué creemos (#creemos, si hay creencias) y el liderazgo
 * (#equipo, si hay equipo visible).
 */
export default async function ConocenosPoster() {
  const { nombre, historia, imagen, vision, mision, cifras, anioFundacion, creencias, equipo } =
    await datosConocenos();

  return (
    <PaginaPoster>
      <PortadaPagina
        lema={anioFundacion ? `Conócenos · Desde ${anioFundacion}` : 'Conócenos · Riobamba'}
        titulo={
          <>
            <span className="block">Quiénes</span>
            <span className="block">
              <em>somos</em>
            </span>
          </>
        }
        frase="Una familia que ama la Biblia y a Riobamba."
        entrada={`${nombre}: personas de todas las edades que se reúnen para conocer a Dios, crecer en su Palabra y servir a la ciudad.`}
      />
      <Historia historia={historia} imagen={imagen} nombre={nombre} />
      <VisionMision vision={vision} mision={mision} />
      <LineaTiempo />
      <Cifras cifras={cifras} anioFundacion={anioFundacion} />
      <Adn />
      <Creencias creencias={creencias} />
      <Equipo equipo={equipo} />
      <div className={A_LOS_BORDES}>
        <BandaCierre
          titulo="¿Quieres conocernos en persona?"
          accion="Planifica tu visita"
          href={RUTA_PRIMERA_VISITA}
          icono="mapPin"
        />
      </div>
    </PaginaPoster>
  );
}
