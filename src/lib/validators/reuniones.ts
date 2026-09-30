import { z } from 'zod';
import {
  checkbox,
  diaSemana,
  hora,
  optionalHora,
  optionalId,
  optionalText,
  requiredText,
} from '@/lib/validators/common';

export const REUNION_FIELDS = [
  'nombre',
  'descripcion',
  'dia_semana',
  'hora_inicio',
  'hora_fin',
  'ubicacion_id',
  'rango_edad_id',
  'orden',
] as const;

export const reunionSchema = z
  .object({
    nombre: requiredText('el nombre (ej. Culto dominical)', 120),
    descripcion: optionalText(255),
    dia_semana: diaSemana,
    hora_inicio: hora,
    hora_fin: optionalHora,
    ubicacion_id: optionalId,
    rango_edad_id: optionalId,
    en_linea: checkbox,
    orden: z.coerce.number({ error: 'El orden debe ser un número, ej. 1.' }).int().min(0).max(999),
    activo: checkbox,
  })
  .refine((r) => !r.hora_fin || r.hora_fin > r.hora_inicio, {
    path: ['hora_fin'],
    error: 'La hora de fin debe ser después de la hora de inicio.',
  });
