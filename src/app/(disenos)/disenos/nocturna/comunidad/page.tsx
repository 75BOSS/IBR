import type { Metadata } from 'next';
import { datosComunidad } from '@/disenos/datos';
import { FranjaLugar, PortadaComunidad, TarjetasComunidad } from '@/disenos/nocturna/Comunidad';

export const revalidate = 300;

export const metadata: Metadata = { title: 'C · Nocturna · Comunidad' };

/** Comunidad de la propuesta C · Nocturna (imagen 8 de IBRWEB/Propuesta). */
export default async function NocturnaComunidad() {
  const { nombre, content, comoLlegar, grupos, ministerios, areas } = await datosComunidad();
  return (
    <>
      <PortadaComunidad nombre={nombre} />
      <TarjetasComunidad
        content={content}
        grupos={grupos}
        ministerios={ministerios}
        areas={areas}
      />
      <FranjaLugar comoLlegar={comoLlegar} />
    </>
  );
}
