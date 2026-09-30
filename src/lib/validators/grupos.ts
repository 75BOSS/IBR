import { z } from 'zod';
import {
  checkbox,
  optionalEmail,
  optionalHora,
  optionalId,
  optionalPhone,
  optionalText,
  requiredPhone,
  requiredText,
  optionalCupo,
} from '@/lib/validators/common';

export const GRUPO_FIELDS = [
  'nombre',
  'descripcion',
  'tipo',
  'rango_edad_id',
  'ubicacion_id',
  'dia_semana',
  'hora',
  'frecuencia',
  'lider_nombre',
  'lider_telefono',
  'lider_email',
  'cupo',
] as const;

export const grupoSchema = z.object({
  nombre: requiredText('el nombre del grupo', 120),
  descripcion: optionalText(2000),
  tipo: optionalText(60),
  rango_edad_id: optionalId,
  ubicacion_id: optionalId,
  dia_semana: z.preprocess(
    (v) => (v === '' || v == null ? null : v),
    z.coerce.number().int().min(1).max(7, { error: 'Elige el día.' }).nullable(),
  ),
  hora: optionalHora,
  frecuencia: z.enum(['semanal', 'quincenal', 'mensual'], {
    error: 'Elige cada cuánto se reúnen.',
  }),
  lider_nombre: optionalText(120),
  lider_telefono: optionalPhone,
  lider_email: optionalEmail,
  cupo: optionalCupo(500),
  publico: checkbox,
  activo: checkbox,
});

export const SOLICITUD_ESTADOS = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'contactado', label: 'Contactado' },
  { value: 'integrado', label: 'Integrado' },
  { value: 'rechazado', label: 'No continuó' },
] as const;

/** «Quiero unirme» desde el sitio público. */
export const unirmeSchema = z.object({
  grupo_id: z.coerce.number().int().positive(),
  nombre: requiredText('tu nombre', 120),
  telefono: requiredPhone,
  mensaje: optionalText(500),
  acepta_datos: z.preprocess(
    (v) => v === '1' || v === 'on',
    z.literal(true, {
      error: 'Para enviarte la información necesitamos tu permiso para guardar tus datos.',
    }),
  ),
});
