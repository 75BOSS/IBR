import type { ReactNode } from 'react';

const TONES = {
  peach: 'bg-peach text-ink',
  brand: 'bg-brand-strong text-surface on-dark',
} as const;

/**
 * Invitación a un formulario del sitio: título, por qué llenarlo y el botón que lo abre en
 * ventana emergente (`FormDialog` como `children`). Una sola pieza para Soy nuevo, Oración,
 * Contacto, Servir, Agenda, inscripción a eventos y «Quiero unirme».
 */
export function FormPanel({
  titleId,
  eyebrow,
  title,
  text,
  tone = 'peach',
  aside,
  children,
}: {
  titleId: string;
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  tone?: keyof typeof TONES;
  /** Contenido extra bajo el texto (ej. el contador de cupos). */
  aside?: ReactNode;
  /** El `FormDialog`: su botón va a la derecha cuando el panel es ancho y debajo cuando no. */
  children: ReactNode;
}) {
  const dark = tone === 'brand';
  return (
    // @container: el panel decide por su propio ancho (no por el de la ventana) si el botón va
    // al lado del texto; así sirve igual a lo ancho de la página que en una columna angosta.
    <section
      aria-labelledby={titleId}
      className={`@container reveal rounded-(--radius-frame) p-[clamp(1.5rem,4vw,2.75rem)] ${TONES[tone]}`}
    >
      <div className="flex flex-col gap-6 @2xl:flex-row @2xl:items-end @2xl:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          {eyebrow && (
            <p className={`eyebrow ${dark ? 'text-peach' : 'text-accent-strong'}`}>{eyebrow}</p>
          )}
          <h2 id={titleId} className="font-headline text-section">
            {title}
          </h2>
          {text && <div className={dark ? 'text-surface/85' : 'text-ink/80'}>{text}</div>}
          {aside}
        </div>
        <div className="shrink-0">{children}</div>
      </div>
    </section>
  );
}
