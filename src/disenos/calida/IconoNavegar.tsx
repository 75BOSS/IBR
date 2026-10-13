/**
 * Flecha de navegación (avión de papel inclinado) de «Cómo llegar» en la franja de datos. No está
 * en `@/components/Icon` y esta propuesta no lo modifica: trazo «navigation» de Lucide (ISC),
 * mismo grosor y tamaño de caja que los demás íconos.
 */
export function IconoNavegar({ className = 'size-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
    >
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}
