import type { Metadata } from 'next';
import { SERIES } from '@/disenos/contenido';
import { datosRecursos } from '@/disenos/datos';
import { BandaCierre } from '@/disenos/poster/BandaCierre';
import { Marquesina } from '@/disenos/poster/movimiento/Marquesina';
import { A_LOS_BORDES, PaginaPoster, PortadaPagina } from '@/disenos/poster/PortadaPagina';
import { Canales } from '@/disenos/poster/recursos/Canales';
import { Devocionales } from '@/disenos/poster/recursos/Devocionales';
import { Predicas, mensajesDe } from '@/disenos/poster/recursos/Predicas';
import { Series } from '@/disenos/poster/recursos/Series';
import { Testimonios } from '@/disenos/poster/Testimonios';

export const revalidate = 300;

export const metadata: Metadata = { title: 'E · Póster · Recursos' };

/**
 * Recursos de la propuesta Póster (como «Recursos» de caminodevida.com): las prédicas del panel o
 * los últimos videos del canal de YouTube, series de mensajes, el plan de devocionales de la
 * semana (#devocionales), testimonios (#testimonios) y las redes reales de la iglesia.
 */
export default async function RecursosPoster() {
  const { predicas, videos, content, redes } = await datosRecursos();
  const mensajes = mensajesDe(predicas, videos);
  const youtube = redes.find((r) => r.icon === 'youtube');
  const todas = content.predicas
    ? { href: '/predicas', texto: 'Todas las prédicas' }
    : youtube
      ? { href: youtube.href, texto: 'Ver el canal', externo: true }
      : null;

  return (
    <PaginaPoster>
      <PortadaPagina
        lema="Recursos · Para tu semana"
        titulo={
          <>
            <span className="block">Palabra</span>
            <span className="block">
              para <em>hoy</em>
            </span>
          </>
        }
        frase="Para seguir creciendo de domingo a domingo."
        entrada="Los mensajes de cada domingo, series para escuchar en orden, un pasaje para cada día y las historias de nuestra familia."
      />
      <Predicas mensajes={mensajes} todas={todas} />
      <Marquesina
        className={A_LOS_BORDES}
        tono="durazno"
        alReves
        palabras={SERIES.map((s) => s.titulo)}
      />
      <Series conPredicas={content.predicas} />
      <Devocionales />
      <Testimonios />
      <Canales redes={redes} />
      <div className={A_LOS_BORDES}>
        <BandaCierre
          titulo="¿Quieres que oremos por ti?"
          accion="Pide oración"
          href="/oracion"
          icono="handHeart"
        />
      </div>
    </PaginaPoster>
  );
}
