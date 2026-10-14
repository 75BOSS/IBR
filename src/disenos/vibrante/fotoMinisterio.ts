import { FOTOS, type FotoVibrante } from '@/disenos/vibrante/fotos';
import { type Ministerio, ministerioName } from '@/lib/ministerios';

/** Foto de un ministerio: la de la BD o, si aún no tiene, la de los niños de la propuesta. */
export function fotoMinisterio(m: Ministerio): FotoVibrante {
  const alt = `Ministerio ${ministerioName(m)}`;
  return m.imagen_url ? { src: m.imagen_url, alt } : { ...FOTOS.kids, alt };
}
