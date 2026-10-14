import type { Metadata } from 'next';
import { datosConocenos } from '@/disenos/datos';
import { FranjaLugar } from '@/disenos/nocturna/Comunidad';
import {
  Adn,
  Cifras,
  Creencias,
  Equipo,
  Historia,
  LineaDeTiempo,
  PortadaConocenos,
} from '@/disenos/nocturna/Conocenos';

export const revalidate = 300;

export const metadata: Metadata = { title: 'C · Nocturna · Conócenos' };

/** Conócenos de la propuesta C · Nocturna: historia, ADN, creencias y liderazgo. */
export default async function NocturnaConocenos() {
  const {
    nombre,
    comoLlegar,
    historia,
    mision,
    vision,
    creencias,
    imagen,
    anioFundacion,
    equipo,
    cifras,
  } = await datosConocenos();
  return (
    <>
      <PortadaConocenos nombre={nombre} anioFundacion={anioFundacion} />
      <Historia historia={historia} vision={vision} mision={mision} imagen={imagen} />
      <Cifras cifras={cifras} anioFundacion={anioFundacion} />
      <LineaDeTiempo />
      <Adn />
      <Creencias creencias={creencias} />
      <Equipo equipo={equipo} />
      <FranjaLugar comoLlegar={comoLlegar} />
    </>
  );
}
