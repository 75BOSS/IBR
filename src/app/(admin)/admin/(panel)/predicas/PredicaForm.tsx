'use client';

import { savePredica } from '@/actions/predicas';
import { Checkbox } from '@/components/Checkbox';
import { CrudForm } from '@/components/admin/CrudForm';
import { Field } from '@/components/Field';

export type PredicaFormData = {
  id: number;
  titulo: string;
  youtube_id: string;
  serie: string | null;
  predicador: string | null;
  fecha: string;
  descripcion: string | null;
  pasaje: string | null;
  destacada: boolean;
  publicada: boolean;
};

function Suggestions({ id, items }: { id: string; items: string[] }) {
  return (
    <datalist id={id}>
      {items.map((item) => (
        <option key={item} value={item} />
      ))}
    </datalist>
  );
}

export function PredicaForm({
  sermon,
  series,
  predicadores,
}: {
  sermon?: PredicaFormData;
  series: string[];
  predicadores: string[];
}) {
  return (
    <CrudForm
      action={savePredica}
      id={sermon?.id}
      cancelHref="/admin/predicas"
      submitLabel={sermon ? 'Guardar cambios' : 'Agregar prédica'}
    >
      {({ v, e }) => (
        <>
          <Field
            label="Enlace del video en YouTube"
            name="enlace"
            type="url"
            inputMode="url"
            defaultValue={v('enlace', sermon ? `https://youtu.be/${sermon.youtube_id}` : '')}
            placeholder="ej. https://youtu.be/…"
            hint="En YouTube: Compartir → Copiar. El título y la miniatura se traen solos."
            error={e.enlace}
            required
          />
          <Field
            label="Título"
            name="titulo"
            defaultValue={v('titulo', sermon?.titulo)}
            hint={sermon ? undefined : 'Déjalo vacío para usar el título del video.'}
            error={e.titulo}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Predicador"
              name="predicador"
              list="sugerencias-predicador"
              defaultValue={v('predicador', sermon?.predicador)}
              error={e.predicador}
            />
            <Field
              label="Serie"
              name="serie"
              list="sugerencias-serie"
              defaultValue={v('serie', sermon?.serie)}
              placeholder="ej. Juan: Vida en su nombre"
              error={e.serie}
            />
            <Field
              label="Fecha"
              name="fecha"
              type="date"
              defaultValue={v('fecha', sermon?.fecha)}
              hint={sermon ? undefined : 'Vacío: la fecha del video (o hoy).'}
              error={e.fecha}
            />
            <Field
              label="Pasaje"
              name="pasaje"
              defaultValue={v('pasaje', sermon?.pasaje)}
              placeholder="ej. Juan 15:13"
              error={e.pasaje}
            />
          </div>
          <Suggestions id="sugerencias-predicador" items={predicadores} />
          <Suggestions id="sugerencias-serie" items={series} />
          <Field
            as="textarea"
            label="Resumen"
            name="descripcion"
            defaultValue={v('descripcion', sermon?.descripcion)}
            error={e.descripcion}
          />
          <div className="flex flex-col gap-3">
            <Checkbox
              name="publicada"
              label="Publicada (visible en el sitio)"
              defaultChecked={sermon ? sermon.publicada : true}
            />
            <Checkbox
              name="destacada"
              label="Destacada (aparece grande al entrar a Prédicas)"
              hint="Solo una a la vez: al marcarla se quita de la anterior."
              defaultChecked={sermon?.destacada}
            />
          </div>
        </>
      )}
    </CrudForm>
  );
}
