'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Icon, type IconName } from '@/components/Icon';
import { type FormState, initialFormState } from '@/lib/form-state';

type ToastTone = 'success' | 'error' | 'info';
type ToastItem = { id: number; tone: ToastTone; message: string };
type ShowToast = (toast: { tone?: ToastTone; message: string }) => void;

const ToastContext = createContext<ShowToast | null>(null);

const toneStyles: Record<ToastTone, { box: string; icon: IconName }> = {
  success: { box: 'bg-success text-surface', icon: 'check' },
  error: { box: 'bg-danger text-surface', icon: 'error' },
  info: { box: 'bg-brand-strong text-surface', icon: 'info' },
};

/** Duración de los avisos que se van solos; los de error esperan a que la persona los cierre. */
const AUTO_DISMISS_MS = 4500;

/**
 * Avisos breves ("Guardado", "Evento eliminado"). La región aria-live existe siempre para que
 * los lectores de pantalla anuncien cada aviso nuevo.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const show = useCallback<ShowToast>(
    ({ tone = 'success', message }) => {
      const id = ++nextId.current;
      setToasts((current) => [...current.slice(-2), { id, tone, message }]);
      if (tone !== 'error') setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-3 top-3 z-[60] flex flex-col items-center gap-2 md:inset-x-auto md:top-auto md:right-6 md:bottom-6 md:items-end"
      >
        {toasts.map((toast) => {
          const style = toneStyles[toast.tone];
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl px-4 py-3 shadow-pop on-dark motion-safe:animate-toast-in ${style.box}`}
            >
              <Icon name={style.icon} className="mt-0.5 size-5" />
              <p className="flex-1 font-semibold">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="-m-1 grid size-8 place-items-center rounded-lg hover:bg-surface/15"
              >
                <Icon name="close" className="size-4" />
                <span className="sr-only">Cerrar aviso</span>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ShowToast {
  const show = useContext(ToastContext);
  if (!show)
    throw new Error('useToast debe usarse dentro de <ToastProvider> (src/app/layout.tsx).');
  return show;
}

/**
 * useActionState con toast de éxito. El aviso se muestra dentro de la acción (después del
 * await), no en un efecto: si la acción revalida y el formulario desaparece de la pantalla
 * (ej. la fila cambió de estado), el «Guardado» igual aparece.
 */
export function useToastAction(
  action: (state: FormState, formData: FormData) => Promise<FormState>,
) {
  const toast = useToast();
  return useActionState<FormState, FormData>(async (prev, formData) => {
    const result = await action(prev, formData);
    if (result.status === 'success' && result.message)
      toast({ tone: 'success', message: result.message });
    return result;
  }, initialFormState);
}

/**
 * Aviso después de una redirección (ej. crear → volver a la lista). La página pasa el código
 * de ?aviso=; se muestra una vez y se limpia la URL. Solo textos fijos (no texto de la URL).
 */
const FLASH_MESSAGES = new Map([
  ['creado', 'Guardado. Ya aparece en la lista.'],
  ['guardado', 'Guardado'],
  ['eliminado', 'Eliminado'],
]);

export function FlashToast({ code }: { code?: string }) {
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const message = code ? FLASH_MESSAGES.get(code) : undefined;
  useEffect(() => {
    if (!message) return;
    toast({ tone: 'success', message });
    router.replace(pathname, { scroll: false });
  }, [message, pathname, router, toast]);
  return null;
}
