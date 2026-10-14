import type { Metadata } from 'next';
import { datosPortada } from '@/disenos/datos';
import { RUTA_RECURSOS } from '@/disenos/poster/enlaces';
import { agruparHorarios } from '@/disenos/poster/horarios';
import { AdnAdelanto } from '@/disenos/poster/inicio/AdnAdelanto';
import { Agenda } from '@/disenos/poster/inicio/Agenda';
import { BloqueDomingo } from '@/disenos/poster/inicio/BloqueDomingo';
import { ConectaMovil } from '@/disenos/poster/inicio/ConectaMovil';
import { FilaInferior } from '@/disenos/poster/inicio/FilaInferior';
import { FotoFrase } from '@/disenos/poster/inicio/FotoFrase';
import { PrimeraVez } from '@/disenos/poster/inicio/PrimeraVez';
import { Titular } from '@/disenos/poster/inicio/Titular';
import { Marquesina } from '@/disenos/poster/movimiento/Marquesina';
import { SiguientePaso } from '@/disenos/poster/SiguientePaso';
import { Testimonios } from '@/disenos/poster/Testimonios';
import { ministerioName } from '@/lib/ministerios';

export const revalidate = 300;

export const metadata: Metadata = { title: 'E · Póster · Inicio' };

/** Separación entre las secciones de abajo (la grilla de arriba va pegada, como el póster). */
const RITMO = 'mt-[clamp(2.5rem,6vw,4.5rem)]';

/**
 * Inicio de la propuesta Póster (imágenes 13 y 15). La composición la decide el ancho de la
 * página (`@container/pagina`), no el de la ventana: con el menú lateral, 1024 px de ventana
 * dejan una página parecida a la de una tablet, y ambas usan la grilla de escritorio. Debajo de
 * la primera pantalla: la cinta con horarios y ministerios reales, «Tu siguiente paso», la
 * agenda, el adelanto del ADN y testimonios.
 */
export default async function InicioPoster() {
  const { nombre, content, comoLlegar, reuniones, horarios, ultimaPredica, eventos, ministerios } =
    await datosPortada();
  const cinta = [
    ...agruparHorarios(reuniones)
      .slice(0, 3)
      .map((h) => `${h.dia} ${h.hora}`),
    ...ministerios.map(ministerioName),
    'Riobamba',
  ];

  return (
    <div className="@container/pagina flex flex-col gap-1 px-(--d-margen) pb-[clamp(1.5rem,4vw,2.5rem)] lg:px-1.5">
      <Titular nombre={nombre} />
      <div className="grid gap-1 @2xl/pagina:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <BloqueDomingo
          reuniones={reuniones}
          horarios={horarios}
          hayHorarios={content.horarios}
          comoLlegar={comoLlegar}
          className="@2xl/pagina:col-start-2 @2xl/pagina:row-start-1"
        />
        <FotoFrase className="@2xl/pagina:col-start-1 @2xl/pagina:row-span-2 @2xl/pagina:row-start-1" />
        <PrimeraVez className="mt-[clamp(0.75rem,3.5vw,1.25rem)] @2xl/pagina:col-start-2 @2xl/pagina:row-start-2 @2xl/pagina:mt-0" />
      </div>
      <ConectaMovil
        content={content}
        className="mt-[clamp(0.75rem,3.5vw,1.25rem)] @2xl/pagina:hidden"
      />
      <FilaInferior
        content={content}
        ultimaPredica={ultimaPredica}
        className="hidden @2xl/pagina:flex"
      />
      <Marquesina palabras={cinta} className={`${RITMO} -mx-(--d-margen) lg:-mx-1.5`} />
      <SiguientePaso content={content} className={RITMO} />
      <Agenda eventos={eventos} />
      <AdnAdelanto className={RITMO} />
      <Testimonios
        cantidad={3}
        className={RITMO}
        accion={{ href: `${RUTA_RECURSOS}#testimonios`, texto: 'Más historias' }}
        id="testimonios-inicio"
      />
    </div>
  );
}
