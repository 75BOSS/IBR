import type { ReactNode } from 'react';
import { toneVar } from '@/lib/css-vars';

export type CardTone = 'surface' | 'sunken' | 'brand' | 'accent';

const tones: Record<CardTone, string> = {
  surface: 'bg-surface text-ink',
  sunken: 'bg-sunken text-ink',
  brand: 'on-dark bg-brand-strong text-surface',
  accent: 'bg-accent-soft text-ink',
};

type CardProps = {
  as?: 'div' | 'article' | 'section' | 'li' | 'aside';
  tone?: CardTone;
  /** featured: más aire, sombra y títulos más grandes. Evita grillas de tarjetas idénticas. */
  emphasis?: 'normal' | 'featured';
  /** Franja de color a la izquierda (ej. color del ministerio en rangos_edad.color). */
  accentColor?: string | null;
  /** Con título, la tarjeta funciona como panel: cabecera con color diferenciado. */
  title?: ReactNode;
  /** Acciones a la derecha de la cabecera (botones, enlaces). */
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
};

/**
 * Tarjeta/panel único del proyecto. Padding fluido: se redimensiona entre 360 y 1280 px.
 */
export function Card({
  as: Tag = 'div',
  tone = 'surface',
  emphasis = 'normal',
  accentColor,
  title,
  actions,
  className = '',
  children,
}: CardProps) {
  const style = accentColor ? toneVar(accentColor) : undefined;
  const padding =
    emphasis === 'featured' ? 'p-[clamp(1.25rem,4vw,2.5rem)]' : 'p-[clamp(1rem,3vw,1.5rem)]';
  const frame = [
    'relative overflow-hidden rounded-2xl',
    tones[tone],
    emphasis === 'featured' ? 'shadow-card' : tone === 'surface' ? 'ring-1 ring-line/70' : '',
    accentColor ? 'border-l-[6px] border-(--tone)' : '',
    className,
  ].join(' ');

  return (
    <Tag style={style} className={frame}>
      {title && (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-brand/15 bg-brand-soft px-[clamp(1rem,3vw,1.5rem)] py-3 text-brand-strong">
          <h2 className="font-display text-h3 font-semibold">{title}</h2>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={padding}>{children}</div>
    </Tag>
  );
}
