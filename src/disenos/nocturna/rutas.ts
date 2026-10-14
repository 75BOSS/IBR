/**
 * Páginas propias de la propuesta C · Nocturna (las mismas siete de `registro.ts`). El resto del
 * menú lleva a las páginas del sitio original (/oracion, /servir, /eventos…).
 */
const BASE = '/disenos/nocturna';

export const RUTAS = {
  inicio: BASE,
  comunidad: `${BASE}/comunidad`,
  primeraVisita: `${BASE}/primera-visita`,
  conocenos: `${BASE}/conocenos`,
  crecer: `${BASE}/crecer`,
  ministerios: `${BASE}/ministerios`,
  recursos: `${BASE}/recursos`,
} as const;
