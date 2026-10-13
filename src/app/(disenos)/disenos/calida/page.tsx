import type { Metadata } from 'next';
import { datosPortada } from '@/disenos/datos';
import { Contenedor } from '@/disenos/calida/Contenedor';
import { DatosVisita } from '@/disenos/calida/DatosVisita';
import { TarjetaPredica, TarjetaVidaReal } from '@/disenos/calida/Destacadas';
import { LugarParaTi } from '@/disenos/calida/LugarParaTi';
import { Portada } from '@/disenos/calida/Portada';
import { ProximosEventos } from '@/disenos/calida/ProximosEventos';

export const revalidate = 300;

export const metadata: Metadata = { title: 'A · Cálida · Inicio' };

/**
 * Inicio de la propuesta A · Cálida (imágenes 1 y 3). En el celular, «Un lugar para ti» va
 * justo después de «Domingos» (imagen 3); desde tablet, las dos tarjetas oscuras quedan pegadas a
 * la franja de datos (imagen 1) y «Un lugar para ti» baja (`md:order-*`, secciones
 * independientes: el orden de lectura sigue teniendo sentido).
 */
export default async function CalidaInicio() {
  const {
    config,
    content,
    nombre,
    reuniones,
    horarios,
    comoLlegar,
    ultimaPredica,
    ministerios,
    eventos,
  } = await datosPortada();
  return (
    <>
      <Portada
        nombre={nombre}
        anioFundacion={config.anio_fundacion}
        verPredicas={content.predicas}
      />
      <div className="flex flex-col gap-[clamp(0.875rem,1.2vw,1.125rem)] pt-[clamp(0.875rem,1.2vw,1.125rem)]">
        <DatosVisita
          reuniones={reuniones}
          horarios={horarios}
          verHorarios={content.horarios}
          comoLlegar={comoLlegar}
        />
        <div className="md:order-2">
          <LugarParaTi ministerios={ministerios} verMinisterios={content.ministerios} />
        </div>
        <Contenedor className="md:order-1">
          <div
            className={`grid gap-[clamp(0.875rem,1.2vw,1.125rem)] ${
              ultimaPredica ? 'xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]' : ''
            }`}
          >
            <TarjetaVidaReal />
            {ultimaPredica && (
              <TarjetaPredica predica={ultimaPredica} verPredicas={content.predicas} />
            )}
          </div>
        </Contenedor>
        <div className="md:order-3">
          <ProximosEventos eventos={eventos} verEventos={content.eventos} />
        </div>
      </div>
    </>
  );
}
