'use client';

import { useState } from 'react';
import { enviarAgenda } from '@/actions/agenda';
import { Card } from '@/components/Card';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Field } from '@/components/Field';

/**
 * Redactar y enviar la agenda. La vista previa es el mismo texto que llega por correo (sale de
 * buildAgendaText en el servidor) con la introducción que se escribe aquí arriba.
 */
export function EnvioForm({
  preview,
  activos,
  defaultAsunto,
}: {
  preview: string;
  activos: number;
  defaultAsunto: string;
}) {
  const [asunto, setAsunto] = useState(defaultAsunto);
  const [intro, setIntro] = useState('');
  const fullPreview = intro.trim() ? `${intro.trim()}\n\n${preview}` : preview;

  return (
    <Card title="Enviar la agenda" as="section">
      <div className="flex flex-col gap-5">
        <Field
          label="Asunto"
          name="asunto"
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
          maxLength={200}
          error={asunto.trim() ? undefined : 'Escribe el asunto para poder enviar.'}
          required
        />
        <Field
          as="textarea"
          label="Mensaje de la semana"
          name="intro"
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="ej. ¡Este domingo celebramos la Santa Cena!"
          hint="Va arriba de la agenda, antes de los eventos."
        />
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-semibold text-ink">Así lo reciben</p>
          <pre className="max-h-96 overflow-auto rounded-xl bg-sunken p-4 font-sans text-sm whitespace-pre-wrap text-ink">
            {fullPreview}
          </pre>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {activos === 0 ? (
            <p className="text-ink-soft">Aún no hay suscriptores confirmados.</p>
          ) : (
            asunto.trim() && (
              <ConfirmDialog
                action={enviarAgenda}
                fields={{ asunto, intro }}
                title={`¿Enviar la agenda a ${activos} ${activos === 1 ? 'persona' : 'personas'}?`}
                description="Llega a todos los suscriptores confirmados. Un correo enviado no se puede recoger."
                triggerLabel={`Enviar a ${activos} ${activos === 1 ? 'persona' : 'personas'}`}
                triggerIcon="mail"
                triggerVariant="primary"
                confirmLabel="Sí, enviar"
                pendingLabel="Enviando…"
                tone="primary"
              />
            )
          )}
        </div>
      </div>
    </Card>
  );
}
