import type { ReactNode } from 'react';
import { Contenedor } from '@/disenos/vibrante/Contenedor';
import { Titular } from '@/disenos/vibrante/Titular';

const TONOS = {
  crema: '',
  /** Sobre el hundido el rojo de texto baja a 4.2:1: el acento pasa al rojo hondo (5.7:1). */
  hundido: 'bg-sunken [--color-accent:var(--color-accent-strong)]',
  negro: 'bg-(--d-negro) text-canvas on-dark',
  rojo: 'bg-accent text-canvas on-dark',
} as const;

export type TonoSeccion = keyof typeof TONOS;

/**
 * Sección de página de la propuesta: fondo (crema, hundido, negro o rojo), ancla opcional (`id`,
 * el encabezado fijo ya deja aire con scroll-padding) y el ritmo vertical de la propuesta. En el
 * negro, la palabra en itálica de los titulares va en rojo vivo (4.9:1), como «lugar para ti.».
 */
export function Seccion({
  id,
  tituloId,
  etiqueta,
  tono = 'crema',
  className = '',
  children,
}: {
  /** Ancla de la sección (#adn, #bautismo…). */
  id?: string;
  /** id del titular que la nombra (aria-labelledby). */
  tituloId?: string;
  /** Nombre para lectores de pantalla si la sección no tiene titular. */
  etiqueta?: string;
  tono?: TonoSeccion;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={tituloId}
      aria-label={tituloId ? undefined : etiqueta}
      data-cursor-claro={tono === 'rojo' ? '' : undefined}
      className={TONOS[tono]}
    >
      <Contenedor
        className={`py-[clamp(3rem,8vw,6rem)] ${tono === 'negro' ? '[--title-em:var(--d-rojo-vivo)]' : ''} ${className}`}
      >
        {children}
      </Contenedor>
    </section>
  );
}

/**
 * Cabecera de una sección: etiqueta con raya, titular que entra por líneas y una frase. Mide su
 * texto en su propio ancho (@container).
 */
export function CabeceraSeccion({
  etiqueta,
  id,
  lineas,
  texto,
  tamano = 'seccion',
  oscuro = false,
  className = '',
  children,
}: {
  etiqueta?: string;
  id: string;
  lineas: ReactNode[];
  texto?: ReactNode;
  tamano?: 'seccion' | 'columna' | 'banda';
  /** Sobre negro o rojo la etiqueta va en crema. */
  oscuro?: boolean;
  className?: string;
  /** Lo que va debajo de la frase (un enlace con flecha, un botón). */
  children?: ReactNode;
}) {
  return (
    <div className={`@container flex flex-col gap-[clamp(0.75rem,3cqi,1.25rem)] ${className}`}>
      {etiqueta && <p className={`eyebrow ${oscuro ? '' : 'text-accent'}`}>{etiqueta}</p>}
      <Titular id={id} tamano={tamano} lineas={lineas} />
      {texto && (
        <p className="max-w-[44ch] text-[clamp(1rem,0.95rem+0.25vw,1.1875rem)] leading-snug">
          {texto}
        </p>
      )}
      {children}
    </div>
  );
}
