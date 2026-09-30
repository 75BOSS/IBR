import { z } from 'zod';
import { fromLocalInputValue } from '@/lib/dates';
import {
  checkbox,
  optionalId,
  optionalText,
  optionalUrl,
  requiredText,
  whenValid,
} from '@/lib/validators/common';

export const EVENTO_CATEGORIAS = [
  { value: 'evento', label: 'Evento' },
  { value: 'noticia', label: 'Noticia' },
  { value: 'oracion', label: 'Oración' },
  { value: 'comunidad', label: 'Comunidad' },
  { value: 'musica', label: 'Música' },
  { value: 'capacitacion', label: 'Capacitación' },
] as const;

export const EVENTO_FIELDS = [
  'titulo',
  'resumen',
  'cuerpo',
  'categoria',
  'fecha_inicio',
  'fecha_fin',
  'ubicacion_id',
  'rango_edad_id',
  'link_externo',
] as const;

const localDateTime = (label: string) =>
  z.string({ error: `Elige ${label}.` }).transform((value, ctx) => {
    const date = fromLocalInputValue(value);
    if (!date) {
      ctx.addIssue({ code: 'custom', message: `Elige ${label} en el calendario.` });
      return z.NEVER;
    }
    return date;
  });

export const eventoSchema = z
  .object({
    titulo: requiredText('el título', 200),
    resumen: optionalText(300),
    cuerpo: optionalText(20000),
    categoria: z.enum(['evento', 'noticia', 'oracion', 'comunidad', 'musica', 'capacitacion'], {
      error: 'Elige una categoría.',
    }),
    fecha_inicio: localDateTime('la fecha y hora de inicio'),
    fecha_fin: z.preprocess(
      (v) => (v === '' ? null : v),
      localDateTime('la fecha y hora de fin').nullable(),
    ),
    todo_el_dia: checkbox,
    ubicacion_id: optionalId,
    rango_edad_id: optionalId,
    link_externo: optionalUrl,
    destacado: checkbox,
    publicado: checkbox,
  })
  .refine((e) => !e.fecha_fin || e.fecha_fin > e.fecha_inicio, {
    path: ['fecha_fin'],
    error: 'El fin debe ser después del inicio.',
    when: whenValid('fecha_inicio', 'fecha_fin'),
  });
