/**
 * Flecha de navegación («Cómo llegar» de la franja, imagen 10). No está en el mapa compartido de
 * `@/components/Icon`; vive aquí mientras la propuesta no sea la elegida. Trazo de Lucide
 * («navigation», ISC). Decorativo: el texto del enlace dice a dónde lleva.
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
      className={className}
    >
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}
