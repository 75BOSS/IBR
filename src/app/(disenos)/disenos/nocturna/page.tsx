import type { Metadata } from 'next';
import { datosPortada } from '@/disenos/datos';
import { Eventos } from '@/disenos/nocturna/Eventos';
import { PalabraDeHoy, SiguientePaso } from '@/disenos/nocturna/Inicio';
import { Personas } from '@/disenos/nocturna/Personas';
import { Portada } from '@/disenos/nocturna/Portada';
import { Testimonios } from '@/disenos/nocturna/Testimonios';
import { TarjetaVisita } from '@/disenos/nocturna/Visita';
import { diaDeReunion } from '@/disenos/nocturna/dia-de-reunion';
import { todayInChurchTz } from '@/lib/dates';

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
      <SiguientePaso content={content} />
      <Testimonios id="testimonios-inicio" />
      <Eventos eventos={eventos} verTodos={content.eventos} />
      <PalabraDeHoy fecha={todayInChurchTz()} />
    </>
  );
}
