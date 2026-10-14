import type { Metadata } from 'next';
import { datosCrecer } from '@/disenos/datos';
import { BandaCierre } from '@/disenos/poster/BandaCierre';
import { Bautismo } from '@/disenos/poster/crecer/Bautismo';
import { Formacion } from '@/disenos/poster/crecer/Formacion';
import { Ruta } from '@/disenos/poster/crecer/Ruta';
import { Salvacion } from '@/disenos/poster/crecer/Salvacion';
import { Servir } from '@/disenos/poster/crecer/Servir';
import { A_LOS_BORDES, PaginaPoster, PortadaPagina } from '@/disenos/poster/PortadaPagina';

export const revalidate = 300;

export const metadata: Metadata = { title: 'E · Póster · Crecer' };

/**
 * Crecer de la propuesta Póster (como «Crecer» de caminodevida.com y el proceso de formación de
 * supresencia.com): la ruta de cinco pasos como escalera, la salvación con su oración
 * (#salvacion), el bautismo con sus preguntas (#bautismo), la Escuela de Discipulado por módulos
 * (#formacion), las áreas reales para servir (#servir) y «Quiero dar mi siguiente paso».
 */
export default async function CrecerPoster() {
  const { content, areas } = await datosCrecer();

  return (
    <PaginaPoster>
      <PortadaPagina
        lema="Crecer · Tu siguiente paso"
        corto
        titulo={
          <>
            <span className="block">Paso</span>
            <span className="block">
              a <em>paso</em>
            </span>
          </>
        }
        frase="Nadie crece solo: caminamos contigo."
        entrada="Cinco pasos para crecer en tu fe: conocer a Jesús, bautizarte, unirte a un grupo, formarte en la Palabra y servir con tus dones."
      />
      <Ruta content={content} />
      <Salvacion />
      <Bautismo />
      <Formacion />
      <Servir areas={areas} />
      <div className={A_LOS_BORDES}>
        <BandaCierre
          titulo="¿Listo para crecer?"
          accion="Quiero dar mi siguiente paso"
          href="/contacto#mensaje"
          icono="sparkle"
        />
      </div>
    </PaginaPoster>
  );
}
