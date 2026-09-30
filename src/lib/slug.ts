/** 'Él es mi Pastor: Salmo 23' → 'el-es-mi-pastor-salmo-23' (para URLs). */
export function slugify(text: string, max = 180): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
    .replace(/-+$/g, '');
}
