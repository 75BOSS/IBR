'use client';

import { type ReactNode, useActionState, useEffect, useId, useRef } from 'react';
import { Button, type ButtonVariant } from '@/components/Button';
import { Icon, type IconName } from '@/components/Icon';
import { useToast } from '@/components/Toast';
import { type FormState, initialFormState } from '@/lib/form-state';

type Props = {
  /** Server action que recibe los `fields` como FormData y devuelve un FormState. */
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  /** Campos ocultos que viajan con la confirmación (ej. { id: '12' }). */
  fields?: Record<string, string>;
  title: string;
  /** Qué va a pasar exactamente y si se puede deshacer. */
  description: ReactNode;
  triggerLabel: string;
  triggerIcon?: IconName;
  triggerVariant?: ButtonVariant;
  confirmLabel?: string;
  pendingLabel?: string;
  tone?: 'danger' | 'primary';
};

/**
 * Confirmación antes de acciones irreversibles (borrar, desactivar). El foco inicial queda en
 * «Cancelar» y el error, si lo hay, se muestra dentro del diálogo sin cerrarlo.
 */
export function ConfirmDialog({
  action,
  fields = {},
  title,
  description,
  triggerLabel,
  triggerIcon = 'trash',
  triggerVariant = 'dangerGhost',
  confirmLabel = 'Sí, eliminar',
  pendingLabel = 'Eliminando…',
  tone = 'danger',
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const toast = useToast();
  const [state, formAction] = useActionState(action, initialFormState);

  useEffect(() => {
    if (state.status !== 'success') return;
    dialog.current?.close();
    if (state.message) toast({ tone: 'success', message: state.message });
  }, [state, toast]);

  return (
    <>
      <Button
        variant={triggerVariant}
        size="sm"
        icon={<Icon name={triggerIcon} className="size-4" />}
        onClick={() => dialog.current?.showModal()}
        aria-haspopup="dialog"
      >
        {triggerLabel}
      </Button>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="m-auto w-[min(30rem,calc(100vw-2rem))] rounded-2xl bg-surface p-0 text-ink shadow-pop backdrop:bg-ink/55"
      >
        <form action={formAction} className="flex flex-col gap-5 p-[clamp(1.25rem,4vw,1.75rem)]">
          <div className="flex items-start gap-3">
            <span
              className={`grid size-10 shrink-0 place-items-center rounded-full ${
                tone === 'danger' ? 'bg-danger-soft text-danger' : 'bg-brand-soft text-brand'
              }`}
            >
              <Icon name="warning" />
            </span>
            <div className="flex flex-col gap-1.5">
              <h2 id={titleId} className="text-h3 font-semibold">
                {title}
              </h2>
              <div id={descriptionId} className="text-ink-soft">
                {description}
              </div>
            </div>
          </div>
          {state.status === 'error' && state.message && (
            <p
              role="alert"
              className="rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger-strong"
            >
              {state.message}
            </p>
          )}
          {Object.entries(fields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end">
            <Button variant="secondary" onClick={() => dialog.current?.close()} autoFocus>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant={tone === 'danger' ? 'danger' : 'primary'}
              pendingLabel={pendingLabel}
            >
              {confirmLabel}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
