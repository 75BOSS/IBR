import type { ReactNode } from 'react';

/** Ritmo de las páginas interiores: secciones grandes apiladas con aire fluido entre ellas. */
export function RitmoPagina({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[clamp(4rem,8vw,7rem)] pt-[clamp(1.25rem,2.2vw,2rem)]">
      {children}
    </div>
  );
}
