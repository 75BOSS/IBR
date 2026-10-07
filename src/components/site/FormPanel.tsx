import type { ReactNode } from 'react';

const TONES = {
  peach: 'bg-peach text-ink',
  brand: 'bg-brand-strong text-surface on-dark',
  surface: 'bg-surface text-ink ring-1 ring-line/70',
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
  stacked = false,
  children,
}: {
  titleId: string;
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  tone?: keyof typeof TONES;
  /** Contenido extra bajo el texto (ej. el contador de cupos). */
  aside?: ReactNode;
  /** En columnas angostas: el botón siempre debajo del texto. */
  stacked?: boolean;
  /** El `FormDialog` (su botón queda a la derecha en escritorio, salvo `stacked`). */
  children: ReactNode;
}) {
  const dark = tone === 'brand';
  return (
    <section
      aria-labelledby={titleId}
      className={`flex reveal flex-col gap-6 rounded-(--radius-frame) p-[clamp(1.5rem,4vw,2.75rem)] ${
        stacked ? '' : 'md:flex-row md:items-end md:justify-between'
      } ${TONES[tone]}`}
    >
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
    </section>
  );
}
