import { z } from 'zod';
import {
  checkbox,
  id,
  optionalEmail,
  optionalId,
  optionalText,
  requiredPhone,
  requiredText,
} from '@/lib/validators/common';

export const AREA_FIELDS = ['nombre', 'descripcion', 'responsable_id', 'orden', 'activo'] as const;

export const areaSchema = z.object({
  nombre: requiredText('el nombre del área (ej. Alabanza)', 120),
  descripcion: optionalText(2000),
  responsable_id: optionalId,
  orden: z.coerce.number({ error: 'El orden debe ser un número, ej. 1.' }).int().min(0).max(999),
  activo: checkbox,
});

export const VOLUNTARIO_FIELDS = [
  'area_id',
  'nombre',
  'telefono',
  'email',
  'disponibilidad',
  'mensaje',
  'acepta_datos',
] as const;

export const voluntarioSchema = z.object({
  // '' (sin elegir) se convierte en 0 y no pasa positive(): mismo mensaje en ambos casos.
  area_id: z.coerce
    .number({ error: 'Elige dónde te gustaría servir.' })
    .int({ error: 'Elige dónde te gustaría servir.' })
    .positive({ error: 'Elige dónde te gustaría servir.' }),
  nombre: requiredText('tu nombre', 120),
  telefono: requiredPhone,
  email: optionalEmail,
  disponibilidad: optionalText(255),
  mensaje: optionalText(1000),
  acepta_datos: z.preprocess(
    (v) => v === '1' || v === 'on',
    z.literal(true, { error: 'Para contactarte necesitamos tu permiso para guardar tus datos.' }),
  ),
});

export const VOLUNTARIO_ESTADOS = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'contactado', label: 'Contactado' },
  { value: 'sirviendo', label: 'Sirviendo' },
  { value: 'no_continua', label: 'No continúa' },
] as const;

export const voluntarioUpdateSchema = z.object({
  id,
  estado: z.enum(['nuevo', 'contactado', 'sirviendo', 'no_continua'], {
    error: 'Elige un estado.',
  }),
  notas: optionalText(1000),
});
