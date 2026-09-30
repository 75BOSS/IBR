'use client';

import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { type ButtonSize, type ButtonVariant, buttonClasses } from '@/components/button-styles';
import { Spinner } from '@/components/Spinner';

// buttonClasses se importa de '@/components/button-styles' (llamable también en el servidor).
export type { ButtonSize, ButtonVariant } from '@/components/button-styles';

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
