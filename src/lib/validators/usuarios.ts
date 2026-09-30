import { z } from 'zod';
import { passwordProblem } from '@/lib/password';
import { emailSchema } from '@/lib/validators/auth';
import { checkbox, requiredText, whenValid } from '@/lib/validators/common';

export const USUARIO_FIELDS = ['nombre', 'email', 'rol', 'activo'] as const;

export const usuarioSchema = z.object({
  nombre: requiredText('el nombre', 120),
  email: z
    .string({ error: 'Escribe el correo de la persona.' })
    .trim()
    .min(1, { error: 'Escribe el correo de la persona.' })
    .pipe(emailSchema),
  rol: z.enum(['admin', 'editor'], { error: 'Elige el rol: Administrador o Editor.' }),
  activo: checkbox,
});

const newPassword = z
  .string({ error: 'Escribe la contraseña nueva.' })
  .superRefine((value, ctx) => {
    const problem = passwordProblem(value);
    if (problem) ctx.addIssue({ code: 'custom', message: problem });
  });

export const cambioClaveSchema = z
  .object({
    actual: z
      .string({ error: 'Escribe tu contraseña actual.' })
      .min(1, { error: 'Escribe tu contraseña actual.' })
      .max(200, { error: 'La contraseña es demasiado larga.' }),
    nueva: newPassword,
    repetir: z.string({ error: 'Repite la contraseña nueva.' }),
  })
  .refine((d) => d.nueva === d.repetir, {
    path: ['repetir'],
    error: 'No coincide con la contraseña nueva. Escríbela igual en los dos campos.',
    when: whenValid('nueva', 'repetir'),
  })
  .refine((d) => d.nueva !== d.actual, {
    path: ['nueva'],
    error: 'La contraseña nueva debe ser distinta de la actual.',
    when: whenValid('actual', 'nueva'),
  });
