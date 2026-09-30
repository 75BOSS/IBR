'use client';

import { type ReactNode, useActionState } from 'react';
import { Button, ButtonLink } from '@/components/Button';
import { Card } from '@/components/Card';
import { FormAlert } from '@/components/FormAlert';
import { type FormState, initialFormState } from '@/lib/form-state';

export type CrudFormHelpers = {
  /** Valor para defaultValue: lo escrito en el último envío con error, o el guardado. */
  v: (key: string, stored?: string | number | null) => string;
  /** Errores por campo del último envío. */
  e: Partial<Record<string, string[]>>;
  state: FormState;
};

/**
 * Formulario de crear/editar del panel (un solo patrón para todos los módulos): tarjeta,
 * aviso de error, id oculto al editar y botones Cancelar / Guardar con estado de carga.
 */
export function CrudForm({
  action,
  id,
  cancelHref,
  submitLabel,
  children,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  id?: number;
  cancelHref: string;
  submitLabel: string;
  children: (helpers: CrudFormHelpers) => ReactNode;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, initialFormState);
  const helpers: CrudFormHelpers = {
    v: (key, stored) => state.values?.[key] ?? (stored == null ? '' : String(stored)),
    e: state.fieldErrors ?? {},
    state,
  };
  return (
    <Card emphasis="featured" className="max-w-3xl">
      <form action={formAction} className="flex flex-col gap-5" noValidate>
        {state.status === 'error' && state.message && <FormAlert>{state.message}</FormAlert>}
        {id !== undefined && <input type="hidden" name="id" value={id} />}
        {children(helpers)}
        <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end">
          <ButtonLink href={cancelHref} variant="secondary">
            Cancelar
          </ButtonLink>
          <Button type="submit" pendingLabel="Guardando…">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
