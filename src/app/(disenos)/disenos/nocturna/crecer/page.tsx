import type { Metadata } from 'next';
import { datosCrecer } from '@/disenos/datos';
import { AreasServicio } from '@/disenos/nocturna/Comunidad';
import {
  Bautismo,
  CierreCrecer,
  Formacion,
  PortadaCrecer,
  Ruta,
  Salvacion,
} from '@/disenos/nocturna/Crecer';

export const revalidate = 300;

export const metadata: Metadata = { title: 'C · Nocturna · Crecer' };

/** Crecer de la propuesta C · Nocturna: la ruta de cinco pasos, salvación, bautismo y formación. */
export default async function NocturnaCrecer() {
  const { content, areas } = await datosCrecer();
  return (
    <>
      <PortadaCrecer />
      <Ruta content={content} />
      <Salvacion />
      <Bautismo />
      <Formacion />
      <AreasServicio
        areas={areas}
        servir={content.servir}
        titulo={
          <>
            Sirve con tus <em>dones.</em>
          </>
        }
        intro="Paso 5: descubre dónde encajas. Cada equipo te recibe, te enseña y camina contigo."
      />
      <CierreCrecer />
    </>
  );
}
