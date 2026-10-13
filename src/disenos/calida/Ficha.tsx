import Link from 'next/link';
import type { ReactNode } from 'react';
import { toneVar } from '@/lib/css-vars';

/**
 * Ficha redonda con un dato real (un ministerio, un área de servicio). `tono`: el color del
 * ministerio guardado en la BD, como punto (`--tone`). Con `href` es un enlace.
 */
export function Ficha({
  children,
  detalle,
  tono,
  href,
}: {
  children: ReactNode;
  /** Texto secundario (ej. «3 a 11 años»). */
  detalle?: string | null;
  tono?: string | null;
  href?: string;
}) {
  const contenido = (
    <>
      {tono !== undefined && (
        <span
          aria-hidden="true"
          style={toneVar(tono, 'var(--color-accent)')}
          className="size-2.5 shrink-0 rounded-full bg-(--tone)"
        />
      )}
      <span className="font-semibold text-ink">{children}</span>
      {detalle && <span className="text-ink-soft">{detalle}</span>}
    </>
  );
  const clases =
    'inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-[clamp(0.8125rem,0.78rem+0.15vw,0.9rem)] ring-1 ring-line';
  return href ? (
    <Link href={href} className={`${clases} transition-shadow hover:ring-accent`}>
      {contenido}
    </Link>
  ) : (
    <span className={clases}>{contenido}</span>
  );
}
