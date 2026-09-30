'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/Button';
import type { ButtonVariant } from '@/components/button-styles';
import { useToastAction } from '@/components/Toast';
import type { FormState } from '@/lib/form-state';

/** Botón de una sola acción no destructiva (marcar atendida, leído, confirmar suscripción…), con carga y toast. */
export function ActionButton({
  action,
  fields,
  children,
  variant = 'secondary',
  icon,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  fields: Record<string, string>;
  children: ReactNode;
  variant?: ButtonVariant;
  icon?: ReactNode;
}) {
  const [state, formAction] = useToastAction(action);
  return (
    <form action={formAction} className="inline-flex flex-col gap-1">
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <Button type="submit" size="sm" variant={variant} icon={icon} pendingLabel="…">
        {children}
      </Button>
      {state.status === 'error' && state.message && (
        <span className="text-sm text-danger">{state.message}</span>
      )}
    </form>
  );
}
