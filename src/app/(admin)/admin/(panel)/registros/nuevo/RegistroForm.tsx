'use client';

import { createRegistro } from '@/actions/registros';
import { Checkbox } from '@/components/Checkbox';
import { CrudForm } from '@/components/admin/CrudForm';
import { Field } from '@/components/Field';
import type { Option } from '@/lib/catalogs';
import { COMO_LLEGO, ORIGENES, SITUACIONES } from '@/lib/validators/registros';

export function RegistroForm({ rangos }: { rangos: Option[] }) {
  return (
    <CrudForm action={createRegistro} cancelHref="/admin/registros" submitLabel="Registrar persona">
      {({ v, e, state }) => (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Nombres"
              name="nombres"
              defaultValue={v('nombres')}
              error={e.nombres}
              required
            />
            <Field
              label="Apellidos"
              name="apellidos"
              defaultValue={v('apellidos')}
              error={e.apellidos}
            />
            <Field
              label="Teléfono / WhatsApp"
              name="telefono"
              type="tel"
              defaultValue={v('telefono')}
              error={e.telefono}
            />
            <Field
              label="Correo"
              name="email"
              type="email"
              defaultValue={v('email')}
              error={e.email}
            />
            <Field
              as="select"
              label="Edad"
              name="rango_edad_id"
              options={rangos}
              emptyOption="Sin dato"
              defaultValue={v('rango_edad_id')}
            />
            <Field
              label="Sector donde vive"
              name="sector"
              defaultValue={v('sector')}
              error={e.sector}
            />
            <Field
              as="select"
              label="Origen"
              name="origen"
              options={[...ORIGENES]}
              defaultValue={v('origen', 'presencial')}
              error={e.origen}
              required
            />
            <Field
              as="select"
              label="Situación"
              name="situacion"
              options={[...SITUACIONES]}
              emptyOption="Sin dato"
              defaultValue={v('situacion')}
            />
            <Field
              as="select"
              label="Cómo llegó"
              name="como_llego"
              options={[...COMO_LLEGO]}
              emptyOption="Sin dato"
              defaultValue={v('como_llego')}
            />
          </div>
          <Field
            as="textarea"
            label="Petición o comentario"
            name="peticion"
            defaultValue={v('peticion')}
            error={e.peticion}
          />
          {state.values?.duplicado === '1' && (
            <Checkbox
              name="confirmar_duplicado"
              label="Registrar de todos modos (es otra persona con el mismo teléfono)"
            />
          )}
        </>
      )}
    </CrudForm>
  );
}
