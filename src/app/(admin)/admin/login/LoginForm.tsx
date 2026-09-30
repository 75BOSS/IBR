'use client';

import { useActionState } from 'react';
import { type LoginState, login } from '@/actions/auth';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { FormAlert } from '@/components/FormAlert';
import { initialFormState } from '@/lib/form-state';

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(login, initialFormState);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.status === 'error' && state.message && <FormAlert>{state.message}</FormAlert>}
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
