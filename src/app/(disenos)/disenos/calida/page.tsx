import type { Metadata } from 'next';
import { datosPortada } from '@/disenos/datos';
import { ADN, RUTA_CRECER, TESTIMONIOS } from '@/disenos/contenido';
import { Contenedor } from '@/disenos/calida/Contenedor';
import { DatosVisita } from '@/disenos/calida/DatosVisita';
import { TarjetaPredica, TarjetaVidaReal } from '@/disenos/calida/Destacadas';
import { AdelantoADN, RutaInicio, TestimoniosInicio } from '@/disenos/calida/InicioExtras';
import { LugarParaTi } from '@/disenos/calida/LugarParaTi';
import { Portada } from '@/disenos/calida/Portada';
import { ProximosEventos } from '@/disenos/calida/ProximosEventos';
import { destinoPaso } from '@/disenos/calida/textos';

export const revalidate = 300;

export const metadata: Metadata = { title: 'A · Cálida · Inicio' };

/**
 * Inicio de la propuesta A · Cálida (imágenes 1 y 3). En el celular, «Un lugar para ti» va
 * justo después de «Domingos» (imagen 3); desde tablet, las dos tarjetas oscuras quedan pegadas a
 * la franja de datos (imagen 1) y «Un lugar para ti» baja (`md:order-*`, secciones
 * independientes: el orden de lectura sigue teniendo sentido). Después: la ruta de crecimiento
 * resumida (→ Crecer), lo que viene, el adelanto del ADN (→ Conócenos) y los testimonios en una
 * cinta que se desliza (→ Recursos).
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
  const pasos = RUTA_CRECER.map((p) => ({ ...p, href: destinoPaso(p.href, content, false) }));
  return (
    <>
      <Portada nombre={nombre} anioFundacion={config.anio_fundacion} />
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
            className={`calida-escalonado grid gap-[clamp(0.875rem,1.2vw,1.125rem)] ${
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
          <RutaInicio pasos={pasos} />
        </div>
        <div className="md:order-4">
          <ProximosEventos eventos={eventos} verEventos={content.eventos} />
        </div>
        <div className="md:order-5">
          <AdelantoADN valores={ADN.slice(0, 3)} />
        </div>
        <div className="md:order-6">
          <TestimoniosInicio testimonios={TESTIMONIOS} />
        </div>
      </div>
    </>
  );
}
