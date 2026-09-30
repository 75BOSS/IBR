import { z } from 'zod';
import { checkbox, optionalText, optionalUrl, requiredText } from '@/lib/validators/common';

export const UBICACION_FIELDS = [
  'nombre',
  'tipo',
  'direccion',
  'referencia',
  'zona',
  'maps_url',
] as const;

export const ubicacionSchema = z.object({
  nombre: requiredText('el nombre del lugar', 120),
  tipo: z.enum(['sede', 'casa', 'en_linea', 'otro'], { error: 'Elige el tipo de lugar.' }),
  direccion: optionalText(255),
  referencia: optionalText(255),
  zona: optionalText(80),
  maps_url: optionalUrl,
  publica: checkbox,
  activo: checkbox,
});
