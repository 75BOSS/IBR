'use client';

import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Spinner } from '@/components/Spinner';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold leading-none ' +
  'transition-colors motion-safe:duration-150 select-none ' +
  'disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-surface hover:bg-brand-strong',
  accent: 'bg-accent text-surface hover:bg-accent-strong',
  secondary: 'border border-brand/40 bg-surface text-brand-strong hover:bg-brand-soft',
  ghost: 'text-brand-strong hover:bg-brand-soft',
  danger: 'bg-danger text-surface hover:bg-danger-strong',
};

// Alto mínimo de 44 px en táctil (md/lg); el texto escala con el ancho de pantalla.
const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-11 px-4 text-[0.95rem] md:px-5',
  lg: 'min-h-12 px-5 text-base md:min-h-13 md:px-7 md:text-lg',
};

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  block = false,
  className = '',
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
} = {}): string {
  return [base, variants[variant], sizes[size], block ? 'w-full' : '', className].join(' ');
}

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  /** Fuerza el estado de carga. En botones submit se detecta solo con useFormStatus. */
  pending?: boolean;
  /** Texto mientras carga (ej. "Guardando…"). Por defecto se mantiene el texto normal. */
  pendingLabel?: ReactNode;
  icon?: ReactNode;
};

/**
 * Botón único del proyecto. Un botón `type="submit"` dentro de un <form action>
 * muestra carga y se deshabilita automáticamente mientras la acción corre
 * (heurística de Nielsen: visibilidad del estado del sistema).
 */
export function Button({
  variant,
  size,
  block,
  pending,
  pendingLabel,
  icon,
  type = 'button',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const form = useFormStatus();
  const isPending = pending ?? (type === 'submit' && form.pending);

  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, block, className })}
      disabled={disabled || isPending}
      aria-busy={isPending || undefined}
      {...props}
    >
      {isPending ? <Spinner /> : icon}
      <span>{isPending && pendingLabel ? pendingLabel : children}</span>
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  icon?: ReactNode;
};

/** Enlace con apariencia de botón (misma familia visual que Button). */
export function ButtonLink({
  variant,
  size,
  block,
  icon,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, block, className })} {...props}>
      {icon}
      <span>{children}</span>
    </Link>
  );
}
