/**
 * Enlace wa.me desde el número guardado en config (5939XXXXXXXX sin +). Acepta también el
 * formato local 09XXXXXXXX y lo convierte a +593. Devuelve null si no hay número usable.
 */
export function whatsappHref(number: string | null | undefined, message?: string): string | null {
  const digits = number?.replace(/\D/g, '') ?? '';
  const international = digits.startsWith('0') ? `593${digits.slice(1)}` : digits;
  if (international.length < 11) return null;
  const url = new URL(`https://wa.me/${international}`);
  if (message) url.searchParams.set('text', message);
  return url.toString();
}
