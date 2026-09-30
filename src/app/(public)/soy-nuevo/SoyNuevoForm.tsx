'use client';

import { registerNewcomer } from '@/actions/registros';
import { Field } from '@/components/Field';
import { PublicForm } from '@/components/site/PublicForm';
import type { Option } from '@/lib/catalogs';
import { COMO_LLEGO, SITUACIONES } from '@/lib/validators/registros';

export function SoyNuevoForm({ rangos }: { rangos: Option[] }) {
  return (
    <PublicForm
      action={registerNewcomer}
      submitLabel="Enviar mis datos"
      thanks={
        <p>
          Te escribiremos por WhatsApp. Si quieres, mira los horarios de reunión o busca un grupo
          cerca de tu casa.
        </p>
      }
    >
      {({ v, e }) => (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Nombres"
              name="nombres"
              autoComplete="given-name"
              defaultValue={v('nombres')}
              error={e.nombres}
              required
            />
            <Field
              label="Apellidos"
              name="apellidos"
              autoComplete="family-name"
              defaultValue={v('apellidos')}
              error={e.apellidos}
            />
            <Field
              label="WhatsApp"
              name="telefono"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="ej. 0991234567"
              hint="Por aquí te contactaremos."
              defaultValue={v('telefono')}
              error={e.telefono}
              required
            />
            <Field
              label="Correo"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={v('email')}
              error={e.email}
            />
            <Field
              as="select"
              label="Tu edad"
              name="rango_edad_id"
              options={rangos}
              emptyOption="Prefiero no decir"
              defaultValue={v('rango_edad_id')}
            />
            <Field
              label="Sector donde vives"
              name="sector"
              placeholder="ej. La Politécnica"
              hint="Nos ayuda a sugerirte un grupo cerca."
              defaultValue={v('sector')}
              error={e.sector}
            />
          </div>
          <Field
            as="select"
            label="¿Qué te trae por aquí?"
            name="situacion"
            options={[...SITUACIONES]}
            emptyOption="Elige una opción"
            defaultValue={v('situacion')}
          />
          <Field
            as="select"
            label="¿Cómo nos conociste?"
            name="como_llego"
            options={[...COMO_LLEGO]}
            emptyOption="Elige una opción"
            defaultValue={v('como_llego')}
          />
          <Field
            as="textarea"
            label="¿Podemos orar por algo?"
            name="peticion"
            rows={3}
            hint="Solo lo leen los pastores."
            defaultValue={v('peticion')}
            error={e.peticion}
          />
        </>
      )}
    </PublicForm>
  );
}
