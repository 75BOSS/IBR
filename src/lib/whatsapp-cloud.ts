import 'server-only';
import { readEnv } from '@/lib/env';
import { normalizeEcuadorWhatsapp } from '@/lib/whatsapp';

const DEFAULT_API = 'https://graph.facebook.com/v21.0';

export type WhatsAppResult =
  { sent: true } | { sent: false; reason: 'sin-config' | 'numero-invalido' | 'error' };

/** Cuerpo de la API para una plantilla con parámetros de texto en el cuerpo. */
export function templatePayload(to: string, template: string, params: string[]) {
  return {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: template,
      language: { code: 'es' },
      components: [
        {
          type: 'body',
          parameters: params.map((text) => ({ type: 'text', text: text.slice(0, 1000) })),
        },
      ],
    },
  };
}

/**
 * Envía una plantilla aprobada por WhatsApp Cloud API. Igual que el correo, es un aviso extra:
 * si falta configurar o falla, se registra en el log y lo que la persona envió ya está guardado.
 * Se espera como máximo 8 s para no dejar colgado el formulario.
 */
export async function sendWhatsAppTemplate(
  to: string | null | undefined,
  params: string[],
): Promise<WhatsAppResult> {
  const token = readEnv('WHATSAPP_TOKEN');
  const phoneId = readEnv('WHATSAPP_PHONE_NUMBER_ID');
  const template = readEnv('WHATSAPP_TEMPLATE_SOLICITUD');
  if (!token || !phoneId || !template) return { sent: false, reason: 'sin-config' };
  const number = normalizeEcuadorWhatsapp(to);
  if (!number) {
    console.warn('[whatsapp] el número del destinatario no es de Ecuador o está vacío:', to);
    return { sent: false, reason: 'numero-invalido' };
  }
  try {
    const res = await fetch(`${readEnv('WHATSAPP_API_URL') ?? DEFAULT_API}/${phoneId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(templatePayload(number, template, params)),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[whatsapp] la API respondió ${res.status}:`, await res.text());
      return { sent: false, reason: 'error' };
    }
    return { sent: true };
  } catch (error) {
    console.error('[whatsapp] no se pudo enviar:', error);
    return { sent: false, reason: 'error' };
  }
}
