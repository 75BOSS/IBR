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

/** Consentimiento obligatorio para guardar datos personales (se guarda con fecha e IP). */
export function ConsentField({ error }: { error?: string | string[] }) {
  return (
    <Checkbox
      name="acepta_datos"
      required
      error={error}
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
