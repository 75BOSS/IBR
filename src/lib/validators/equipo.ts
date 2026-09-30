import { z } from 'zod';
import { checkbox, optionalText, requiredText } from '@/lib/validators/common';

export const EQUIPO_FIELDS = ['nombre', 'rol', 'bio', 'orden'] as const;

export const equipoSchema = z.object({
  nombre: requiredText('el nombre', 120),
  rol: requiredText('el rol (ej. Pastor principal)', 120),
  bio: optionalText(1500),
  es_pastor: checkbox,
  visible: checkbox,
  orden: z.coerce.number({ error: 'El orden debe ser un número, ej. 1.' }).int().min(0).max(999),
});
