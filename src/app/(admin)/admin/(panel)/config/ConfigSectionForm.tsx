'use client';

import { saveConfig } from '@/actions/config';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Checkbox } from '@/components/Checkbox';
import { Field } from '@/components/Field';
import { FormAlert } from '@/components/FormAlert';
import { ImageField } from '@/components/ImageField';
import { useToastAction } from '@/components/Toast';
import type { SiteConfig } from '@/lib/config';
import {
  type BankAccount,
  type ConfigField,
  type ConfigSection,
  MAX_BANK_ACCOUNTS,
  parseBankAccounts,
} from '@/lib/config-fields';

const inputTypes: Partial<Record<ConfigField['kind'], string>> = {
  url: 'url',
  phone: 'tel',
  whatsapp: 'tel',
  email: 'email',
};

function AccountsFields({
  current,
  typed,
  error,
}: {
  current: BankAccount[];
  /** Lo escrito en el último envío con error (para no perderlo). */
  typed?: Partial<Record<string, string>>;
  error?: string[];
}) {
  const errorText = error?.[0];
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-semibold text-ink">
        Cuentas bancarias{' '}
        <span className="font-normal text-ink-soft">
          (hasta {MAX_BANK_ACCOUNTS}; deja vacías las que no uses)
        </span>
      </legend>
      {errorText && <FormAlert>{errorText}</FormAlert>}
      {Array.from({ length: MAX_BANK_ACCOUNTS }, (_, i) => {
        const account = current[i];
        return (
          <div
            key={i}
            className="grid gap-3 rounded-xl bg-sunken/60 p-3 md:grid-cols-2 xl:grid-cols-3"
          >
            <p className="text-sm font-semibold text-brand-strong md:col-span-2 xl:col-span-3">
              Cuenta {i + 1}
            </p>
            <Field
              label="Banco"
              name={`cuenta_${i}_banco`}
              defaultValue={typed?.[`cuenta_${i}_banco`] ?? account?.banco}
              placeholder="ej. Banco Pichincha"
            />
            <Field
              label="Tipo"
              name={`cuenta_${i}_tipo`}
              defaultValue={typed?.[`cuenta_${i}_tipo`] ?? account?.tipo}
              placeholder="ej. Ahorros"
            />
            <Field
              label="Número"
              name={`cuenta_${i}_numero`}
              defaultValue={typed?.[`cuenta_${i}_numero`] ?? account?.numero}
              inputMode="numeric"
            />
            <Field
              label="Titular"
              name={`cuenta_${i}_titular`}
              defaultValue={typed?.[`cuenta_${i}_titular`] ?? account?.titular}
            />
            <Field
              label="RUC o cédula"
              name={`cuenta_${i}_ruc_ci`}
              defaultValue={typed?.[`cuenta_${i}_ruc_ci`] ?? account?.ruc_ci}
              inputMode="numeric"
            />
          </div>
        );
      })}
    </fieldset>
  );
}

export function ConfigSectionForm({
  section,
  config,
  uploadsEnabled,
}: {
  section: ConfigSection;
  config: SiteConfig;
  uploadsEnabled: boolean;
}) {
  const [state, formAction] = useToastAction(saveConfig);

  return (
    <Card title={section.title} as="section">
      <form action={formAction} className="flex flex-col gap-5" noValidate>
        <p className="text-ink-soft">{section.intro}</p>
        {state.status === 'error' && state.message && <FormAlert>{state.message}</FormAlert>}
        <input type="hidden" name="grupo" value={section.group} />
        {section.fields.map((field) => {
          const stored = config[field.key] ?? '';
          // WhatsApp se guarda internacional (5939…) y se muestra como se escribe en Ecuador (09…).
          const shown =
            field.kind === 'whatsapp' && stored.startsWith('593') ? `0${stored.slice(3)}` : stored;
          const current = state.values?.[field.key] ?? shown;
          const error = state.fieldErrors?.[field.key];
          switch (field.kind) {
            case 'bool':
              return (
                <Checkbox
                  key={field.key}
                  name={field.key}
                  label={field.label}
                  defaultChecked={
                    state.values ? state.values[field.key] === '1' : config[field.key] === '1'
                  }
                  hint={field.hint}
                />
              );
            case 'image':
              return (
                <ImageField
                  key={field.key}
                  name={field.key}
                  label={field.label}
                  hint={field.hint}
                  currentUrl={config[field.key]}
                  uploadsEnabled={uploadsEnabled}
                  error={error}
                />
              );
            case 'accounts':
              return (
                <AccountsFields
                  key={field.key}
                  current={parseBankAccounts(config[field.key])}
                  typed={state.values}
                  error={error}
                />
              );
            case 'textarea':
            case 'maps':
              return (
                <Field
                  key={field.key}
                  as="textarea"
                  rows={field.kind === 'maps' ? 3 : 4}
                  label={field.label}
                  name={field.key}
                  defaultValue={current}
                  hint={field.hint}
                  placeholder={field.placeholder}
                  required={field.required}
                  error={error}
                />
              );
            default:
              return (
                <Field
                  key={field.key}
                  label={field.label}
                  name={field.key}
                  type={inputTypes[field.kind] ?? 'text'}
                  defaultValue={current}
                  hint={field.hint}
                  placeholder={field.placeholder}
                  required={field.required}
                  error={error}
                />
              );
          }
        })}
        <div className="flex justify-end">
          <Button type="submit" pendingLabel="Guardando…">
            Guardar cambios
          </Button>
        </div>
      </form>
    </Card>
  );
}
