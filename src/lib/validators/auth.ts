import { z } from 'zod';

export const emailSchema = z
  .string({ error: 'Escribe tu correo.' })
  .trim()
  .toLowerCase()
  .min(1, { error: 'Escribe tu correo.' })
  .pipe(
    z.email({
      error: 'Ese correo no parece válido. Revisa que tenga @ y dominio, ej. nombre@correo.com.',
    }),
  )
  .pipe(z.string().max(190, { error: 'El correo es demasiado largo (máximo 190 caracteres).' }));

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string({ error: 'Escribe tu contraseña.' })
    .min(1, { error: 'Escribe tu contraseña.' })
    .max(200, { error: 'La contraseña es demasiado larga.' }),
});

export type LoginInput = z.infer<typeof loginSchema>;

/** Solo rutas internas del panel: evita redirecciones abiertas con ?next=. */
export function safeAdminPath(value: unknown): string {
  if (typeof value !== 'string') return '/admin';
  const inPanel = value === '/admin' || value.startsWith('/admin/') || value.startsWith('/admin?');
  if (!inPanel || value.startsWith('/admin/login')) return '/admin';
  if (value.includes('//') || value.includes('\\')) return '/admin';
  return value;
}
