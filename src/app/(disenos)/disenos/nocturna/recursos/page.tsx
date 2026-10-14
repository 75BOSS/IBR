import type { Metadata } from 'next';
import { datosRecursos } from '@/disenos/datos';
import {
  Canales,
  Devocionales,
  PortadaRecursos,
  Predicas,
  Series,
} from '@/disenos/nocturna/Recursos';
import { Testimonios } from '@/disenos/nocturna/Testimonios';
import { todayInChurchTz } from '@/lib/dates';

export const revalidate = 300;

export const metadata: Metadata = { title: 'C · Nocturna · Recursos' };

/** Recursos de la propuesta C · Nocturna: prédicas, series, devocionales, testimonios y canales. */
export default async function NocturnaRecursos() {
  const { content, predicas, videos, redes } = await datosRecursos();
  const youtube = redes.find((r) => r.icon === 'youtube')?.href ?? null;
  return (
    <>
      <PortadaRecursos />
      <Predicas predicas={predicas} videos={videos} verTodas={content.predicas} youtube={youtube} />
      <Series />
      <Devocionales fecha={todayInChurchTz()} />
      <Testimonios id="testimonios" />
      <Canales redes={redes} />
    </>
  );
}
