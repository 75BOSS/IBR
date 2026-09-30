'use client';

import { saveGrupo } from '@/actions/grupos';
import { Checkbox } from '@/components/Checkbox';
import { CrudForm } from '@/components/admin/CrudForm';
import { Field } from '@/components/Field';
import { ImageField } from '@/components/ImageField';
import type { Option } from '@/lib/catalogs';
import { DAY_OPTIONS, formatTime } from '@/lib/dates';

export type GrupoFormData = {
  id: number;
  nombre: string;
  descripcion: string | null;
  tipo: string | null;
  rango_edad_id: number | null;
  ubicacion_id: number | null;
  dia_semana: number | null;
  hora: string | null;
  frecuencia: string;
  lider_nombre: string | null;
  lider_telefono: string | null;
  lider_email: string | null;
  cupo: number | null;
  imagen_url: string | null;
  publico: boolean;
  activo: boolean;
};

const TIPOS = [
  'Crecimiento',
  'Matrimonios',
  'Oración',
  'Estudio bíblico',
  'Jóvenes',
  'Mujeres',
  'Hombres',
];

export function GrupoForm({
  group,
  ubicaciones,
  rangos,
  frecuencias,
  uploadsEnabled,
}: {
  group?: GrupoFormData;
  ubicaciones: Option[];
  rangos: Option[];
  frecuencias: Option[];
  uploadsEnabled: boolean;
}) {
  return (
    <CrudForm
      action={saveGrupo}
      id={group?.id}
      cancelHref="/admin/grupos"
      submitLabel={group ? 'Guardar cambios' : 'Crear grupo'}
    >
      {({ v, e }) => (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Nombre del grupo"
              name="nombre"
              defaultValue={v('nombre', group?.nombre)}
              error={e.nombre}
              required
            />
            <Field
              label="Tipo"
              name="tipo"
              list="tipos-grupo"
              defaultValue={v('tipo', group?.tipo)}
              placeholder="ej. Crecimiento"
              error={e.tipo}
            />
          </div>
          <datalist id="tipos-grupo">
            {TIPOS.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
          <Field
            as="textarea"
            label="Descripción"
            name="descripcion"
            defaultValue={v('descripcion', group?.descripcion)}
            hint="Qué hacen, a quién está dirigido. Se ve en el sitio."
            error={e.descripcion}
          />
          <fieldset className="grid gap-5 rounded-xl bg-sunken/60 p-4 md:grid-cols-2">
            <legend className="px-1 text-sm font-bold tracking-wider text-brand-strong uppercase">
              Cuándo y dónde
            </legend>
            <Field
              as="select"
              label="Día"
              name="dia_semana"
              options={DAY_OPTIONS}
              emptyOption="Por definir"
              defaultValue={v('dia_semana', group?.dia_semana)}
              error={e.dia_semana}
            />
            <Field
              label="Hora"
              name="hora"
              type="time"
              defaultValue={v('hora', formatTime(group?.hora))}
              error={e.hora}
            />
            <Field
              as="select"
              label="Frecuencia"
              name="frecuencia"
              options={frecuencias}
              defaultValue={v('frecuencia', group?.frecuencia ?? 'semanal')}
              error={e.frecuencia}
              required
            />
            <Field
              as="select"
              label="Lugar"
              name="ubicacion_id"
              options={ubicaciones}
              emptyOption="Por definir"
              defaultValue={v('ubicacion_id', group?.ubicacion_id)}
              hint="¿Falta la casa? Agrégala en «Lugares»."
              error={e.ubicacion_id}
            />
            <Field
              as="select"
              label="Rango de edad"
              name="rango_edad_id"
              options={rangos}
              emptyOption="Todas las edades"
              defaultValue={v('rango_edad_id', group?.rango_edad_id)}
              error={e.rango_edad_id}
            />
            <Field
              label="Cupo"
              name="cupo"
              type="number"
              min={1}
              defaultValue={v('cupo', group?.cupo)}
              hint="Vacío = sin límite."
              error={e.cupo}
            />
          </fieldset>
          <fieldset className="grid gap-5 rounded-xl bg-sunken/60 p-4 md:grid-cols-3">
            <legend className="px-1 text-sm font-bold tracking-wider text-brand-strong uppercase">
              Líder
            </legend>
            <Field
              label="Nombre"
              name="lider_nombre"
              defaultValue={v('lider_nombre', group?.lider_nombre)}
              hint="Se ve en el sitio."
              error={e.lider_nombre}
            />
            <Field
              label="Teléfono"
              name="lider_telefono"
              type="tel"
              defaultValue={v('lider_telefono', group?.lider_telefono)}
              hint="Solo lo ve el panel."
              error={e.lider_telefono}
            />
            <Field
              label="Correo"
              name="lider_email"
              type="email"
              defaultValue={v('lider_email', group?.lider_email)}
              hint="Recibe las solicitudes."
              error={e.lider_email}
            />
          </fieldset>
          <ImageField
            name="imagen"
            label="Foto del grupo"
            currentUrl={group?.imagen_url}
            uploadsEnabled={uploadsEnabled}
            error={e.imagen}
          />
          <div className="flex flex-col gap-3">
            <Checkbox
              name="publico"
              label="Público: aparece en el directorio del sitio"
              defaultChecked={group ? group.publico : true}
            />
            <Checkbox
              name="activo"
              label="Activo"
              hint="Un grupo inactivo no aparece en ningún lado."
              defaultChecked={group ? group.activo : true}
            />
          </div>
        </>
      )}
    </CrudForm>
  );
}
