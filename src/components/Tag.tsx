import type { CSSProperties, ReactNode } from 'react';

export type TagTone = 'neutral' | 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'inverse';

const tones: Record<TagTone, string> = {
  neutral: 'bg-sunken text-ink-soft',
  brand: 'bg-brand-soft text-brand-strong',
  accent: 'bg-accent-soft text-accent-strong',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger-strong',
  /** Sobre superficies oscuras (barra lateral, pie). */
  inverse: 'bg-sidebar-ink/12 text-sidebar-ink',
};

/**
 * Etiqueta corta (estado, rango de edad, categoría). `color` permite el color propio de un
 * ministerio (rangos_edad.color) como punto de acento sin perder el contraste del texto.
 */
export function Tag({
  children,
  tone = 'neutral',
  color,
  className = '',
}: {
  children: ReactNode;
  tone?: TagTone;
  color?: string | null;
  className?: string;
}) {
  const style = color ? ({ '--tag-dot': color } as CSSProperties) : undefined;
  return (
    <span
      style={style}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${tones[tone]} ${className}`}
    >
      {color && <span className="size-2 rounded-full bg-(--tag-dot)" aria-hidden="true" />}
      {children}
    </span>
  );
}
