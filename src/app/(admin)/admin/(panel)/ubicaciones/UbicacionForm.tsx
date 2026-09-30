'use client';

import { saveUbicacion } from '@/actions/ubicaciones';
import { Checkbox } from '@/components/Checkbox';
import { CrudForm } from '@/components/admin/CrudForm';
import { Field } from '@/components/Field';
import type { Option } from '@/lib/catalogs';

export type UbicacionRow = {
  id: number;
  nombre: string;
  tipo: 'sede' | 'casa' | 'en_linea' | 'otro';
  direccion: string | null;
  referencia: string | null;
  zona: string | null;
  maps_url: string | null;
  publica: boolean;
  activo: boolean;
};

export function UbicacionForm({ place, tipos }: { place?: UbicacionRow; tipos: Option[] }) {
  return (
    <CrudForm
      action={saveUbicacion}
      id={place?.id}
      cancelHref="/admin/ubicaciones"
      submitLabel={place ? 'Guardar cambios' : 'Agregar lugar'}
    >
      {({ v, e }) => (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Nombre del lugar"
              name="nombre"
              defaultValue={v('nombre', place?.nombre)}
              placeholder="ej. Casa fam. Pérez"
              error={e.nombre}
              required
            />
            <Field
              as="select"
              label="Tipo"
              name="tipo"
              options={tipos}
              defaultValue={v('tipo', place?.tipo ?? 'casa')}
              error={e.tipo}
              required
            />
          </div>
          <Field
            label="Dirección"
            name="direccion"
            defaultValue={v('direccion', place?.direccion)}
            error={e.direccion}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Zona o sector"
              name="zona"
              defaultValue={v('zona', place?.zona)}
              placeholder="ej. La Politécnica"
              hint="Con esto se filtran los grupos en el sitio."
              error={e.zona}
            />
            <Field
              label="Referencia"
              name="referencia"
              defaultValue={v('referencia', place?.referencia)}
              placeholder="ej. Junto a la panadería"
              error={e.referencia}
            />
          </div>
          <Field
            label="Enlace de Google Maps"
            name="maps_url"
            type="url"
            defaultValue={v('maps_url', place?.maps_url)}
            hint="En Google Maps: Compartir → Copiar vínculo."
            error={e.maps_url}
          />
          <div className="flex flex-col gap-3">
            <Checkbox
              name="publica"
              label="Mostrar la dirección exacta en el sitio"
              hint="Déjalo sin marcar en casas de familia: el sitio mostrará solo la zona."
              defaultChecked={place ? place.publica : false}
            />
            <Checkbox
              name="activo"
              label="Activo (se puede elegir en grupos y reuniones)"
              defaultChecked={place ? place.activo : true}
            />
          </div>
        </>
      )}
    </CrudForm>
  );
}
