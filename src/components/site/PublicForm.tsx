'use client';

import { type ReactNode, useActionState } from 'react';
import { Button } from '@/components/Button';
import { FormAlert } from '@/components/FormAlert';
import { Icon } from '@/components/Icon';
import { ConsentField, HoneypotField } from '@/components/PublicFormExtras';
import { SecretReveal } from '@/components/SecretReveal';
import type { CrudFormHelpers } from '@/components/admin/CrudForm';
import { type FormState, initialFormState } from '@/lib/form-state';

/**
 * Formulario público único (Quiero unirme, Soy nuevo, Oración, Contacto): trampa para bots,
 * consentimiento opcional, error arriba, lo escrito se conserva y, al enviar, un mensaje de
 * agradecimiento en lugar del formulario.
 */
export function PublicForm({
  action,
  submitLabel,
  hidden = {},
  withConsent = true,
  consentOptionalHint,
  thanks,
  closed,
  children,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  hidden?: Record<string, string>;
  withConsent?: boolean;
  /** Si se da, el consentimiento no es obligatorio y se explica cuándo marcarlo. */
  consentOptionalHint?: string;
  /** Qué más decir después del mensaje de éxito (ej. próximos pasos). */
  thanks?: ReactNode;
  /**
   * Si llega, en vez del formulario se muestra esto (ej. «se llenó el cupo»). El agradecimiento
   * de un envío exitoso tiene prioridad: el envío puede ser justo el que cerró el cupo y la
   * página se vuelve a generar con `closed` mientras la persona todavía debe ver su código.
   */
  closed?: ReactNode;
  children: (helpers: CrudFormHelpers) => ReactNode;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, initialFormState);

  if (state.status === 'success') {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-3 rounded-2xl bg-success-soft p-[clamp(1.25rem,4vw,2rem)] text-success"
      >
        <Icon name="check" className="size-8" />
        <p className="font-display text-h3 font-medium">{state.message}</p>
        {state.secret && (
          <div className="w-full">
            <SecretReveal secret={state.secret} />
          </div>
        )}
        {thanks && <div className="text-ink">{thanks}</div>}
      </div>
    );
  }

  if (closed) return <>{closed}</>;

  const helpers: CrudFormHelpers = {
    v: (key, stored) => state.values?.[key] ?? (stored == null ? '' : String(stored)),
    e: state.fieldErrors ?? {},
    state,
  };
  return (
    <form action={formAction} className="relative flex flex-col gap-5" noValidate>
      {state.status === 'error' && state.message && <FormAlert>{state.message}</FormAlert>}
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <HoneypotField />
      {children(helpers)}
      {withConsent && (
        <ConsentField
          error={helpers.e.acepta_datos}
          required={!consentOptionalHint}
          hint={consentOptionalHint}
          defaultChecked={state.values?.acepta_datos === '1'}
        />
      )}
      <Button
        type="submit"
        variant="accent"
        size="lg"
        pendingLabel="Enviando…"
        className="md:self-start"
      >
        {submitLabel}
      </Button>
    </form>
  );
}
