import { z } from 'zod';
import { emailSchema } from '@/lib/validators/auth';
import { optionalText, requiredText } from '@/lib/validators/common';

export const SUSCRIPCION_FIELDS = ['email', 'nombre', 'acepta_datos'] as const;

export const suscripcionSchema = z.object({
  email: emailSchema,
  nombre: optionalText(120),
  acepta_datos: z.preprocess(
    (v) => v === '1' || v === 'on',
    z.literal(true, {
      error: 'Para enviarte la agenda necesitamos tu permiso para guardar tu correo.',
    }),
  ),
});

export const envioSchema = z.object({
  asunto: requiredText('el asunto', 200),
  intro: optionalText(2000),
});
