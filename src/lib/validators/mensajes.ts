import { z } from 'zod';
import {
  checkbox,
  optionalEmail,
  optionalPhone,
  optionalText,
  requiredText,
  whenValid,
} from '@/lib/validators/common';

const consent = z.preprocess((v) => v === '1' || v === 'on', z.boolean());
const CONSENT_ERROR =
  'Si dejas tus datos, necesitamos tu permiso para guardarlos. Marca la casilla o déjalos en blanco.';

/** Petición de oración: puede ser anónima; si deja datos, pide consentimiento. */
export const peticionSchema = z
  .object({
    nombre: optionalText(120),
    telefono: optionalPhone,
    email: optionalEmail,
    texto: requiredText('tu petición', 3000),
    es_privada: checkbox,
    acepta_datos: consent,
  })
  .refine((p) => p.acepta_datos || (!p.nombre && !p.telefono && !p.email), {
    path: ['acepta_datos'],
    error: CONSENT_ERROR,
    when: whenValid('nombre', 'telefono', 'email', 'acepta_datos'),
  });

/** Contacto: nombre, al menos un medio para responder y mensaje. */
export const contactoSchema = z
  .object({
    nombre: requiredText('tu nombre', 120),
    telefono: optionalPhone,
    email: optionalEmail,
    mensaje: requiredText('tu mensaje', 3000),
    acepta_datos: z.preprocess(
      (v) => v === '1' || v === 'on',
      z.literal(true, { error: 'Para responderte necesitamos tu permiso para guardar tus datos.' }),
    ),
  })
  .refine((c) => c.telefono || c.email, {
    path: ['telefono'],
    error: 'Déjanos un WhatsApp o un correo para poder responderte.',
    when: whenValid('telefono', 'email'),
  });
