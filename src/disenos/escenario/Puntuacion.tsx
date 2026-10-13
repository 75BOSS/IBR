/**
 * Punto, coma o cierre de pregunta de un titular en la sans gruesa: Plus Jakarta Sans deja mucho aire antes de la
 * puntuación (≈ 0.14em a este peso) y en la propuesta va pegada a la palabra («Ven.»). Corrige
 * ese espacio óptico; `className` permite aplicarlo solo en un ancho (ej. `lg:`).
 */
export function Puntuacion({
  signo = '.',
  className = '-ml-[0.09em]',
}: {
  signo?: '.' | ',' | '?';
  className?: string;
}) {
  return <span className={className}>{signo}</span>;
}
