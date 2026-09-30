'use client';

import { useActionState } from 'react';
import { saveEquipo } from '@/actions/equipo';
import { Button, ButtonLink } from '@/components/Button';
import { Card } from '@/components/Card';
import { Checkbox } from '@/components/Checkbox';
import { Field } from '@/components/Field';
import { FormAlert } from '@/components/FormAlert';
import { ImageField } from '@/components/ImageField';
import { type FormState, initialFormState } from '@/lib/form-state';

export type EquipoRow = {
  id: number;
  nombre: string;
  rol: string;
  bio: string | null;
  foto_url: string | null;
  es_pastor: boolean;
  orden: number;
  visible: boolean;
};

export function EquipoForm({
  person,
  uploadsEnabled,
}: {
  person?: EquipoRow;
  uploadsEnabled: boolean;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(saveEquipo, initialFormState);
  const v = (key: string, fallback?: string | number | null) =>
    state.values?.[key] ?? (fallback == null ? '' : String(fallback));
  const e = state.fieldErrors ?? {};

  return (
    <Card emphasis="featured" className="max-w-3xl">
      <form action={formAction} className="flex flex-col gap-5" noValidate>
        {state.status === 'error' && state.message && <FormAlert>{state.message}</FormAlert>}
        {person && <input type="hidden" name="id" value={person.id} />}
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Nombre"
            name="nombre"
            defaultValue={v('nombre', person?.nombre)}
            error={e.nombre}
            required
          />
          <Field
            label="Rol"
            name="rol"
            defaultValue={v('rol', person?.rol)}
            placeholder="ej. Pastor principal"
            error={e.rol}
            required
          />
        </div>
        <Field
          as="textarea"
          label="Biografía breve"
          name="bio"
          rows={5}
          defaultValue={v('bio', person?.bio)}
          hint="Dos o tres líneas: quién es y qué hace en la iglesia."
          error={e.bio}
        />
        <ImageField
          name="foto"
          label="Foto"
          currentUrl={person?.foto_url}
          uploadsEnabled={uploadsEnabled}
          hint="Foto de rostro, cuadrada o vertical."
          error={e.foto}
        />
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Orden"
            name="orden"
            type="number"
            min={0}
            max={999}
            defaultValue={v('orden', person?.orden ?? 0)}
            hint="Los números menores aparecen primero."
            error={e.orden}
            required
          />
          <div className="flex flex-col gap-3 md:pt-7">
            <Checkbox
              name="es_pastor"
              label="Es pastor o pastora (aparece en el inicio)"
              defaultChecked={person?.es_pastor}
            />
            <Checkbox
              name="visible"
              label="Visible en el sitio"
              defaultChecked={person ? person.visible : true}
            />
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end">
          <ButtonLink href="/admin/equipo" variant="secondary">
            Cancelar
          </ButtonLink>
          <Button type="submit" pendingLabel="Guardando…">
            {person ? 'Guardar cambios' : 'Agregar al equipo'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
