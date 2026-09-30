'use client';

import { suscribirse } from '@/actions/agenda';
import { Field } from '@/components/Field';
import { PublicForm } from '@/components/site/PublicForm';

export function SuscripcionForm() {
  return (
    <PublicForm
      action={suscribirse}
      submitLabel="Quiero recibir la agenda"
      thanks={<p>Si no lo ves en unos minutos, revisa la carpeta de spam o promociones.</p>}
    >
      {({ v, e }) => (
        <>
          <Field
            label="Correo"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ej. nombre@correo.com"
            defaultValue={v('email')}
            error={e.email}
            required
          />
          <Field
            label="Nombre"
            name="nombre"
            autoComplete="given-name"
            hint="Para saludarte en el correo."
            defaultValue={v('nombre')}
            error={e.nombre}
          />
        </>
      )}
    </PublicForm>
  );
}
