'use client';

import { saveMinisterio } from '@/actions/ministerios';
import { Checkbox } from '@/components/Checkbox';
import { Field } from '@/components/Field';
import { ImageField } from '@/components/ImageField';
import { CrudForm } from '@/components/admin/CrudForm';
import type { Ministerio } from '@/lib/ministerios';

export function MinisterioForm({
  ministerio: m,
  uploadsEnabled,
}: {
  ministerio?: Ministerio;
  uploadsEnabled: boolean;
}) {
  return (
    <CrudForm
      action={saveMinisterio}
      id={m?.id}
      cancelHref="/admin/ministerios"
      submitLabel={m ? 'Guardar cambios' : 'Crear ministerio'}
    >
      {({ v, e, state }) => (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Rango de edad"
              name="nombre"
              defaultValue={v('nombre', m?.nombre)}
              placeholder="ej. Jóvenes"
              hint="Así aparece en los filtros de grupos y en los registros."
              error={e.nombre}
              required
            />
            <Field
              label="Nombre del ministerio"
              name="nombre_ministerio"
              defaultValue={v('nombre_ministerio', m?.nombre_ministerio)}
              placeholder="ej. Get Up"
              hint="Si tiene un nombre propio. Si no, se usa el rango de edad."
              error={e.nombre_ministerio}
            />
            <Field
              label="Edad desde"
              name="edad_min"
              type="number"
              inputMode="numeric"
              min={0}
              max={120}
              defaultValue={v('edad_min', m?.edad_min)}
              error={e.edad_min}
            />
            <Field
              label="Edad hasta"
              name="edad_max"
              type="number"
              inputMode="numeric"
              min={0}
              max={120}
              defaultValue={v('edad_max', m?.edad_max)}
              hint="Vacío si no tiene tope (ej. 65 años o más)."
              error={e.edad_max}
            />
          </div>
          <Field
            as="textarea"
            label="Descripción"
            name="descripcion"
            rows={5}
            defaultValue={v('descripcion', m?.descripcion)}
            hint="Qué hacen y para quién es. Separa los párrafos con una línea en blanco."
            error={e.descripcion}
          />
          <ImageField
            name="imagen"
            label="Foto del ministerio"
            currentUrl={m?.imagen_url}
            uploadsEnabled={uploadsEnabled}
            hint="Horizontal, con gente de esa edad."
            error={e.imagen}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Color"
              name="color"
              type="color"
              defaultValue={v('color', m?.color ?? '#1b3a6b')}
              hint="Identifica al ministerio en tarjetas y etiquetas."
              error={e.color}
              className="[&_input]:h-12 [&_input]:w-24 [&_input]:p-1"
            />
            <Field
              label="Orden"
              name="orden"
              type="number"
              min={0}
              max={999}
              defaultValue={v('orden', m?.orden ?? 0)}
              hint="Los números menores aparecen primero."
              error={e.orden}
              required
            />
          </div>
          <Checkbox
            name="activo"
            label="Activo (se muestra en el sitio y en los formularios)"
            hint="Si ya no existe, desactívalo en lugar de borrarlo: hay grupos y registros que lo usan."
            defaultChecked={state.values ? state.values.activo === '1' : (m?.activo ?? true)}
          />
        </>
      )}
    </CrudForm>
  );
}
