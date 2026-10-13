import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';
import { RUTA_INICIO } from './enlaces';

/**
 * Logo de la propuesta: el sello «ibr» (las letras son huecos y dejan ver el papel) y «Somos
 * Familia» en la letra del logo (Poppins), en dos líneas. El sello es rojo en el menú lateral y
 * azul marino en el celular, como en las imágenes 13 y 15. Lleva al inicio de la propuesta.
 */
export function LogoPoster({
  nombre,
  colorSello = 'text-accent',
  className = '',
}: {
  nombre: string;
  colorSello?: string;
  className?: string;
}) {
  return (
    <Link
      href={RUTA_INICIO}
      className={`flex w-fit items-center gap-[0.6em] rounded-md text-ink ${className}`}
    >
      {/* El sello mide según la letra del logo (em), no con los tamaños fijos de BrandMark. */}
      <span className={`flex [&>svg]:size-[2.6em] ${colorSello}`}>
        <BrandMark size="sm" />
      </span>
      <span
        aria-hidden="true"
        className="font-(family-name:--d-letra-logo) text-[1.05em] leading-[0.92] font-bold tracking-[-0.01em]"
      >
        Somos
        <br />
        Familia
      </span>
      <span className="sr-only">{nombre}: inicio</span>
    </Link>
  );
}
