import 'server-only';
import { type FormState, HONEYPOT_FIELD } from '@/lib/form-state';
import { type RateLimitForm, consumeRateLimit, minutesText } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/request';

export type PublicFormGuard = { ok: true; ip: string } | { ok: false; state: FormState };

/**
 * Pasos comunes de todo formulario público, después de validar con Zod (CLAUDE.md):
 * honeypot → límite por IP (5 envíos / 10 min). Al bot se le responde «recibido» sin guardar.
 */
export async function guardPublicForm(
  formData: FormData,
  form: RateLimitForm,
  successMessage: string,
): Promise<PublicFormGuard> {
  if (String(formData.get(HONEYPOT_FIELD) ?? '') !== '') {
    return { ok: false, state: { status: 'success', message: successMessage } };
  }
  const ip = await getClientIp();
  const limit = await consumeRateLimit(form, { ip });
  if (limit.blocked) {
    return {
      ok: false,
      state: {
        status: 'error',
        message: `Ya recibimos varios envíos desde tu conexión. Espera ${minutesText(limit.retryAfterMinutes)} y vuelve a intentar, o escríbenos por WhatsApp.`,
      },
    };
  }
  return { ok: true, ip };
}
