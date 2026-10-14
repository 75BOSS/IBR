import type { Metadata } from 'next';
import { datosComunidad } from '@/disenos/datos';
import {
  AreasServicio,
  EdadesComunidad,
  FranjaLugar,
  GruposEnCasa,
  PortadaComunidad,
  TarjetasComunidad,
} from '@/disenos/nocturna/Comunidad';

export const revalidate = 300;

export const metadata: Metadata = { title: 'C · Nocturna · Comunidad' };

/** Comunidad de la propuesta C · Nocturna (imagen 8 de IBRWEB/Propuesta). */
export default async function NocturnaComunidad() {
  const { nombre, content, comoLlegar, grupos, ministerios, areas } = await datosComunidad();
  return (
    <>
      <PortadaComunidad nombre={nombre} />
      <TarjetasComunidad grupos={grupos} ministerios={ministerios} areas={areas} />
      <GruposEnCasa grupos={grupos} />
      <EdadesComunidad ministerios={ministerios} />
      <AreasServicio
        areas={areas}
        servir={content.servir}
        titulo={
          <>
            Tus dones <em>cuentan.</em>
          </>
        }
        intro="Hay un equipo para cada don: alabanza, niños, bienvenida y más. Sirviendo también se hace familia."
      />
      <FranjaLugar comoLlegar={comoLlegar} />
    </>
  );
}
