'use client';

import { Button } from '@/components/Button';
import { useToastAction } from '@/components/Toast';
import type { FormState } from '@/lib/form-state';

/**
 * Cambio rápido de estado en una fila del panel (solicitudes, registros): select + notas
 * opcionales + Guardar, con toast al terminar.
 */
export function StatusForm({
  action,
  id,
  estado,
  estados,
  notas,
  notasLabel = 'Notas internas',
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  id: number;
  estado: string;
  estados: readonly { value: string; label: string }[];
  notas?: string | null;
  notasLabel?: string;
}) {
  const [state, formAction] = useToastAction(action);
  return (
    <form action={formAction} className="flex w-full flex-col gap-2" noValidate>
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor={`estado-${id}`}>
        Estado
      </label>
      <div className="flex gap-2">
        <select
          id={`estado-${id}`}
          name="estado"
          defaultValue={estado}
          className="min-h-9 min-w-0 flex-1 rounded-lg border border-field-border bg-surface px-2 text-sm"
        >
          {estados.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
        <Button type="submit" size="sm" variant="secondary" pendingLabel="…">
          Guardar
        </Button>
      </div>
      <label className="sr-only" htmlFor={`notas-${id}`}>
        {notasLabel}
      </label>
      <textarea
        id={`notas-${id}`}
        name="notas"
        rows={2}
        defaultValue={notas ?? ''}
        placeholder={`${notasLabel} (opcional)`}
        className="w-full rounded-lg border border-field-border bg-surface px-2 py-1.5 text-sm placeholder:text-ink-soft"
      />
      {state.status === 'error' && state.message && (
        <p className="text-sm font-medium text-danger">{state.message}</p>
      )}
    </form>
  );
}
