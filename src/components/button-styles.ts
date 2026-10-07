/**
 * Estilos de botón compartidos. Módulo sin 'use client': se puede llamar desde Server y
 * Client Components (una función exportada desde un módulo cliente no se puede ejecutar
 * en el servidor).
 */
export type ButtonVariant =
  | 'primary'
  | 'accent'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'dangerGhost'
  | 'inverse'
  | 'inverseOutline'
  | 'whatsapp';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold leading-none ' +
  'transition-colors motion-safe:duration-150 select-none ' +
  'disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-surface hover:bg-brand-strong',
  accent: 'bg-accent text-surface hover:bg-accent-strong',
  secondary: 'border border-brand/40 bg-surface text-brand-strong hover:bg-brand-soft',
  ghost: 'text-brand-strong hover:bg-brand-soft',
  danger: 'bg-danger text-surface hover:bg-danger-strong',
  /** Acción destructiva discreta (ej. «Eliminar» en una fila); siempre con ConfirmDialog. */
  dangerGhost: 'text-danger hover:bg-danger-soft',
  /** Botón fantasma sobre superficies oscuras (barra lateral, pie). */
  inverse: 'text-sidebar-ink hover:bg-sidebar-ink/10',
  /** Acción secundaria visible sobre superficies oscuras (portada, paneles de marca). */
  inverseOutline: 'border-2 border-surface/70 text-surface hover:bg-surface/10',
  whatsapp: 'bg-whatsapp text-surface hover:brightness-95',
};

// Alto mínimo de 44 px en táctil (md/lg); el texto escala con el ancho de pantalla.
const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-11 px-4 text-[0.95rem] md:px-5',
  lg: 'min-h-12 px-5 text-base md:min-h-13 md:px-7 md:text-lg',
};

/** rounded: panel y formularios; pill: llamadas a la acción del sitio público. */
export type ButtonShape = 'rounded' | 'pill';

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  shape = 'rounded',
  block = false,
  className = '',
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  block?: boolean;
  className?: string;
} = {}): string {
  return [
    base,
    shape === 'pill' ? 'rounded-full' : 'rounded-xl',
    variants[variant],
    sizes[size],
    block ? 'w-full' : '',
    className,
  ].join(' ');
}
