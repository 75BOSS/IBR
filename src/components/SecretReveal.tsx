'use client';

import type { ReactNode } from 'react';
import { CopyButton } from '@/components/CopyButton';
import { Icon } from '@/components/Icon';
import type { FormState } from '@/lib/form-state';

/**
 * Muestra una sola vez un dato generado (ej. contraseña) con botón de copiar. Lo usan CrudForm y
 * ConfirmDialog cuando la acción devuelve `secret`.
 */
export function SecretReveal({
  message,
  secret,
  children,
}: {
  message?: string;
  secret: NonNullable<FormState['secret']>;
  /** Salida (ej. «Listo, volver a la lista»). */
  children?: ReactNode;
}) {
  return (
    <div role={message ? 'status' : undefined} className="flex flex-col gap-4">
      {message && (
        <p className="flex items-start gap-2 font-semibold text-success">
          <Icon name="check" className="mt-0.5 size-5 shrink-0" /> {message}
        </p>
      )}
      <div className="flex flex-col gap-2 rounded-xl bg-accent-soft p-4">
        <p className="text-sm font-semibold text-ink">{secret.label}</p>
        <p className="font-mono text-lg font-semibold break-all text-ink select-all">
          {secret.value}
        </p>
        <div>
          <CopyButton text={secret.value} label="Copiar" copiedMessage="Copiada" />
        </div>
        {secret.hint && <p className="text-sm text-ink-soft">{secret.hint}</p>}
      </div>
      {children}
    </div>
  );
}
