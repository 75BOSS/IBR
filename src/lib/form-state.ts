/**
 * Resultado estándar de toda server action de formulario (sitio y panel).
 * - success + message → toast "Guardado" (visibilidad del estado).
 * - error + message → aviso arriba del formulario; fieldErrors → junto a cada campo.
 * - values → lo que escribió la persona, para no perderlo tras un error.
 */
export type FormState<Field extends string = string> = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<Field, string[]>>;
  values?: Partial<Record<Field, string>>;
  /**
   * Dato que se muestra una sola vez y no se guarda en ningún lado visible (ej. una contraseña
   * generada). CrudForm y ConfirmDialog lo muestran con botón de copiar en vez de cerrar.
   */
  secret?: {
    label: string;
    value: string;
    hint?: string;
    /** A dónde seguir con ese dato (ej. la página de la inscripción con su QR). */
    link?: { href: string; label: string };
  };
};

export const initialFormState: FormState = { status: 'idle' };

/** Campo trampa de los formularios públicos: si llega con texto, lo llenó un bot. */
export const HONEYPOT_FIELD = 'website';
