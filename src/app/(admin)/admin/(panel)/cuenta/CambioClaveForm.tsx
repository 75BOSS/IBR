'use client';

import { changeOwnPassword } from '@/actions/usuarios';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Field } from '@/components/Field';
import { FormAlert } from '@/components/FormAlert';
import { useToastAction } from '@/components/Toast';

export function CambioClaveForm() {
  const [state, formAction] = useToastAction(changeOwnPassword);
  const e = state.fieldErrors ?? {};
  // Tras un cambio exitoso el formulario se vacía (key) para no dejar contraseñas escritas.
  return (
    <Card title="Cambiar contraseña" as="section" className="max-w-2xl">
      <form
        key={state.status === 'success' ? 'listo' : 'editando'}
        action={formAction}
        className="flex flex-col gap-5"
        noValidate
      >
        {state.status === 'error' && state.message && <FormAlert>{state.message}</FormAlert>}
        <Field
          label="Contraseña actual"
          name="actual"
          type="password"
          autoComplete="current-password"
          error={e.actual}
          required
        />
        <Field
          label="Contraseña nueva"
          name="nueva"
          type="password"
          autoComplete="new-password"
          hint="Al menos 12 caracteres. Una frase corta es fácil de recordar, ej. «mi perro come mango»."
          error={e.nueva}
          required
        />
        <Field
          label="Repite la contraseña nueva"
          name="repetir"
          type="password"
          autoComplete="new-password"
          error={e.repetir}
          required
        />
        <p className="text-sm text-ink-soft">
          Al cambiarla se cierra la sesión en tus otros dispositivos; en este sigues dentro.
        </p>
        <Button type="submit" pendingLabel="Cambiando…" className="md:self-end">
          Cambiar contraseña
        </Button>
      </form>
    </Card>
  );
}
