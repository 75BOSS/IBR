'use client';

import { type ReactNode, useCallback, useEffect, useId, useRef } from 'react';
import { Button } from '@/components/Button';
import type { ButtonVariant } from '@/components/button-styles';
import { Icon, type IconName } from '@/components/Icon';

/**
 * Formulario público en ventana emergente: un botón lo abre; en celular sube desde abajo como
 * hoja y en escritorio aparece centrado. Se cierra con la X, con Escape o tocando fuera.
 *
 * - El formulario queda montado aunque se cierre: lo escrito no se pierde y, si ya se envió,
 *   el agradecimiento sigue ahí al reabrir.
 * - También se abre con un enlace a `#id` (ej. «Quiero servir aquí», «Inscribirme»), al cargar
 *   la página o sin recargarla.
 */
export function FormDialog({
  id,
  title,
  eyebrow,
  description,
  triggerLabel,
  triggerIcon,
  triggerVariant = 'accent',
  showTrigger = true,
  children,
}: {
  /** Ancla que abre la ventana (`#id`). Única en la página. */
  id: string;
  title: ReactNode;
  eyebrow?: string;
  description?: ReactNode;
  triggerLabel: string;
  triggerIcon?: IconName;
  triggerVariant?: ButtonVariant;
  /** false: sin botón propio (la abre un enlace `#id`), pero el formulario sigue montado. */
  showTrigger?: boolean;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const open = useCallback(() => {
    const element = dialog.current;
    if (!element || element.open) return;
    element.showModal();
    // showModal enfoca el primer elemento enfocable, y el campo trampa para bots (tabIndex -1)
    // lo es: el foco va explícito al primer campo visible del formulario.
    element
      .querySelector<HTMLElement>(
        'form :is(input, select, textarea):not([type="hidden"]):not([tabindex="-1"])',
      )
      ?.focus();
    // La página de atrás no se desplaza mientras la ventana está abierta.
    document.documentElement.style.overflow = 'hidden';
  }, []);

  const close = useCallback(() => dialog.current?.close(), []);

  // Al cerrarse (X, Escape, fuera o tras navegar): devolver el desplazamiento y quitar el `#id`
  // de la URL, para que el mismo enlace vuelva a abrirla.
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const onClose = () => {
      document.documentElement.style.overflow = '';
      if (window.location.hash === `#${id}`) {
        window.history.replaceState(
          window.history.state,
          '',
          window.location.pathname + window.location.search,
        );
      }
    };
    element.addEventListener('close', onClose);
    return () => {
      element.removeEventListener('close', onClose);
      document.documentElement.style.overflow = '';
    };
  }, [id]);

  // Abrir desde un enlace `#id`: al cargar y al cambiar el ancla sin recargar.
  useEffect(() => {
    const check = () => {
      if (window.location.hash === `#${id}`) open();
    };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, [id, open]);

  return (
    <>
      {/* Destino real del enlace `#id`: sin JavaScript (o antes de que cargue) el enlace igual
          baja hasta aquí, junto al botón; con JavaScript además abre la ventana. */}
      <span id={id} aria-hidden="true" className="block scroll-mt-28" />
      {showTrigger && (
        <Button
          variant={triggerVariant}
          size="lg"
          shape="pill"
          icon={triggerIcon ? <Icon name={triggerIcon} className="size-5" /> : undefined}
          onClick={open}
          aria-haspopup="dialog"
        >
          {triggerLabel}
        </Button>
      )}
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        // Un toque en el fondo (fuera del panel) cierra; dentro del panel no. El panel es claro
        // aunque el botón viva en una superficie oscura (on-dark): se reponen sus colores.
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="mx-0 mt-auto mb-0 max-h-[92dvh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-[1.75rem] bg-surface p-0 text-ink shadow-pop [--focus-ring:var(--color-accent)] [--title-em:var(--color-accent-strong)] backdrop:bg-night/60 backdrop:backdrop-blur-sm motion-safe:open:animate-dialog-in md:m-auto md:max-h-[88dvh] md:w-[min(42rem,calc(100vw-3rem))] md:rounded-[1.75rem]"
      >
        <div className="relative flex flex-col gap-6 p-[clamp(1.25rem,4vw,2.25rem)] pt-[clamp(1.5rem,4vw,2.25rem)]">
          {/* Asa visual de la hoja en celular. */}
          <span
            aria-hidden="true"
            className="mx-auto -mt-2 h-1.5 w-12 rounded-full bg-line md:hidden"
          />
          <header className="flex flex-col gap-2 pr-12">
            {eyebrow && <p className="eyebrow text-accent-strong">{eyebrow}</p>}
            <h2 id={titleId} className="font-headline text-h1 text-brand-strong">
              {title}
            </h2>
            {description && <div className="text-ink-soft">{description}</div>}
          </header>
          {children}
          {/* Al final del árbol: el foco inicial cae en el primer campo, no en la X. */}
          <button
            type="button"
            onClick={close}
            className="absolute top-[clamp(1rem,3vw,1.75rem)] right-[clamp(1rem,3vw,1.75rem)] grid size-11 place-items-center rounded-full text-ink-soft transition-colors hover:bg-sunken hover:text-ink"
          >
            <Icon name="close" className="size-6" />
            <span className="sr-only">Cerrar</span>
          </button>
        </div>
      </dialog>
    </>
  );
}
