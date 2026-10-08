import Link from 'next/link';
import { buttonClasses } from '@/components/button-styles';
import { Icon } from '@/components/Icon';
import { whatsappHref } from '@/lib/whatsapp';

type Props = {
  /** Número de config.whatsapp (5939XXXXXXXX o 09XXXXXXXX). */
  number: string | null | undefined;
  /** Mensaje prellenado, ej. "Hola, quiero saber más de los grupos". */
  message?: string;
  label?: string;
  /** inline: botón en el flujo · floating: botón fijo abajo a la derecha. */
  variant?: 'inline' | 'floating';
  /**
   * Sin número: true (por defecto) lleva a «Escríbenos un mensaje» en Contacto, para que la
   * invitación a escribir siempre tenga a dónde ir; false no muestra nada (menú, flotante).
   */
  fallback?: boolean;
  className?: string;
};

/** Botón de WhatsApp único del proyecto (abre el chat en una pestaña nueva). */
export function WhatsAppButton({
  number,
  message,
  label = 'Escríbenos por WhatsApp',
  variant = 'inline',
  fallback = true,
  className = '',
}: Props) {
  const href = whatsappHref(number, message);
  if (!href) {
    if (variant === 'floating' || !fallback) return null;
    return (
      <Link href="/contacto#mensaje" className={buttonClasses({ variant: 'primary', className })}>
        <Icon name="mail" className="size-5" />
        <span>Escríbenos un mensaje</span>
      </Link>
    );
  }

  if (variant === 'floating') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} (se abre en una pestaña nueva)`}
        className={`fixed right-[clamp(0.75rem,3vw,1.5rem)] bottom-[clamp(0.75rem,3vw,1.5rem)] z-30 grid size-13 place-items-center rounded-full bg-whatsapp text-surface shadow-pop transition-transform hover:scale-105 md:size-15 ${className}`}
      >
        <Icon name="whatsapp" className="size-7 md:size-8" />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses({ variant: 'whatsapp', className })}
    >
      <Icon name="whatsapp" className="size-5" />
      <span>{label}</span>
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
  );
}
