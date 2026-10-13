import type { Metadata } from 'next';
import { datosPortada } from '@/disenos/datos';
import { Eventos } from '@/disenos/nocturna/Eventos';
import { Personas } from '@/disenos/nocturna/Personas';
import { Portada } from '@/disenos/nocturna/Portada';
import { TarjetaVisita } from '@/disenos/nocturna/Visita';
import { diaDeReunion } from '@/disenos/nocturna/dia-de-reunion';

export const revalidate = 300;

export const metadata: Metadata = { title: 'C · Nocturna · Inicio' };

/** Inicio de la propuesta C · Nocturna (imágenes 7 y 9 de IBRWEB/Propuesta). */
export default async function NocturnaInicio() {
  const { content, config, comoLlegar, reuniones, eventos, ultimaPredica } = await datosPortada();
  const visita = {
    visita: diaDeReunion(reuniones),
    horarios: content.horarios,
    comoLlegar,
    direccion: config.direccion,
  };

  return (
    <>
      <Portada {...visita} predicas={content.predicas} />
      <TarjetaVisita {...visita} />
      <Personas predica={ultimaPredica} predicas={content.predicas} />
      <Eventos eventos={eventos} verTodos={content.eventos} />
    </>
  );
}
