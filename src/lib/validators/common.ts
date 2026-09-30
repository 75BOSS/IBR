import { z } from 'zod';
import { normalizeEcuadorWhatsapp } from '@/lib/whatsapp';

/**
 * Piezas Zod compartidas. Los mensajes dicen qué pasó y cómo arreglarlo (Reglas Pixelia).
 * FormData entrega '' para campos vacíos y nada para los que el formulario no muestra: los
 * opcionales convierten ambos en null (antes un campo ausente daba un error en inglés).
 */

const emptyToNull = (value: unknown) =>
  value === undefined || (typeof value === 'string' && value.trim() === '') ? null : value;

export function requiredText(label: string, max: number) {
  return z
    .string({ error: `Escribe ${label}.` })
    .trim()
    .min(1, { error: `Escribe ${label}.` })
    .max(max, { error: `Es demasiado largo: máximo ${max} caracteres.` });
}

export function optionalText(max: number) {
  return z.preprocess(
    emptyToNull,
    z
      .string()
      .trim()
      .max(max, { error: `Es demasiado largo: máximo ${max} caracteres.` })
      .nullable(),
  );
}

export const optionalEmail = z.preprocess(
  emptyToNull,
  z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: 'Ese correo no parece válido, ej. nombre@correo.com.' }))
    .nullable(),
);

/** Teléfono de Ecuador guardado en formato local: 0991234567 (celular) o 032123456 (fijo). */
function toLocalPhone(value: string): string | null {
  const international = normalizeEcuadorWhatsapp(value);
  return international ? `0${international.slice(3)}` : null;
}

const PHONE_ERROR = 'El teléfono debe ser de Ecuador, ej. 0991234567 (celular) o 032123456 (fijo).';

export const requiredPhone = z
  .string({ error: 'Escribe un teléfono.' })
  .trim()
  .min(1, { error: 'Escribe un teléfono para poder contactarte.' })
  .transform((value, ctx) => {
    const phone = toLocalPhone(value);
    if (!phone) ctx.addIssue({ code: 'custom', message: PHONE_ERROR });
    return phone ?? value;
  });

export const optionalPhone = z.preprocess(
  emptyToNull,
  z
    .string()
    .nullable()
    .transform((value, ctx) => {
      if (value === null) return null;
      const phone = toLocalPhone(value);
      if (!phone) ctx.addIssue({ code: 'custom', message: PHONE_ERROR });
      return phone;
    }),
);

/** Número de WhatsApp para config: se guarda como 5939XXXXXXXX. */
export const optionalWhatsapp = z.preprocess(
  emptyToNull,
  z
    .string()
    .nullable()
    .transform((value, ctx) => {
      if (value === null) return null;
      const international = normalizeEcuadorWhatsapp(value);
      if (!international) ctx.addIssue({ code: 'custom', message: PHONE_ERROR });
      return international;
    }),
);

export const optionalUrl = z.preprocess(
  emptyToNull,
  z
    .string()
    .trim()
    .max(500, { error: 'El enlace es demasiado largo.' })
    .pipe(
      z.url({
        protocol: /^https?$/,
        error: 'El enlace debe empezar con https://, ej. https://instagram.com/ibr_riobamba.',
      }),
    )
    .nullable(),
);

/** Casilla: llega '1'/'on' marcada o nada. */
export const checkbox = z.preprocess(
  (value) => value === '1' || value === 'on' || value === true,
  z.boolean(),
);

export const id = z.coerce.number({ error: 'Falta el identificador.' }).int().positive();

export const optionalId = z.preprocess(emptyToNull, z.coerce.number().int().positive().nullable());

export const diaSemana = z.coerce
  .number({ error: 'Elige el día.' })
  .int()
  .min(1, { error: 'Elige el día.' })
  .max(7, { error: 'Elige el día.' });

/** 'HH:MM' (input type=time). */
export const hora = z
  .string({ error: 'Escribe la hora.' })
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, { error: 'Escribe la hora en formato 24 h, ej. 19:30.' });

export const optionalHora = z.preprocess(emptyToNull, hora.nullable());

/** 'YYYY-MM-DD' (input type=date). */
export const fecha = z
  .string({ error: 'Elige la fecha.' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'Elige la fecha en el calendario.' });

/**
 * Para `.refine()` entre campos: Zod no corre las reglas del objeto si algún campo falló, así
 * que la persona corregía un error y recién ahí le aparecía el siguiente. Con esto la regla se
 * evalúa siempre que los campos de los que depende sean válidos, y se ven todos los errores juntos.
 */
export function whenValid(...fields: string[]) {
  return (payload: z.core.ParsePayload) =>
    !payload.issues.some((issue) => fields.includes(String(issue.path?.[0])));
}

/** Convierte los fieldErrors de Zod al formato de FormState. */
export function fieldErrorsOf(error: z.ZodError): Record<string, string[]> {
  return z.flattenError(error).fieldErrors as Record<string, string[]>;
}

/** Los valores escritos (texto) para devolverlos tras un error. */
export function valuesOf(formData: FormData, fields: readonly string[]): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f, String(formData.get(f) ?? '')]));
}
