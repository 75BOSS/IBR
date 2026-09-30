import { z } from 'zod';
import { checkbox, optionalText, requiredText, whenValid } from '@/lib/validators/common';

export const MINISTERIO_FIELDS = [
  'nombre',
  'nombre_ministerio',
  'edad_min',
  'edad_max',
  'descripcion',
  'color',
  'orden',
  'activo',
] as const;

const edad = z.preprocess(
  (v) => (typeof v === 'string' && v.trim() === '' ? null : v),
  z.coerce
    .number({ error: 'La edad debe ser un número, ej. 12.' })
    .int({ error: 'La edad debe ser un número entero, ej. 12.' })
    .min(0, { error: 'La edad no puede ser negativa.' })
    .max(120, { error: 'Revisa la edad: máximo 120.' })
    .nullable(),
);

export const ministerioSchema = z
  .object({
    nombre: requiredText('el nombre del rango (ej. Jóvenes)', 80),
    nombre_ministerio: optionalText(80),
    edad_min: edad,
    edad_max: edad,
    descripcion: optionalText(2000),
    color: z.preprocess(
      (v) => (typeof v === 'string' && v.trim() === '' ? null : v),
      z
        .string()
        .trim()
        .regex(/^#[0-9a-fA-F]{6}$/, { error: 'Elige el color en el selector, ej. #0E5E6F.' })
        .nullable(),
    ),
    orden: z.coerce.number({ error: 'El orden debe ser un número, ej. 1.' }).int().min(0).max(999),
    activo: checkbox,
  })
  .refine((m) => m.edad_min === null || m.edad_max === null || m.edad_max >= m.edad_min, {
    path: ['edad_max'],
    error: 'La edad máxima debe ser mayor o igual que la mínima.',
    when: whenValid('edad_min', 'edad_max'),
  });
