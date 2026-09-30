import Link from 'next/link';
import { Checkbox } from '@/components/Checkbox';
import { HONEYPOT_FIELD } from '@/lib/form-state';

/** Campo trampa para bots: invisible para personas y lectores de pantalla. */
export function HoneypotField() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Sitio web (no llenar)
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/**
 * Consentimiento para guardar datos personales (se guarda con fecha e IP). Es obligatorio salvo
 * en formularios que se pueden enviar sin datos personales (ej. petición anónima).
 */
export function ConsentField({
  error,
  required = true,
  hint,
  defaultChecked,
}: {
  error?: string | string[];
  required?: boolean;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <Checkbox
      name="acepta_datos"
      defaultChecked={defaultChecked}
      required={required}
      error={error}
      hint={hint}
      label={
        <>
          Acepto que la iglesia guarde estos datos para contactarme. Puedes leer cómo los cuidamos
          en la{' '}
          <Link href="/privacidad" className="font-semibold text-brand-strong underline">
            política de privacidad
          </Link>
          .
        </>
      }
    />
  );
}
