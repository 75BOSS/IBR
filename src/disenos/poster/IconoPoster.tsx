import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';

/*
 * Íconos que la propuesta usa y el sitio base no tiene (corazón de «Comunidad», montaña de
 * «Riobamba», play en círculo, mensajes). Trazos de Lucide (ISC, © Lucide Icons and
 * Contributors), como el resto de íconos del proyecto. Si se elige esta propuesta, pasan al mapa
 * de `src/components/Icon.tsx` y este archivo desaparece.
 */
const PROPIOS = {
  corazon: (
    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
  ),
  montana: (
    <>
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      <path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19" />
    </>
  ),
  playCirculo: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z" />
    </>
  ),
  playCuadro: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="M10 8.5v7l6-3.5z" />
    </>
  ),
  mensajes: (
    <>
      <path d="M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      <path d="M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1" />
    </>
  ),
  familia: (
    <>
      <path d="M18 21a8 8 0 0 0-16 0" />
      <circle cx="10" cy="8" r="5" />
      <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconoPosterNombre = keyof typeof PROPIOS | IconName;

/** Un ícono propio de la propuesta o, si no lo es, el del proyecto (`Icon`). Decorativo. */
export function IconoPoster({
  nombre,
  className = 'size-5',
}: {
  nombre: IconoPosterNombre;
  className?: string;
}) {
  if (!(nombre in PROPIOS)) return <Icon name={nombre as IconName} className={className} />;
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
      {PROPIOS[nombre as keyof typeof PROPIOS]}
    </svg>
  );
}
