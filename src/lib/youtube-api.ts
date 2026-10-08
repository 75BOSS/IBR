import 'server-only';
import { unstable_cache } from 'next/cache';
import { readEnv } from '@/lib/env';
import { youTubeWatchUrl } from '@/lib/youtube';

export type VideoInfo = {
  titulo: string;
  miniatura_url: string | null;
  /** 'YYYY-MM-DD' (solo con API key). */
  fecha: string | null;
  duracion_seg: number | null;
};

/** 'PT1H2M3S' → 3723. */
function isoDurationToSeconds(value: string): number | null {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(value);
  if (!m) return null;
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
}

/**
 * Datos del video al guardar una prédica (una sola vez; no en cada visita, CLAUDE.md).
 * Con YOUTUBE_API_KEY usa la Data API (título, fecha, duración); sin key, oEmbed (título y
 * miniatura). Devuelve null si YouTube no responde: entonces el título se escribe a mano.
 */
export async function fetchVideoInfo(videoId: string): Promise<VideoInfo | null> {
  const key = readEnv('YOUTUBE_API_KEY');
  try {
    if (key) {
      const url = new URL('https://www.googleapis.com/youtube/v3/videos');
      url.searchParams.set('part', 'snippet,contentDetails');
      url.searchParams.set('id', videoId);
      url.searchParams.set('key', key);
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const data = (await res.json()) as {
          items?: {
            snippet: {
              title: string;
              publishedAt: string;
              thumbnails?: Record<string, { url: string }>;
            };
            contentDetails: { duration: string };
          }[];
        };
        const item = data.items?.[0];
        if (item) {
          const thumbs = item.snippet.thumbnails ?? {};
          return {
            titulo: item.snippet.title,
            miniatura_url: (thumbs.maxres ?? thumbs.high ?? thumbs.medium)?.url ?? null,
            fecha: item.snippet.publishedAt.slice(0, 10),
            duracion_seg: isoDurationToSeconds(item.contentDetails.duration),
          };
        }
      }
    }
    const oembed = new URL('https://www.youtube.com/oembed');
    oembed.searchParams.set('url', youTubeWatchUrl(videoId));
    oembed.searchParams.set('format', 'json');
    const res = await fetch(oembed, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { title?: string; thumbnail_url?: string };
    return data.title
      ? {
          titulo: data.title,
          miniatura_url: data.thumbnail_url ?? null,
          fecha: null,
          duracion_seg: null,
        }
      : null;
  } catch (error) {
    console.warn(`[youtube] no se pudieron traer los datos de ${videoId}:`, error);
    return null;
  }
}

export type ChannelVideo = { videoId: string; titulo: string; publicado: string };

/**
 * Últimos videos del canal de la iglesia desde el feed público de YouTube (sin clave de API).
 * Respaldo de Prédicas mientras no haya prédicas cargadas en el panel: así «Prédicas» lleva a
 * los cultos reales desde el primer día. En caché 1 h (CLAUDE.md: YouTube nunca en cada visita).
 */
export const latestChannelVideos = unstable_cache(
  async (channelId: string): Promise<ChannelVideo[]> => {
    try {
      const url = new URL('https://www.youtube.com/feeds/videos.xml');
      url.searchParams.set('channel_id', channelId);
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) return [];
      const xml = await res.text();
      const decode = (text: string) =>
        text
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
      const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap(([, entry = '']) => {
        const videoId = entry.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1];
        const titulo = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1];
        const publicado = entry.match(/<published>([^<]+)<\/published>/)?.[1];
        // «🔴» marca la transmisión en vivo; aquí ya es una grabación.
        return videoId && titulo && publicado
          ? [
              {
                videoId,
                titulo: decode(titulo)
                  .replace(/^🔴\s*/u, '')
                  .trim(),
                publicado,
              },
            ]
          : [];
      });
      // El canal sube la transmisión y luego la versión editada con el mismo título: se queda
      // la más reciente (el feed viene de la más nueva a la más antigua).
      const seen = new Set<string>();
      return videos.filter((v) => !seen.has(v.titulo) && Boolean(seen.add(v.titulo)));
    } catch (error) {
      console.warn('[youtube] no se pudo leer el feed del canal:', error);
      return [];
    }
  },
  ['youtube-canal'],
  { revalidate: 3600 },
);
