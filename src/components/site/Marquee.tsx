import { Icon } from '@/components/Icon';

/**
 * Frase grande que avanza despacio de derecha a izquierda (ej. la visión de la iglesia). La
 * pista va duplicada para que el bucle no se corte; los lectores de pantalla leen una sola vez
 * el texto. Con «reducir movimiento», queda quieta.
 */
export function Marquee({ text }: { text: string }) {
  const items = Array.from({ length: 4 }, (_, i) => i);
  return (
    <div className="overflow-hidden py-[clamp(1.5rem,4vw,3rem)]">
      <p className="sr-only">{text}</p>
      <div
        aria-hidden="true"
        className="flex w-max hover:[animation-play-state:paused] motion-safe:animate-marquee"
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((i) => (
              <span key={i} className="flex items-center">
                <span className="px-[clamp(1rem,3vw,2.5rem)] font-display text-[clamp(2.75rem,1.4rem+6vw,7.5rem)] leading-none whitespace-nowrap text-ochre italic [font-variation-settings:'SOFT'_100,'WONK'_1]">
                  {text}
                </span>
                <Icon name="sparkle" className="size-[clamp(1.5rem,1rem+2vw,3rem)] text-accent" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
