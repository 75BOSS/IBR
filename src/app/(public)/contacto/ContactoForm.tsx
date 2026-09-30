'use client';

import { sendContacto } from '@/actions/mensajes';
import { Field } from '@/components/Field';
import { PublicForm } from '@/components/site/PublicForm';

export function ContactoForm() {
  return (
    <PublicForm action={sendContacto} submitLabel="Enviar mensaje">
      {({ v, e }) => (
        <>
          <Field
            label="Nombre"
            name="nombre"
            autoComplete="name"
            defaultValue={v('nombre')}
            error={e.nombre}
            required
          />
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="WhatsApp"
              name="telefono"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="ej. 0991234567"
              hint="Déjanos este o tu correo para responderte."
              defaultValue={v('telefono')}
              error={e.telefono}
            />
            <Field
              label="Correo"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={v('email')}
              error={e.email}
            />
          </div>
          <Field
            as="textarea"
            label="Mensaje"
            name="mensaje"
            rows={5}
            defaultValue={v('mensaje')}
            error={e.mensaje}
            required
          />
        </>
      )}
    </PublicForm>
  );
}
