import type { Metadata } from 'next';
import { datosMinisterios } from '@/disenos/datos';
import { FranjaLugar } from '@/disenos/nocturna/Comunidad';
import {
  MinisteriosExtra,
  MinisteriosReales,
  PortadaMinisterios,
} from '@/disenos/nocturna/Ministerios';

export const revalidate = 300;

export const metadata: Metadata = { title: 'C · Nocturna · Ministerios' };

/** Ministerios de la propuesta C · Nocturna: los reales (por edad) y los de ejemplo. */
export default async function NocturnaMinisterios() {
  const { content, comoLlegar, ministerios, reuniones, grupos } = await datosMinisterios();
  return (
    <>
      <PortadaMinisterios ministerios={ministerios} />
      <MinisteriosReales
        ministerios={ministerios}
        reuniones={reuniones}
        grupos={grupos}
        verGrupos={content.grupos}
      />
      <MinisteriosExtra />
      <FranjaLugar comoLlegar={comoLlegar} />
    </>
  );
}
