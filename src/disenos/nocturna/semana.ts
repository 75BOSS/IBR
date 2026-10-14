/**
 * El día del plan de devocionales que toca hoy (de lunes a viernes). `fecha` es la fecha de
 * Ecuador 'YYYY-MM-DD' (`todayInChurchTz()`). Sábado y domingo no tienen lectura: se muestra la
 * del lunes como la próxima.
 */
export function devocionalDeHoy<T>(
  plan: T[],
  fecha: string,
): { devocional: T; indice: number; hoy: boolean } | null {
  if (plan.length === 0) return null;
  // getUTCDay sobre el mediodía UTC de esa fecha: 0 = domingo … 6 = sábado.
  const dia = new Date(`${fecha}T12:00:00Z`).getUTCDay();
  const indice = dia >= 1 && dia <= plan.length ? dia - 1 : 0;
  const devocional = plan[indice];
  if (devocional === undefined) return null;
  return { devocional, indice, hoy: dia >= 1 && dia <= plan.length };
}
