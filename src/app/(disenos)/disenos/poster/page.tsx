import type { Metadata } from 'next';
import { datosPortada } from '@/disenos/datos';
import { Agenda } from '@/disenos/poster/inicio/Agenda';
import { BloqueDomingo } from '@/disenos/poster/inicio/BloqueDomingo';
import { ConectaMovil } from '@/disenos/poster/inicio/ConectaMovil';
import { FilaInferior } from '@/disenos/poster/inicio/FilaInferior';
import { FotoFrase } from '@/disenos/poster/inicio/FotoFrase';
import { PrimeraVez } from '@/disenos/poster/inicio/PrimeraVez';
import { Titular } from '@/disenos/poster/inicio/Titular';

export const revalidate = 300;

export const metadata: Metadata = { title: 'E · Póster · Inicio' };

/**
 * Inicio de la propuesta Póster (imágenes 13 y 15). La composición la decide el ancho de la
 * página (`@container/pagina`), no el de la ventana: con el menú lateral, 1024 px de ventana
 * dejan una página parecida a la de una tablet, y ambas usan la grilla de escritorio.
 */
export default async function InicioPoster() {
  const { nombre, content, comoLlegar, reuniones, horarios, ultimaPredica, eventos } =
    await datosPortada();

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
      <Agenda eventos={eventos} />
    </div>
  );
}
