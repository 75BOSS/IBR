/*
 * Íconos que la propuesta usa y el mapa compartido (`@/components/Icon`) aún no tiene. Trazos de
 * Lucide (ISC, © Lucide Icons and Contributors), dibujados igual que Icon: 24×24, trazo 2.
 * Si la iglesia elige esta propuesta, pasan al mapa de Icon.tsx y este archivo se borra.
 */

const TRAZO = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

/** Flecha de navegación («Cómo llegar»). Lucide `navigation`. */
export function IconoNavegar({ className = 'size-5' }: { className?: string }) {
  return (
    <svg {...TRAZO} className={`shrink-0 ${className}`}>
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

/** Play dentro de un círculo («Ver prédicas»). Lucide `circle-play`. */
export function IconoPlayCirculo({ className = 'size-5' }: { className?: string }) {
  return (
    <svg {...TRAZO} className={`shrink-0 ${className}`}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z" />
    </svg>
  );
}
