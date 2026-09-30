'use client';

import { useActionState, useState } from 'react';
import { solicitarCodigo, verificarCodigo } from '@/actions/miembro';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { FormAlert } from '@/components/FormAlert';
import { HoneypotField } from '@/components/PublicFormExtras';
import { initialFormState } from '@/lib/form-state';

/** Entrar con WhatsApp: 1) pedir el código, 2) escribirlo. Se puede volver al paso 1. */
export function MemberLogin() {
  const [request, requestAction] = useActionState(solicitarCodigo, initialFormState);
  const [verify, verifyAction] = useActionState(verificarCodigo, initialFormState);
  const [changeNumber, setChangeNumber] = useState(0);
  const phone = request.status === 'success' ? request.values?.telefono : undefined;
  const step2 = Boolean(phone) && changeNumber === 0;

  if (step2) {
    return (
      <form action={verifyAction} className="flex flex-col gap-5" noValidate>
        <FormAlert tone="success">{request.message}</FormAlert>
        {verify.status === 'error' && verify.message && <FormAlert>{verify.message}</FormAlert>}
        <input type="hidden" name="telefono" value={phone} />
        <Field
          label="Código de 6 números"
          name="codigo"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="ej. 482913"
          error={verify.fieldErrors?.codigo}
          required
          autoFocus
          className="max-w-60"
        />
        <div className="flex flex-col-reverse gap-2 md:flex-row md:items-center">
          <Button variant="ghost" onClick={() => setChangeNumber((n) => n + 1)}>
            Usar otro número o pedir otro código
          </Button>
          <Button type="submit" pendingLabel="Comprobando…">
            Entrar
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form
      action={(fd) => {
        setChangeNumber(0);
        return requestAction(fd);
      }}
      className="relative flex flex-col gap-5"
      noValidate
    >
      {request.status === 'error' && request.message && <FormAlert>{request.message}</FormAlert>}
      <HoneypotField />
      <Field
        label="Tu WhatsApp"
        name="telefono"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="ej. 0991234567"
        hint="El mismo número con el que te registraste, te inscribiste o pediste unirte a un grupo."
        defaultValue={request.values?.telefono}
        error={request.fieldErrors?.telefono}
        required
      />
      <Button type="submit" variant="accent" pendingLabel="Enviando…" className="md:self-start">
        Enviarme un código por WhatsApp
      </Button>
    </form>
  );
}
