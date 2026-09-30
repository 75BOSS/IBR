import Image from 'next/image';
import type { ReactNode } from 'react';
import { Checkbox } from '@/components/Checkbox';
import { FormAlert } from '@/components/FormAlert';

/**
 * Campo de foto del panel: vista de la foto actual, opción de quitarla y selector de archivo.
 * Si Cloudinary aún no está configurado, lo dice en vez de mostrar un selector que fallaría.
 */
export function ImageField({
  name,
  label,
  hint,
  currentUrl,
  uploadsEnabled,
  error,
}: {
  name: string;
  label: string;
  hint?: ReactNode;
  currentUrl?: string | null;
  uploadsEnabled: boolean;
  error?: string | string[];
}) {
  const errorText = Array.isArray(error) ? error[0] : error;
  const id = `campo-${name}`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label} <span className="font-normal text-ink-soft">(opcional)</span>
      </label>
      {currentUrl && (
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative h-24 w-36 overflow-hidden rounded-xl bg-sunken ring-1 ring-line/70">
            <Image
              src={currentUrl}
              alt={`${label} actual`}
              fill
              sizes="144px"
              className="object-cover"
            />
          </div>
          <Checkbox name={`${name}__quitar`} label="Quitar esta foto" />
        </div>
      )}
      {uploadsEnabled ? (
        <input
          id={id}
          name={name}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-invalid={errorText ? true : undefined}
          className="block w-full rounded-xl border border-field-border bg-surface text-sm text-ink file:mr-3 file:min-h-11 file:border-0 file:bg-brand-soft file:px-4 file:font-semibold file:text-brand-strong hover:file:bg-brand-soft/70"
        />
      ) : (
        <FormAlert tone="warning">
          La subida de fotos se activa cuando Pixelia configure Cloudinary. Mientras tanto puedes
          guardar el resto de datos.
        </FormAlert>
      )}
      {errorText && <p className="text-sm font-medium text-danger">{errorText}</p>}
      {hint && <p className="text-sm text-ink-soft">{hint}</p>}
    </div>
  );
}
