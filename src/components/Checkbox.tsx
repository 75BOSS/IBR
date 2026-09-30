import type { ComponentProps, ReactNode } from 'react';

/** Casilla con texto a la derecha (consentimiento, opciones sí/no). Misma API de error que Field. */
export function Checkbox({
  name,
  label,
  hint,
  error,
  id,
  className = '',
  ...props
}: Omit<ComponentProps<'input'>, 'type' | 'name'> & {
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string | string[];
}) {
  const fieldId = id ?? `campo-${name}`;
  const errorText = Array.isArray(error) ? error[0] : error;
  const describedBy = [errorText && `${fieldId}-error`, hint && `${fieldId}-ayuda`]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={fieldId} className="flex cursor-pointer items-start gap-3">
        <input
          id={fieldId}
          name={name}
          type="checkbox"
          value="1"
          aria-invalid={errorText ? true : undefined}
          aria-describedby={describedBy || undefined}
          className="mt-0.5 size-5 shrink-0 accent-brand"
          {...props}
        />
        <span className="text-[0.95rem] text-ink">{label}</span>
      </label>
      {errorText && (
        <p id={`${fieldId}-error`} className="pl-8 text-sm font-medium text-danger">
          {errorText}
        </p>
      )}
      {hint && (
        <p id={`${fieldId}-ayuda`} className="pl-8 text-sm text-ink-soft">
          {hint}
        </p>
      )}
    </div>
  );
}
