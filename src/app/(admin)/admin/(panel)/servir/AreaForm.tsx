'use client';

import { saveArea } from '@/actions/servir';
import { Checkbox } from '@/components/Checkbox';
import { Field } from '@/components/Field';
import { ImageField } from '@/components/ImageField';
import { CrudForm } from '@/components/admin/CrudForm';
import type { Option } from '@/lib/catalogs';
import type { Area } from '@/lib/servir';

export function AreaForm({
  area,
  equipo,
  uploadsEnabled,
}: {
  area?: Area;
  equipo: Option[];
  uploadsEnabled: boolean;
}) {
  return (
    <CrudForm
      action={saveArea}
      id={area?.id}
      cancelHref="/admin/servir"
      submitLabel={area ? 'Guardar cambios' : 'Crear área'}
    >
      {({ v, e, state }) => (
        <>
          <Field
            label="Nombre"
            name="nombre"
            defaultValue={v('nombre', area?.nombre)}
            placeholder="ej. Alabanza"
            error={e.nombre}
            required
          />
          <Field
            as="textarea"
            label="Descripción"
            name="descripcion"
            rows={4}
            defaultValue={v('descripcion', area?.descripcion)}
            hint="Qué se hace y qué se necesita. Separa los párrafos con una línea en blanco."
            error={e.descripcion}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              as="select"
              label="Responsable"
              name="responsable_id"
              options={equipo}
              emptyOption="Sin responsable"
              defaultValue={v('responsable_id', area?.responsable_id)}
              hint="Sale de Equipo."
              error={e.responsable_id}
            />
            <Field
              label="Orden"
              name="orden"
              type="number"
              min={0}
              max={999}
              defaultValue={v('orden', area?.orden ?? 0)}
              hint="La primera aparece destacada en el sitio."
              error={e.orden}
              required
            />
          </div>
          <ImageField
            name="imagen"
            label="Foto"
            currentUrl={area?.imagen_url}
            uploadsEnabled={uploadsEnabled}
            hint="Horizontal. Solo se muestra en el área destacada."
            error={e.imagen}
          />
          <Checkbox
            name="activo"
            label="Activa (aparece en /servir)"
            defaultChecked={state.values ? state.values.activo === '1' : (area?.activo ?? true)}
          />
        </>
      )}
    </CrudForm>
  );
}
