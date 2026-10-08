import { cssVars } from '@/lib/css-vars';

const FILL = {
  success: 'bg-success',
  danger: 'bg-danger',
  /** Sobre superficies oscuras (tarjeta `brand`). */
  inverse: 'bg-accent-soft',
} as const;

/**
 * Barra de avance (cupo de un evento, llegadas del check-in). Es decorativa: el número va escrito
 * al lado, así que se oculta a los lectores de pantalla.
 */
export function ProgressBar({
  percent,
  tone = 'success',
  title,
}: {
  /** 0 a 100; lo que pase de los bordes se recorta. */
  percent: number;
  tone?: keyof typeof FILL;
  title?: string;
}) {
  const value = Math.min(100, Math.max(0, percent));
  return (
    <div
      aria-hidden="true"
      title={title}
      style={cssVars({ '--progress': `${value}%` })}
      className={`h-2 overflow-hidden rounded-full ${tone === 'inverse' ? 'bg-surface/20' : 'bg-sunken'}`}
    >
      <div className={`h-full w-(--progress) rounded-full ${FILL[tone]}`} />
    </div>
  );
}
