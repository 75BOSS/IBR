import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import { formatPhoneEc, whatsappHref } from '@/lib/whatsapp';

/**
 * Datos de contacto de una persona en las tablas del panel: nombre, WhatsApp (abre el chat con
 * un saludo ya escrito) y correo. Un solo formato para registros, solicitudes, peticiones y mensajes.
 */
export function ContactLinks({
  nombre,
  telefono,
  email,
  saludo,
}: {
  nombre?: ReactNode;
  telefono?: string | null;
  email?: string | null;
  /** Primer mensaje de WhatsApp. */
  saludo: string;
}) {
  return (
    <span className="flex min-w-0 flex-col gap-1">
      {nombre && <span className="font-semibold">{nombre}</span>}
      {telefono && (
        <a
          href={whatsappHref(telefono, saludo) ?? `tel:${telefono}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-whatsapp hover:underline"
        >
          <Icon name="whatsapp" className="size-4" /> {formatPhoneEc(telefono)}
          <span className="sr-only"> (abrir WhatsApp)</span>
        </a>
      )}
      {email && (
        <a href={`mailto:${email}`} className="text-sm break-all text-ink-soft hover:underline">
          {email}
        </a>
      )}
    </span>
  );
}
