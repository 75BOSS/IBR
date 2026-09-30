import { z } from 'zod';
import { checkbox, fecha, optionalText } from '@/lib/validators/common';
import { parseYouTubeId } from '@/lib/youtube';

export const PREDICA_FIELDS = [
  'enlace',
  'titulo',
  'fecha',
  'predicador',
  'serie',
  'pasaje',
  'descripcion',
] as const;

export const predicaSchema = z.object({
  enlace: z
    .string({ error: 'Pega el enlace del video de YouTube.' })
    .trim()
    .min(1, { error: 'Pega el enlace del video de YouTube.' })
    .transform((value, ctx) => {
      const id = parseYouTubeId(value);
      if (!id) {
        ctx.addIssue({
          code: 'custom',
          message: 'No reconocemos ese enlace. En YouTube: Compartir → Copiar, y pégalo aquí.',
        });
        return z.NEVER;
      }
      return id;
    }),
  titulo: optionalText(200),
  fecha: z.preprocess((v) => (v === '' ? null : v), fecha.nullable()),
  predicador: optionalText(120),
  serie: optionalText(120),
  pasaje: optionalText(120),
  descripcion: optionalText(2000),
  destacada: checkbox,
  publicada: checkbox,
});
