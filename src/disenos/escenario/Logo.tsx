import { BrandLogo } from '@/components/BrandMark';

/**
 * Logo «Somos Familia» de la propuesta, en dos tonos:
 * - `crema`: sello y letras crema (encabezado azul marino, sobre la foto y en el pie).
 * - `rojo`: sello rojo y letras azul marino (encabezado claro de las páginas interiores). Son dos
 *   copias del mismo logo recortadas con clip-path: el sello ocupa el 35 % izquierdo del dibujo
 *   (x 0–597 de 1716) y las letras empiezan en el 38 %; el corte va en el hueco del 37 %.
 * Decorativo: quien lo usa pone el nombre de la iglesia en texto para lectores de pantalla.
 */
export function Logo({ tono, alto }: { tono: 'crema' | 'rojo'; alto: string }) {
  if (tono === 'crema') return <BrandLogo className={`${alto} text-cream`} />;
  return (
    <span className="grid">
      <BrandLogo
        className={`${alto} col-start-1 row-start-1 text-(--d-rojo) [clip-path:inset(0_63%_0_0)]`}
      />
      <BrandLogo
        className={`${alto} col-start-1 row-start-1 text-ink [clip-path:inset(0_0_0_37%)]`}
      />
    </span>
  );
}
