'use client';

import Link from 'next/link';
import { inscribirse } from '@/actions/inscripciones';
import { Field } from '@/components/Field';
import { PublicForm } from '@/components/site/PublicForm';

export function InscripcionForm({
  eventoId,
  closedReason,
}: {
  eventoId: number;
  /** Motivo si ya no se puede inscribir (cupo lleno, evento empezado). */
  closedReason: string | null;
}) {
  return (
    <PublicForm
      action={inscribirse}
      submitLabel="Inscribirme"
      hidden={{ evento_id: String(eventoId) }}
      thanks={
        <p>
          Te esperamos. Si al final no puedes ir, cancélala desde «Ver mi inscripción» para liberar
          tu lugar.
        </p>
      }
      closed={
        closedReason && (
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-ink">{closedReason}</p>
            <p className="text-ink-soft">
              ¿Tienes una pregunta?{' '}
              <Link href="/contacto#mensaje" className="font-semibold text-brand-strong underline">
                Escríbenos un mensaje
              </Link>
              .
            </p>
          </div>
        )
      }
    >
      {({ v, e }) => (
        <>
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
          <Field
            label="Correo"
            name="email"
            type="email"
            autoComplete="email"
            hint="Para enviarte la confirmación con tu código."
            defaultValue={v('email')}
            error={e.email}
          />
          <Field
            label="¿Cuántas personas vienen?"
            name="personas"
            type="number"
            inputMode="numeric"
            min={1}
            max={10}
            hint="Contándote a ti."
            defaultValue={v('personas', 1)}
            error={e.personas}
            required
            className="max-w-xs"
          />
        </>
      )}
    </PublicForm>
  );
}
