'use client';

import { useActionState } from 'react';
import { type LoginState, login } from '@/actions/auth';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { initialFormState } from '@/lib/form-state';

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(login, initialFormState);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.status === 'error' && state.message && (
        <div
          role="alert"
          className="rounded-xl border border-danger/40 bg-danger-soft px-4 py-3 text-sm font-medium text-danger-strong"
        >
          {state.message}
        </div>
      )}
      <Field
        label="Correo"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="username"
        placeholder="ej. nombre@ibriglesia.com"
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
        required
      />
      <Field
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="current-password"
        error={state.fieldErrors?.password}
        required
      />
      {next && <input type="hidden" name="next" value={next} />}
      <Button type="submit" size="lg" block pendingLabel="Verificando…">
        Entrar al panel
      </Button>
    </form>
  );
}
