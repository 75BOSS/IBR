import { z } from 'zod';
import {
  optionalEmail,
  optionalId,
  optionalPhone,
  optionalText,
  requiredPhone,
  requiredText,
} from '@/lib/validators/common';

export const SITUACIONES = [
  { value: 'primera_visita', label: 'Es mi primera vez' },
  { value: 'decidio_seguir', label: 'Decidí seguir a Jesús' },
  { value: 'rededicacion', label: 'Quiero volver a comprometerme con Dios' },
  { value: 'quiere_membresia', label: 'Quiero ser parte de la iglesia' },
  { value: 'otro', label: 'Otro' },
] as const;

export const COMO_LLEGO = [
  { value: 'amigo', label: 'Me invitó un amigo o familiar' },
  { value: 'redes', label: 'Redes sociales' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'pasaba', label: 'Pasaba por aquí' },
  { value: 'otro', label: 'Otro' },
] as const;

export const ORIGENES = [
  { value: 'web', label: 'Sitio web' },
  { value: 'presencial', label: 'Presencial' },
  { value: 'redes', label: 'Redes' },
  { value: 'evento', label: 'Evento' },
  { value: 'otro', label: 'Otro' },
] as const;

export const REGISTRO_ESTADOS = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'contactado', label: 'Contactado' },
  { value: 'integrado', label: 'Integrado' },
  { value: 'sin_respuesta', label: 'Sin respuesta' },
] as const;

export const REGISTRO_FIELDS = [
  'nombres',
  'apellidos',
  'telefono',
  'email',
  'rango_edad_id',
  'sector',
  'situacion',
  'como_llego',
  'peticion',
] as const;

const situacion = z.preprocess(
  (v) => (v === '' ? null : v),
  z
    .enum(['primera_visita', 'decidio_seguir', 'rededicacion', 'quiere_membresia', 'otro'])
    .nullable(),
);
const comoLlego = z.preprocess(
  (v) => (v === '' ? null : v),
  z.enum(['amigo', 'redes', 'youtube', 'pasaba', 'otro']).nullable(),
);

const base = {
  nombres: requiredText('tu nombre', 120),
  apellidos: optionalText(120),
  email: optionalEmail,
  rango_edad_id: optionalId,
  sector: optionalText(80),
  situacion,
  como_llego: comoLlego,
  peticion: optionalText(2000),
};

/** «Soy nuevo» (público): teléfono y consentimiento obligatorios. */
export const soyNuevoSchema = z.object({
  ...base,
  telefono: requiredPhone,
  acepta_datos: z.preprocess(
    (v) => v === '1' || v === 'on',
    z.literal(true, {
      error: 'Para poder contactarte necesitamos tu permiso para guardar tus datos.',
    }),
  ),
});

/** Registro manual desde el panel (visita presencial, evento…). */
export const registroAdminSchema = z.object({
  ...base,
  nombres: requiredText('el nombre', 120),
  telefono: optionalPhone,
  origen: z.enum(['web', 'presencial', 'redes', 'evento', 'otro'], { error: 'Elige el origen.' }),
});
