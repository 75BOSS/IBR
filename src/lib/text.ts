/** Párrafos de un texto largo escrito en el panel (separados por una línea en blanco). */
export function paragraphs(value: string | null | undefined): string[] {
  return (value ?? '')
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
