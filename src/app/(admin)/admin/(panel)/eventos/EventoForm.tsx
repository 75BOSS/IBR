'use client';

import { saveEvento } from '@/actions/eventos';
import { Checkbox } from '@/components/Checkbox';
import { CrudForm } from '@/components/admin/CrudForm';
import { Field } from '@/components/Field';
import { ImageField } from '@/components/ImageField';
import type { Option } from '@/lib/catalogs';
import { toLocalInputValue } from '@/lib/dates';
import { EVENTO_CATEGORIAS } from '@/lib/validators/eventos';

export type EventoFormData = {
  id: number;
  titulo: string;
  resumen: string | null;
  cuerpo: string | null;
  categoria: string;
  fecha_inicio: Date;
  fecha_fin: Date | null;
  todo_el_dia: boolean;
  ubicacion_id: number | null;
  rango_edad_id: number | null;
  imagen_url: string | null;
  link_externo: string | null;
  destacado: boolean;
  publicado: boolean;
  requiere_inscripcion: boolean;
  cupo: number | null;
};

export function EventoForm({
  event,
  ubicaciones,
  rangos,
  uploadsEnabled,
}: {
  event?: EventoFormData;
  ubicaciones: Option[];
  rangos: Option[];
  uploadsEnabled: boolean;
}) {
  return (
    <CrudForm
      action={saveEvento}
      id={event?.id}
      cancelHref="/admin/eventos"
      submitLabel={event ? 'Guardar cambios' : 'Crear evento'}
    >
      {({ v, e, state }) => {
        // Tras un error, las casillas quedan como las dejó la persona (no como estaban guardadas).
        const checked = (name: string, stored: boolean | undefined) =>
          state.values ? state.values[name] === '1' : Boolean(stored);
        return (
          <>
            <Field
              label="Título"
              name="titulo"
              defaultValue={v('titulo', event?.titulo)}
              error={e.titulo}
              required
            />
            <Field
              label="Resumen"
              name="resumen"
              defaultValue={v('resumen', event?.resumen)}
              hint="Una o dos líneas: se ven en las tarjetas y cuando se comparte por WhatsApp."
              error={e.resumen}
            />
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Empieza"
                name="fecha_inicio"
                type="datetime-local"
                defaultValue={v('fecha_inicio', toLocalInputValue(event?.fecha_inicio))}
                hint="Hora de Ecuador."
                error={e.fecha_inicio}
                required
              />
              <Field
                label="Termina"
                name="fecha_fin"
                type="datetime-local"
                defaultValue={v('fecha_fin', toLocalInputValue(event?.fecha_fin))}
                error={e.fecha_fin}
              />
            </div>
            <Checkbox
              name="todo_el_dia"
              label="Es de todo el día (no mostrar la hora)"
              defaultChecked={checked('todo_el_dia', event?.todo_el_dia)}
            />
            <div className="grid gap-5 md:grid-cols-3">
              <Field
                as="select"
                label="Categoría"
                name="categoria"
                options={[...EVENTO_CATEGORIAS]}
                defaultValue={v('categoria', event?.categoria ?? 'evento')}
                error={e.categoria}
                required
              />
              <Field
                as="select"
                label="Lugar"
                name="ubicacion_id"
                options={ubicaciones}
                emptyOption="Sin lugar"
                defaultValue={v('ubicacion_id', event?.ubicacion_id)}
                error={e.ubicacion_id}
              />
              <Field
                as="select"
                label="Para quién"
                name="rango_edad_id"
                options={rangos}
                emptyOption="Todas las edades"
                defaultValue={v('rango_edad_id', event?.rango_edad_id)}
                error={e.rango_edad_id}
              />
            </div>
            <Field
              as="textarea"
              label="Descripción completa"
              name="cuerpo"
              rows={8}
              defaultValue={v('cuerpo', event?.cuerpo)}
              hint="Separa los párrafos con una línea en blanco."
              error={e.cuerpo}
            />
            <ImageField
              name="imagen"
              label="Imagen"
              currentUrl={event?.imagen_url}
              uploadsEnabled={uploadsEnabled}
              hint="Horizontal (1200 × 630 px ideal): es la que se ve al compartir por WhatsApp."
              error={e.imagen}
            />
            <Field
              label="Enlace externo"
              name="link_externo"
              type="url"
              defaultValue={v('link_externo', event?.link_externo)}
              hint="Opcional: formulario de Google, Zoom, etc."
              error={e.link_externo}
            />
            <fieldset className="flex flex-col gap-4 rounded-2xl bg-sunken/60 p-4">
              <legend className="float-left mb-1 font-semibold text-ink">Inscripción</legend>
              <Checkbox
                className="clear-left"
                name="requiere_inscripcion"
                label="Pedir inscripción en el sitio"
                hint="Aparece un formulario en la página del evento; cada persona recibe un código y tú ves la lista en el panel."
                defaultChecked={checked('requiere_inscripcion', event?.requiere_inscripcion)}
              />
              <Field
                label="Cupo"
                name="cupo"
                type="number"
                inputMode="numeric"
                min={1}
                max={5000}
                defaultValue={v('cupo', event?.cupo)}
                hint="Cuántos lugares hay. Vacío si no hay límite. Solo aplica si se pide inscripción."
                error={e.cupo}
                className="md:max-w-xs"
              />
            </fieldset>
            <div className="flex flex-col gap-3">
              <Checkbox
                name="publicado"
                label="Publicado (visible en el sitio)"
                hint="Sin marcar queda como borrador: solo lo ve el panel."
                defaultChecked={checked('publicado', event?.publicado)}
              />
              <Checkbox
                name="destacado"
                label="Destacado (primero en el inicio)"
                defaultChecked={checked('destacado', event?.destacado)}
              />
            </div>
          </>
        );
      }}
    </CrudForm>
  );
}
