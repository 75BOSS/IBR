import 'server-only';
import { CONFIG_DEFAULTS, getSiteConfig } from '@/lib/config';
import { parseCreencias } from '@/lib/config-fields';
import { DAY_NAMES, formatDateOnly, formatDateTime, formatTime } from '@/lib/dates';
import { listEquipoVisible, listPastores } from '@/lib/equipo';
import { listUpcomingEventos } from '@/lib/eventos';
import { listGruposPublicos } from '@/lib/grupos';
import { directionsUrl } from '@/lib/maps';
import { listMinisterios } from '@/lib/ministerios';
import { socialLinks, visibleNav } from '@/lib/nav';
import { listPredicas } from '@/lib/predicas';
import { listReuniones } from '@/lib/reuniones';
import { listAreas } from '@/lib/servir';
import { getSiteContent } from '@/lib/site-content';
import { getChurchStats } from '@/lib/stats';
import { latestChannelVideos } from '@/lib/youtube-api';

/**
 * Datos que comparten todas las propuestas de diseño. Cada propuesta dibuja a su manera, pero
 * lee lo mismo y con las mismas reglas que el sitio original (un enlace solo aparece si a donde
 * lleva tiene contenido: `content` y `nav`). Así ninguna propuesta inventa consultas ni datos.
 */

/** Lo que va en el encabezado y el pie de cualquier propuesta. */
export async function datosMarco() {
  const [config, content] = await Promise.all([getSiteConfig(), getSiteContent()]);
  return {
    config,
    content,
    nav: visibleNav(content),
    redes: socialLinks(config),
    nombre: config.nombre_iglesia ?? CONFIG_DEFAULTS.nombre_iglesia,
    /** «Cómo llegar»: Google Maps de la iglesia o búsqueda de la dirección; null = sin botón. */
    comoLlegar: directionsUrl(config.maps_url, config.direccion),
  };
}

/** Días y horas de reunión sin repetir (hay reuniones a la misma hora para distintas edades). */
function horariosUnicos(reuniones: Awaited<ReturnType<typeof listReuniones>>): string[] {
  return [
    ...new Set(reuniones.map((r) => `${DAY_NAMES[r.dia_semana]} ${formatTime(r.hora_inicio)}`)),
  ];
}

/** Portada: marco + horarios, última prédica, próximos eventos, ministerios y pastores. */
export async function datosPortada() {
  const [marco, reuniones, eventos, predicas, pastores, ministerios] = await Promise.all([
    datosMarco(),
    listReuniones({ soloActivas: true }),
    listUpcomingEventos(6),
    listPredicas({ soloPublicadas: true, limit: 1 }),
    listPastores(),
    listMinisterios({ soloActivos: true, conContenido: true }),
  ]);
  const { config } = marco;
  // Última prédica: la del panel o, si aún no hay, el último culto del canal de YouTube.
  const [predica] = predicas;
  const [ultimoVideo] =
    predica || !config.youtube_channel_id
      ? []
      : await latestChannelVideos(config.youtube_channel_id);
  const ultimaPredica = predica
    ? {
        videoId: predica.youtube_id,
        titulo: predica.titulo,
        serie: predica.serie,
        meta: [predica.predicador, predica.pasaje, formatDateOnly(predica.fecha)]
          .filter(Boolean)
          .join(' · '),
      }
    : ultimoVideo
      ? {
          videoId: ultimoVideo.videoId,
          titulo: ultimoVideo.titulo,
          serie: null,
          meta: `Publicado el ${formatDateTime(new Date(ultimoVideo.publicado), { dateStyle: 'long' })}`,
        }
      : null;
  return {
    ...marco,
    reuniones,
    horarios: horariosUnicos(reuniones),
    eventos,
    ultimaPredica,
    pastores,
    ministerios,
  };
}

/** Comunidad (propuestas A, B, C y E): grupos en casa, ministerios por edad y áreas de servicio. */
export async function datosComunidad() {
  const [marco, grupos, ministerios, areas] = await Promise.all([
    datosMarco(),
    listGruposPublicos({}),
    listMinisterios({ soloActivos: true, conContenido: true }),
    listAreas({ soloActivas: true }),
  ]);
  return { ...marco, grupos, ministerios, areas };
}

/** Primera visita (propuesta D): horarios y ministerios para «ven en familia». */
export async function datosPrimeraVisita() {
  const [marco, reuniones, ministerios] = await Promise.all([
    datosMarco(),
    listReuniones({ soloActivas: true }),
    listMinisterios({ soloActivos: true, conContenido: true }),
  ]);
  return { ...marco, reuniones, horarios: horariosUnicos(reuniones), ministerios };
}

/** Conócenos: historia, misión, visión, creencias y equipo (de la config) y cifras reales. */
export async function datosConocenos() {
  const [marco, equipo, cifras] = await Promise.all([
    datosMarco(),
    listEquipoVisible(),
    getChurchStats(),
  ]);
  const { config } = marco;
  return {
    ...marco,
    historia: config.nosotros_historia,
    mision: config.nosotros_mision,
    vision: config.vision,
    creencias: parseCreencias(config.nosotros_creencias),
    imagen: config.nosotros_imagen,
    anioFundacion: config.anio_fundacion,
    equipo,
    cifras,
  };
}

/** Ministerios: los de la BD (con sus reuniones y grupos) para mostrarlos junto a los de ejemplo. */
export async function datosMinisterios() {
  const [marco, ministerios, reuniones, grupos] = await Promise.all([
    datosMarco(),
    listMinisterios({ soloActivos: true, conContenido: true }),
    listReuniones({ soloActivas: true }),
    listGruposPublicos({}),
  ]);
  return { ...marco, ministerios, reuniones, grupos };
}

/** Crecer: horarios y áreas de servicio reales para la ruta de crecimiento. */
export async function datosCrecer() {
  const [marco, reuniones, areas, grupos] = await Promise.all([
    datosMarco(),
    listReuniones({ soloActivas: true }),
    listAreas({ soloActivas: true }),
    listGruposPublicos({}),
  ]);
  return { ...marco, horarios: horariosUnicos(reuniones), areas, grupos };
}

/** Recursos: prédicas del panel o, si no hay, los últimos videos del canal de YouTube. */
export async function datosRecursos() {
  const [marco, predicas] = await Promise.all([
    datosMarco(),
    listPredicas({ soloPublicadas: true, limit: 6 }),
  ]);
  const { config } = marco;
  const videos =
    predicas.length > 0 || !config.youtube_channel_id
      ? []
      : (await latestChannelVideos(config.youtube_channel_id)).slice(0, 6);
  return { ...marco, predicas, videos };
}
