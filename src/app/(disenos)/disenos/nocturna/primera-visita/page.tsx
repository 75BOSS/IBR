import type { Metadata } from 'next';
import { datosPrimeraVisita } from '@/disenos/datos';
import {
  CierreVisita,
  ComoLlegar,
  Horarios,
  NinosVisita,
  PortadaVisita,
  PreguntasVisita,
  QueEsperar,
} from '@/disenos/nocturna/PrimeraVisita';
import { diaDeReunion } from '@/disenos/nocturna/dia-de-reunion';

export const revalidate = 300;

export const metadata: Metadata = { title: 'C · Nocturna · Primera visita' };

/** Primera visita de la propuesta C · Nocturna: horarios, qué esperar, niños y cómo llegar. */
export default async function NocturnaPrimeraVisita() {
  const { nombre, content, config, comoLlegar, reuniones, ministerios } =
    await datosPrimeraVisita();
  return (
    <>
      <PortadaVisita nombre={nombre} comoLlegar={comoLlegar} />
      <Horarios reuniones={reuniones} verTodos={content.horarios} />
      <QueEsperar />
      <NinosVisita ministerios={ministerios} reuniones={reuniones} />
      <PreguntasVisita />
      {comoLlegar && (
        <ComoLlegar
          href={comoLlegar}
          direccion={config.direccion}
          referencia={config.referencia_llegada}
          visita={diaDeReunion(reuniones)}
        />
      )}
      <CierreVisita />
    </>
  );
}
