import type { Metadata } from 'next';
import { MINISTERIOS_EXTRA } from '@/disenos/contenido';
import { datosMinisterios } from '@/disenos/datos';
import { BandaCierre } from '@/disenos/vibrante/BandaCierre';
import { FOTOS } from '@/disenos/vibrante/fotos';
import { RUTAS } from '@/disenos/vibrante/menu';
import {
  BloqueMinisterio,
  IndiceMinisterios,
  MinisteriosExtra,
} from '@/disenos/vibrante/ministerios/SeccionesMinisterios';
import { PortadaPagina } from '@/disenos/vibrante/PortadaPagina';
import { ministerioName } from '@/lib/ministerios';

export const revalidate = 300;

export const metadata: Metadata = { title: 'B · Vibrante · Ministerios' };

/** Fotos de los ministerios de ejemplo (aún no están en la BD). */
const FOTOS_EXTRA = {
  mujeres: FOTOS.mujeres,
  matrimonios: FOTOS.matrimonios,
  hombres: FOTOS.hombres,
};

/**
 * Ministerios de la propuesta B · Vibrante: los de la BD (con sus reuniones y grupos), cada uno
 * con su ancla (#kids, #jovenes…), y los de ejemplo (Mujeres, Matrimonios, Hombres).
 */
export default async function VibranteMinisterios() {
  const { content, ministerios, reuniones, grupos } = await datosMinisterios();

  // Un ministerio de ejemplo que ya exista en la BD no se repite (ni su ancla).
  const extras = MINISTERIOS_EXTRA.filter((x) => !ministerios.some((m) => m.slug === x.slug));
  const indice = [
    ...ministerios.map((m) => ({ slug: m.slug, nombre: ministerioName(m), color: m.color })),
    ...extras.map((x) => ({ slug: x.slug, nombre: x.nombre, color: null })),
  ];

  return (
    <>
      <PortadaPagina
        id="ministerios-titulo"
        fondo="rojo"
        etiqueta="Ministerios"
        lineas={['Crecemos']}
        enfasis="juntos."
        texto="Niños, adolescentes, jóvenes, adultos y adultos mayores: en IBR cada etapa de la vida tiene su lugar."
        fotos={[FOTOS.familias, FOTOS.kids, FOTOS.vigilia]}
      />
      <IndiceMinisterios entradas={indice} />
      {ministerios.map((m, i) => (
        <BloqueMinisterio
          key={m.id}
          ministerio={m}
          indice={i}
          reuniones={reuniones.filter((r) => r.rango_edad_id === m.id)}
          grupos={grupos.filter((g) => g.rango_edad_id === m.id)}
          verGrupos={content.grupos}
        />
      ))}
      <MinisteriosExtra extras={extras} fotos={FOTOS_EXTRA} />
      <BandaCierre
        id="ministerios-cierre"
        fondo="rojo"
        etiqueta="Tu primera visita"
        linea="Trae a toda"
        destacada="tu familia."
        texto="El domingo hay un lugar para cada uno: los niños en su clase y tú en el culto."
        accion={{ href: RUTAS.primeraVisita, texto: 'Planifica tu visita' }}
        foto={FOTOS.ninos}
      />
    </>
  );
}
