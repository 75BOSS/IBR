'use client';

import {
  type ReactNode,
  type RefObject,
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { Button } from '@/components/Button';
import type { ButtonVariant } from '@/components/button-styles';
import { FormAlert } from '@/components/FormAlert';
import { Icon, type IconName } from '@/components/Icon';
import { SecretReveal } from '@/components/SecretReveal';
import { useToast } from '@/components/Toast';
import { type FormState, initialFormState } from '@/lib/form-state';

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

type Props = {
  /** Server action que recibe los `fields` como FormData y devuelve un FormState. */
  action: Action;
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
 * «Cancelar»; cada apertura empieza limpia; mientras procesa no se puede cerrar; el error se
 * muestra dentro del diálogo y el éxito con un toast.
 */
export function ConfirmDialog({
  triggerLabel,
  triggerIcon = 'trash',
  triggerVariant = 'dangerGhost',
  ...props
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [openCount, setOpenCount] = useState(0);
  const titleId = useId();
  const descriptionId = useId();

  // Se abre después de montar el formulario nuevo, para que el foco inicial caiga en su «Cancelar».
  useEffect(() => {
    if (openCount > 0) dialog.current?.showModal();
  }, [openCount]);

  return (
    <>
      <Button
        variant={triggerVariant}
        size="sm"
        icon={<Icon name={triggerIcon} className="size-4" />}
        onClick={() => setOpenCount((n) => n + 1)}
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
        {/* key: cada apertura monta un formulario nuevo (sin el error del intento anterior). */}
        <ConfirmForm
          key={openCount}
          dialog={dialog}
          titleId={titleId}
          descriptionId={descriptionId}
          {...props}
        />
      </dialog>
    </>
  );
}

function ConfirmForm({
  dialog,
  action,
  fields = {},
  title,
  description,
  confirmLabel = 'Sí, eliminar',
  pendingLabel = 'Eliminando…',
  tone = 'danger',
  titleId,
  descriptionId,
}: Omit<Props, 'triggerLabel' | 'triggerIcon' | 'triggerVariant'> & {
  dialog: RefObject<HTMLDialogElement | null>;
  titleId: string;
  descriptionId: string;
}) {
  const toast = useToast();

  // ¿Este formulario sigue siendo el de la apertura vigente? (el diálogo pudo cerrarse y
  // reabrirse, lo que monta otro formulario con otra key).
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // El cierre y el toast van dentro de la acción (después del await): si la acción borra la
  // fila que contiene este diálogo, el componente se desmonta pero el aviso igual aparece.
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    async (prev, formData) => {
      const result = await action(prev, formData);
      const visible = mounted.current && Boolean(dialog.current?.open);
      if (result.status === 'success') {
        // Con un dato para mostrar una sola vez (secret), el diálogo queda abierto con él.
        if (!result.secret) {
          if (visible) dialog.current?.close();
          if (result.message) toast({ tone: 'success', message: result.message });
        }
      } else if (result.status === 'error' && result.message && !visible) {
        // El diálogo se cerró mientras procesaba (ej. doble Escape): el error no se pierde.
        toast({ tone: 'error', message: result.message });
      }
      return result;
    },
    initialFormState,
  );

  // Escape no cierra el diálogo mientras la acción está en curso.
  useEffect(() => {
    const element = dialog.current;
    if (!element || !pending) return;
    const blockCancel = (event: Event) => event.preventDefault();
    element.addEventListener('cancel', blockCancel);
    return () => element.removeEventListener('cancel', blockCancel);
  }, [dialog, pending]);

  if (state.status === 'success' && state.secret) {
    return (
      // El diálogo sigue nombrado por titleId/descriptionId: aquí son el resultado y el dato.
      <div className="flex flex-col gap-4 p-[clamp(1.25rem,4vw,1.75rem)]">
        <h2 id={titleId} className="text-h3 font-semibold">
          {state.message ?? title}
        </h2>
        <div id={descriptionId}>
          <SecretReveal secret={state.secret}>
            <Button className="self-end" onClick={() => dialog.current?.close()} autoFocus>
              Listo
            </Button>
          </SecretReveal>
        </div>
      </div>
    );
  }

  return (
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
      {state.status === 'error' && state.message && <FormAlert>{state.message}</FormAlert>}
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end">
        <Button
          variant="secondary"
          onClick={() => dialog.current?.close()}
          disabled={pending}
          autoFocus
        >
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
  );
}
