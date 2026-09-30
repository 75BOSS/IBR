import type { ComponentProps, ReactNode } from 'react';

type Common = {
  /** Texto visible siempre (nunca solo placeholder). */
  label: ReactNode;
  name: string;
  id?: string;
  /** Ayuda breve bajo el campo: formato esperado, para qué se usa el dato. */
  hint?: ReactNode;
  /** Mensaje de error: qué pasó y cómo arreglarlo. Acepta la lista de Zod (se muestra el primero). */
  error?: string | string[];
  required?: boolean;
  className?: string;
};

type InputFieldProps = Common & { as?: 'input' } & Omit<ComponentProps<'input'>, 'name' | 'id'>;
type TextareaFieldProps = Common & { as: 'textarea' } & Omit<
    ComponentProps<'textarea'>,
    'name' | 'id'
  >;
type SelectFieldProps = Common & {
  as: 'select';
  options: { value: string; label: string }[];
  /** Primera opción vacía (ej. "Elige una opción"). */
  emptyOption?: string;
} & Omit<ComponentProps<'select'>, 'name' | 'id'>;

export type FieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;

const controlBase =
  'block w-full rounded-xl border bg-surface px-3.5 text-base text-ink ' +
  'placeholder:text-ink-soft/70 transition-colors motion-safe:duration-150 ' +
  'focus:border-brand disabled:bg-sunken disabled:text-ink-soft';

/**
 * Campo de formulario único del proyecto: label visible + control + ayuda + error,
 * enlazados con aria-describedby / aria-invalid. Texto de 16 px para que iOS no haga zoom.
 */
export function Field(props: FieldProps) {
  const { label, name, id, hint, error, required, className = '' } = props;
  const fieldId = id ?? `campo-${name}`;
  const hintId = hint ? `${fieldId}-ayuda` : undefined;
  const errorText = Array.isArray(error) ? error[0] : error;
  const errorId = errorText ? `${fieldId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;
  const state = errorText
    ? 'border-danger bg-danger-soft/40'
    : 'border-field-border hover:border-ink-soft';

  const shared = {
    id: fieldId,
    name,
    required,
    'aria-invalid': errorText ? true : undefined,
    'aria-describedby': describedBy,
  };

  let control: ReactNode;
  if (props.as === 'textarea') {
    const { as: _as, label: _l, hint: _h, error: _e, className: _c, ...rest } = props;
    control = (
      <textarea
        rows={4}
        {...rest}
        {...shared}
        className={`${controlBase} ${state} min-h-28 py-3 leading-relaxed`}
      />
    );
  } else if (props.as === 'select') {
    const {
      as: _as,
      label: _l,
      hint: _h,
      error: _e,
      className: _c,
      options,
      emptyOption,
      ...rest
    } = props;
    control = (
      <select {...rest} {...shared} className={`${controlBase} ${state} min-h-11 py-2.5`}>
        {emptyOption !== undefined && <option value="">{emptyOption}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  } else {
    const { as: _as, label: _l, hint: _h, error: _e, className: _c, ...rest } = props;
    control = <input {...rest} {...shared} className={`${controlBase} ${state} min-h-11 py-2.5`} />;
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={fieldId} className="text-sm font-semibold text-ink">
        {label}
        {required ? (
          <span className="text-danger" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-ink-soft"> (opcional)</span>
        )}
      </label>
      {control}
      {errorText && (
        <p id={errorId} className="flex items-start gap-1.5 text-sm font-medium text-danger">
          <svg viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0" aria-hidden="true">
            <path
              fill="currentColor"
              d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4a1 1 0 0 1 1 1v3.5a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1Zm0 8.5a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Z"
            />
          </svg>
          <span>{errorText}</span>
        </p>
      )}
      {hint && (
        <p id={hintId} className="text-sm text-ink-soft">
          {hint}
        </p>
      )}
    </div>
  );
}
