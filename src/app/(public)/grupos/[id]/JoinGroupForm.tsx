'use client';

import { joinGroup } from '@/actions/grupos';
import { Field } from '@/components/Field';
import { PublicForm } from '@/components/site/PublicForm';

export function JoinGroupForm({ groupId, leader }: { groupId: number; leader: string | null }) {
  return (
    <PublicForm
      action={joinGroup}
      submitLabel="Quiero unirme"
      hidden={{ grupo_id: String(groupId) }}
      thanks={
        <p>
          {leader ? `${leader} te escribirá` : 'Te escribiremos'} para contarte los detalles y darte
          la dirección.
        </p>
      }
    >
      {({ v, e }) => (
        <>
          <Field
            label="Tu nombre"
            name="nombre"
            autoComplete="name"
            defaultValue={v('nombre')}
            error={e.nombre}
            required
          />
          <Field
            label="Tu WhatsApp"
            name="telefono"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="ej. 0991234567"
            defaultValue={v('telefono')}
            hint="Por aquí te contactará el líder del grupo."
            error={e.telefono}
            required
          />
          <Field
            as="textarea"
            label="¿Algo que quieras contarnos?"
            name="mensaje"
            rows={3}
            defaultValue={v('mensaje')}
            error={e.mensaje}
          />
        </>
      )}
    </PublicForm>
  );
}
