'use client';

import { ofrecerme } from '@/actions/servir';
import { Field } from '@/components/Field';
import { PublicForm } from '@/components/site/PublicForm';
import type { Option } from '@/lib/catalogs';

export function ServirForm({ areas, preselected }: { areas: Option[]; preselected?: string }) {
  return (
    <PublicForm
      action={ofrecerme}
      submitLabel="Quiero servir"
      thanks={
        <p>
          Alguien del equipo te contará cómo funciona el área y cuándo puedes empezar. Mientras
          tanto, te esperamos en las reuniones.
        </p>
      }
    >
      {({ v, e }) => (
        <>
          <Field
            as="select"
            label="¿Dónde te gustaría servir?"
            name="area_id"
            options={areas}
            emptyOption="Elige un área"
            defaultValue={v('area_id', preselected)}
            error={e.area_id}
            required
          />
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Nombre y apellido"
              name="nombre"
              autoComplete="name"
              defaultValue={v('nombre')}
              error={e.nombre}
              required
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
              required
            />
          </div>
          <Field
            label="Correo"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={v('email')}
            error={e.email}
          />
          <Field
            label="¿Cuándo puedes?"
            name="disponibilidad"
            placeholder="ej. Domingos en la mañana"
            defaultValue={v('disponibilidad')}
            error={e.disponibilidad}
          />
          <Field
            as="textarea"
            label="¿Algo que quieras contarnos?"
            name="mensaje"
            rows={3}
            hint="Experiencia, instrumentos que tocas, preguntas…"
            defaultValue={v('mensaje')}
            error={e.mensaje}
          />
        </>
      )}
    </PublicForm>
  );
}
