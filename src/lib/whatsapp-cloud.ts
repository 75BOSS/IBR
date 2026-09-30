import 'server-only';
import { type EnvName, readEnv } from '@/lib/env';
import { normalizeEcuadorWhatsapp } from '@/lib/whatsapp';

const DEFAULT_API = 'https://graph.facebook.com/v21.0';

export type WhatsAppResult =
  { sent: true } | { sent: false; reason: 'sin-config' | 'numero-invalido' | 'error' };

/** Plantillas del sitio: cada una se nombra con su variable de entorno (ver .env.example). */
export type WhatsAppTemplate = Extract<
  EnvName,
  'WHATSAPP_TEMPLATE_SOLICITUD' | 'WHATSAPP_TEMPLATE_CODIGO'
>;

/**
 * Cuerpo de la API. `buttonCode`: las plantillas de autenticación de Meta llevan el código
 * también en su botón «Copiar código».
 */
export function templatePayload(
  to: string,
  template: string,
  params: string[],
  buttonCode?: string,
) {
  const components: object[] = [
    {
      type: 'body',
      parameters: params.map((text) => ({ type: 'text', text: text.slice(0, 1000) })),
    },
  ];
  if (buttonCode) {
    components.push({
      type: 'button',
      sub_type: 'url',
      index: '0',
      parameters: [{ type: 'text', text: buttonCode }],
    });
  }
  return {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: { name: template, language: { code: 'es' }, components },
  };
}

export function isWhatsAppConfigured(template: WhatsAppTemplate): boolean {
  return Boolean(
    readEnv('WHATSAPP_TOKEN') && readEnv('WHATSAPP_PHONE_NUMBER_ID') && readEnv(template),
  );
}

/**
 * Envía una plantilla aprobada por WhatsApp Cloud API. Si falta configurar o falla, se
 * registra en el log y devuelve el motivo; lo que la persona envió ya está guardado.
 * Se espera como máximo 8 s para no dejar colgado el formulario.
 */
export async function sendWhatsAppTemplate(message: {
  to: string | null | undefined;
  template: WhatsAppTemplate;
  params: string[];
  buttonCode?: string;
}): Promise<WhatsAppResult> {
  const token = readEnv('WHATSAPP_TOKEN');
  const phoneId = readEnv('WHATSAPP_PHONE_NUMBER_ID');
  const template = readEnv(message.template);
  if (!token || !phoneId || !template) return { sent: false, reason: 'sin-config' };
  const number = normalizeEcuadorWhatsapp(message.to);
  if (!number) {
    console.warn('[whatsapp] el número del destinatario no es de Ecuador o está vacío.');
    return { sent: false, reason: 'numero-invalido' };
  }
  try {
    const res = await fetch(`${readEnv('WHATSAPP_API_URL') ?? DEFAULT_API}/${phoneId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(templatePayload(number, template, message.params, message.buttonCode)),
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
