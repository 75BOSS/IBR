import 'server-only';
import { getSiteConfig } from '@/lib/config';
import { query } from '@/lib/db';
import { type LiveSlot, isInBroadcastWindow } from '@/lib/live';

export type LiveStatus = {
  activo: boolean;
  youtube_id: null;
  channel_id: string | null;
  canal_url: string | null;
};

/**
 * ¿Mostrar «En vivo»? Si lo activaron en /admin/config o si hay una reunión transmitida en
 * curso. youtube_id va null: sin API se incrusta la transmisión del canal (live_stream).
 */
export async function getLiveStatus(now = new Date()): Promise<LiveStatus> {
  const [config, slots] = await Promise.all([
    getSiteConfig(),
    query<LiveSlot>(
      'SELECT dia_semana, hora_inicio, hora_fin FROM reuniones WHERE activo = 1 AND en_linea = 1',
    ),
  ]);
  return {
    activo: config.en_vivo_activo === '1' || isInBroadcastWindow(slots, now),
    youtube_id: null,
    channel_id: config.youtube_channel_id,
    canal_url: config.youtube,
  };
}
