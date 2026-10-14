import type { Metadata } from 'next';
import { DEVOCIONALES, SERIES, TESTIMONIOS } from '@/disenos/contenido';
import { datosRecursos } from '@/disenos/datos';
import { Marquesina } from '@/disenos/vibrante/animacion/Marquesina';
import { FlechaEnlace } from '@/disenos/vibrante/FlechaEnlace';
import { FOTOS } from '@/disenos/vibrante/fotos';
import { PortadaPagina } from '@/disenos/vibrante/PortadaPagina';
import {
  Canales,
  Devocionales,
  type Mensaje,
  Predicas,
  Series,
  diaDeHoy,
} from '@/disenos/vibrante/recursos/SeccionesRecursos';
import { CabeceraSeccion, Seccion } from '@/disenos/vibrante/Seccion';
import { Testimonios } from '@/disenos/vibrante/secciones/Testimonios';
import { formatDateOnly, formatDateTime, todayInChurchTz } from '@/lib/dates';
import { youTubeWatchUrl } from '@/lib/youtube';

export const revalidate = 300;

export const metadata: Metadata = { title: 'B · Vibrante · Recursos' };

/**
 * Recursos de la propuesta B · Vibrante (como Recursos de caminodevida): prédicas (del panel o
 * del canal de YouTube), series, devocionales de la semana, testimonios y canales (redes reales).
 */
export default async function VibranteRecursos() {
  const { content, predicas, videos, redes } = await datosRecursos();

  // Prédicas del panel (llevan a /predicas) o, si aún no hay, los videos del canal (a YouTube).
  const mensajes: Mensaje[] =
    predicas.length > 0
      ? predicas.map((p) => ({
          videoId: p.youtube_id,
          titulo: p.titulo,
          meta: [p.serie, p.predicador, formatDateOnly(p.fecha)].filter(Boolean).join(' · '),
          href: content.predicas ? '/predicas' : youTubeWatchUrl(p.youtube_id),
          externo: !content.predicas,
        }))
      : videos.map((v) => ({
          videoId: v.videoId,
          titulo: v.titulo,
          meta: `Publicado el ${formatDateTime(new Date(v.publicado), { dateStyle: 'long' })}`,
          href: youTubeWatchUrl(v.videoId),
          externo: true,
        }));

  return (
    <>
      <PortadaPagina
        id="recursos-titulo"
        fondo="negro"
        etiqueta="Recursos"
        lineas={['Palabra para']}
        enfasis="cada día."
        texto="Prédicas, devocionales e historias de la familia para que la fe te acompañe toda la semana."
        fotos={[FOTOS.predicador, FOTOS.escenario, FOTOS.vidaAlabanza]}
      />
      <Predicas mensajes={mensajes} verTodas={content.predicas} />
      <Series series={SERIES} verPredicas={content.predicas} />
      <Devocionales dias={DEVOCIONALES} hoy={diaDeHoy(todayInChurchTz())} />
      <Marquesina
        tono="rojo"
        inverso
        etiqueta="La Palabra cambia vidas"
        palabras={['La Palabra cambia vidas', 'Ora', 'Lee', 'Comparte']}
      />
      <Seccion tono="hundido" id="testimonios" tituloId="testimonios-titulo">
        <Testimonios
          testimonios={TESTIMONIOS}
          cabecera={
            <div className="flex flex-wrap items-end justify-between gap-4">
              <CabeceraSeccion
                etiqueta="Testimonios"
                id="testimonios-titulo"
                lineas={['Historias', <em key="reales">reales.</em>]}
                texto="Lo que Dios está haciendo en la familia de IBR (testimonios de ejemplo)."
                className="min-w-[min(100%,18rem)] flex-1"
              />
              <FlechaEnlace href="/contacto#mensaje">Cuéntanos tu historia</FlechaEnlace>
            </div>
          }
        />
      </Seccion>
      <Canales redes={redes} />
    </>
  );
}
