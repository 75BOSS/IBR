/**
 * Número de WhatsApp de Ecuador en formato internacional sin + (5939XXXXXXXX), a partir de lo
 * que se suele escribir: 09XXXXXXXX, +593 9…, +593 09…, 00593…, fijos 03XXXXXXX.
 * Devuelve null si no es un número de Ecuador válido. Úsese también al guardar en /admin/config.
 */
export function normalizeEcuadorWhatsapp(number: string | null | undefined): string | null {
  let digits = number?.replace(/\D/g, '') ?? '';
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('5930')) digits = `593${digits.slice(4)}`;
  else if (digits.startsWith('0')) digits = `593${digits.slice(1)}`;
  // 593 + 9 dígitos (celular) o + 8 dígitos (fijo con código de provincia).
  return /^593\d{8,9}$/.test(digits) ? digits : null;
}

/** Enlace wa.me con mensaje opcional; null si el número no es usable. */
export function whatsappHref(number: string | null | undefined, message?: string): string | null {
  const international = normalizeEcuadorWhatsapp(number);
  if (!international) return null;
  const url = new URL(`https://wa.me/${international}`);
  if (message) url.searchParams.set('text', message);
  return url.toString();
}
