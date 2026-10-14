import type { Paso, Testimonio, Valor } from '@/disenos/contenido';
import { Contenedor } from './Contenedor';
import { EncabezadoSeccion } from './EncabezadoSeccion';
import { EnlaceFlecha } from './EnlaceFlecha';
import { Foto } from './Foto';
import { RutaCrecer } from './RutaCrecer';
import { TestimoniosCinta } from './Testimonios';
import { ValoresADN } from './ValoresADN';
import { rutaCalida } from './textos';

/**
 * «Tu siguiente paso» del inicio: la ruta de crecimiento resumida sobre una banda azul noche
 * (con la luz cálida que sigue al mouse) y el enlace a la página Crecer de la propuesta.
 */
export function RutaInicio({ pasos }: { pasos: Paso[] }) {
  return (
    <section aria-labelledby="calida-inicio-ruta" className="pt-[clamp(2.5rem,6vw,5rem)]">
      <Contenedor ancho="amplio">
        <div
          data-luz=""
          className="calida-luz relative isolate flex flex-col gap-[clamp(2rem,4vw,3.5rem)] overflow-clip bg-(--d-noche) px-[clamp(1.25rem,5vw,4.5rem)] py-[clamp(2.75rem,6vw,5rem)] text-cream on-dark md:rounded-[0.875rem]"
        >
          <EncabezadoSeccion
            id="calida-inicio-ruta"
            etiqueta="Tu siguiente paso"
            claro
            titulo={
              <>
                Crece paso a <em>paso</em>
              </>
            }
            texto="Conocer a Jesús, bautizarte, unirte a un grupo, formarte y servir: un camino que recorremos juntos."
            accion={
              <EnlaceFlecha href={rutaCalida('/crecer')} claro>
                Ver la ruta completa
              </EnlaceFlecha>
            }
          />
          <RutaCrecer pasos={pasos} claro />
        </div>
      </Contenedor>
    </section>
  );
}

/** Adelanto de Conócenos: tres valores del ADN junto a una foto, con el enlace a #adn. */
export function AdelantoADN({ valores }: { valores: Valor[] }) {
  return (
    <section aria-labelledby="calida-inicio-adn" className="pt-[clamp(2.5rem,6vw,5rem)]">
      <Contenedor className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
        <EncabezadoSeccion
          id="calida-inicio-adn"
          etiqueta="Nuestro ADN"
          titulo={
            <>
              Lo que nos <em>define</em>
            </>
          }
          accion={
            <EnlaceFlecha href={rutaCalida('/conocenos#adn')}>Conoce nuestro ADN</EnlaceFlecha>
          }
        />
        <div className="grid gap-[clamp(1.25rem,3vw,3rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <Foto
            src="/disenos/calida/mesa.webp"
            alt="Familias de la iglesia comparten la mesa y ríen después del culto"
            sizes="(min-width: 64rem) 45vw, 100vw"
            paralaje
            profundidad
            encuadre="object-[40%_center]"
            className="calida-aparece relative aspect-[16/10] rounded-[0.875rem] lg:aspect-auto lg:min-h-full"
          />
          <ValoresADN valores={valores} apilado />
        </div>
      </Contenedor>
    </section>
  );
}

/** Testimonios del inicio: encabezado y la cinta que se desliza sobre el panel durazno. */
export function TestimoniosInicio({ testimonios }: { testimonios: Testimonio[] }) {
  return (
    <section
      aria-labelledby="calida-inicio-testimonios"
      className="pt-[clamp(2.5rem,6vw,5rem)] pb-[clamp(3rem,7vw,6rem)]"
    >
      <Contenedor ancho="amplio">
        <div className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)] overflow-clip bg-(--d-durazno-panel) py-[clamp(2.5rem,5vw,4.5rem)] md:rounded-[0.875rem]">
          <div className="px-[clamp(1.25rem,5vw,4.5rem)]">
            <EncabezadoSeccion
              id="calida-inicio-testimonios"
              etiqueta="Historias"
              titulo={
                <>
                  Vidas que <em>cambian</em>
                </>
              }
              accion={
                <EnlaceFlecha href={rutaCalida('/recursos#testimonios')}>
                  Más testimonios
                </EnlaceFlecha>
              }
            />
          </div>
          <div className="motion-reduce:px-[clamp(1.25rem,5vw,4.5rem)]">
            <TestimoniosCinta testimonios={testimonios} />
          </div>
        </div>
      </Contenedor>
    </section>
  );
}
