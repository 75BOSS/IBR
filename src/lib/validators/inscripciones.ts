import { z } from 'zod';
import { id, optionalEmail, requiredPhone, requiredText } from '@/lib/validators/common';

export const INSCRIPCION_FIELDS = [
  'nombre',
  'telefono',
  'email',
  'personas',
  'acepta_datos',
] as const;

export const inscripcionSchema = z.object({
  evento_id: id,
  nombre: requiredText('tu nombre', 120),
  telefono: requiredPhone,
  email: optionalEmail,
  personas: z.coerce
    .number({ error: 'Escribe cuántas personas vienen, ej. 2.' })
    .int({ error: 'Escribe cuántas personas vienen, ej. 2.' })
    .min(1, { error: 'Al menos 1 persona.' })
    .max(10, { error: 'Máximo 10 por inscripción. Si son más, escríbenos por WhatsApp.' }),
  acepta_datos: z.preprocess(
    (v) => v === '1' || v === 'on',
    z.literal(true, { error: 'Para inscribirte necesitamos tu permiso para guardar tus datos.' }),
  ),
});
