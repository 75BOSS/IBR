'use client';

import { saveReunion } from '@/actions/reuniones';
import { Checkbox } from '@/components/Checkbox';
import { CrudForm } from '@/components/admin/CrudForm';
import { Field } from '@/components/Field';
import type { Option } from '@/lib/catalogs';
import { DAY_OPTIONS, formatTime } from '@/lib/dates';

export type ReunionFormData = {
  id: number;
  nombre: string;
  descripcion: string | null;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string | null;
  ubicacion_id: number | null;
  rango_edad_id: number | null;
  en_linea: boolean;
  orden: number;
  activo: boolean;
};

export function ReunionForm({
  meeting,
  ubicaciones,
  rangos,
}: {
  meeting?: ReunionFormData;
  ubicaciones: Option[];
  rangos: Option[];
}) {
  return (
    <CrudForm
      action={saveReunion}
      id={meeting?.id}
      cancelHref="/admin/reuniones"
      submitLabel={meeting ? 'Guardar cambios' : 'Agregar reunión'}
    >
      {({ v, e }) => (
        <>
          <Field
            label="Nombre"
            name="nombre"
            defaultValue={v('nombre', meeting?.nombre)}
            placeholder="ej. Culto dominical"
            error={e.nombre}
            required
          />
          <Field
            label="Descripción corta"
            name="descripcion"
            defaultValue={v('descripcion', meeting?.descripcion)}
            placeholder="ej. Alabanza, predicación y Kids en paralelo"
            error={e.descripcion}
          />
          <div className="grid gap-5 md:grid-cols-3">
            <Field
              as="select"
              label="Día"
              name="dia_semana"
              options={DAY_OPTIONS}
              emptyOption="Elige el día"
              defaultValue={v('dia_semana', meeting?.dia_semana)}
              error={e.dia_semana}
              required
            />
            <Field
              label="Empieza"
              name="hora_inicio"
              type="time"
              defaultValue={v('hora_inicio', formatTime(meeting?.hora_inicio))}
              error={e.hora_inicio}
              required
            />
            <Field
              label="Termina"
              name="hora_fin"
              type="time"
              defaultValue={v('hora_fin', formatTime(meeting?.hora_fin))}
              error={e.hora_fin}
            />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              as="select"
              label="Lugar"
              name="ubicacion_id"
              options={ubicaciones}
              emptyOption="Sin lugar (solo en línea)"
              defaultValue={v('ubicacion_id', meeting?.ubicacion_id)}
              hint="¿Falta el lugar? Agrégalo en «Lugares»."
              error={e.ubicacion_id}
            />
            <Field
              as="select"
              label="Para quién"
              name="rango_edad_id"
              options={rangos}
              emptyOption="Todas las edades"
              defaultValue={v('rango_edad_id', meeting?.rango_edad_id)}
              error={e.rango_edad_id}
            />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Orden"
              name="orden"
              type="number"
              min={0}
              max={999}
              defaultValue={v('orden', meeting?.orden ?? 0)}
              hint="Desempata reuniones del mismo día y hora."
              error={e.orden}
            />
            <div className="flex flex-col gap-3 md:pt-7">
              <Checkbox
                name="en_linea"
                label="Se transmite en línea"
                defaultChecked={meeting?.en_linea}
              />
              <Checkbox
                name="activo"
                label="Activa (aparece en el sitio)"
                defaultChecked={meeting ? meeting.activo : true}
              />
            </div>
          </div>
        </>
      )}
    </CrudForm>
  );
}
