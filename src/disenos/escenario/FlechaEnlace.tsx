import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { FLECHA } from './estilos';

/**
 * Enlace rojo subrayado con flecha («Ver ubicación →», «Conoce qué esperar →», imagen 11).
 * `externo` abre en una pestaña nueva (Google Maps) y lo avisa a los lectores de pantalla.
 */
export function FlechaEnlace({
  href,
  children,
  externo = false,
}: {
  href: string;
  children: React.ReactNode;
  externo?: boolean;
}) {
  const clase =
    'group inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline decoration-1 underline-offset-[0.3em] transition-colors hover:text-accent-strong hover:decoration-2';
  const contenido = (
    <>
      {children}
      <Icon name="arrowRight" className={FLECHA} />
    </>
  );
  if (externo) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={clase}>
        {contenido}
        <span className="sr-only"> (abre en una pestaña nueva)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={clase}>
      {contenido}
    </Link>
  );
}
