'use client';

import { sendPeticion } from '@/actions/mensajes';
import { Checkbox } from '@/components/Checkbox';
import { Field } from '@/components/Field';
import { PublicForm } from '@/components/site/PublicForm';

export function OracionForm() {
  return (
    <PublicForm
      action={sendPeticion}
      submitLabel="Enviar mi petición"
      consentOptionalHint="Márcala solo si dejaste tu nombre, WhatsApp o correo."
      thanks={
        <p>
          Si dejaste tu WhatsApp, alguien del equipo de oración podría escribirte. Recuerda que no
          estás solo: te esperamos en nuestras reuniones.
        </p>
      }
    >
      {({ v, e, state }) => (
        <>
          <Field
            as="textarea"
            label="¿Por qué quieres que oremos?"
            name="texto"
            rows={5}
            defaultValue={v('texto')}
            error={e.texto}
            required
          />
          <Checkbox
            name="es_privada"
            label="Que solo la lean los pastores"
            hint="Si la desmarcas, podríamos compartirla (sin tu nombre) en la reunión de oración."
            defaultChecked={state.values ? state.values.es_privada === '1' : true}
          />
          <fieldset className="flex flex-col gap-4 rounded-2xl bg-sunken/60 p-4">
            <legend className="float-left mb-1 font-semibold text-ink">
              Tus datos <span className="font-normal text-ink-soft">(opcional)</span>
            </legend>
            <p className="clear-left -mt-3 text-sm text-ink-soft">
              Puedes enviar tu petición sin nombre. Déjalos si quieres que te acompañemos.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <Field
                label="Nombre"
                name="nombre"
                autoComplete="name"
                defaultValue={v('nombre')}
                error={e.nombre}
              />
              <Field
                label="WhatsApp"
                name="telefono"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="ej. 0991234567"
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
          </fieldset>
        </>
      )}
    </PublicForm>
  );
}
