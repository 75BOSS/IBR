import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import { EnlaceFlecha } from './EnlaceFlecha';
import { Foto } from './Foto';
import { Titulo } from './Titulo';
import { Texto } from './Texto';

export type TarjetaComunidad = {
  href: string;
  titulo: string;
  texto: string;
  enlace: string;
  foto: string;
  alt: string;
  /** Dato real debajo del texto (cuántos grupos, qué ministerios, qué áreas). */
  dato?: ReactNode;
};

/**
 * Columnas según cuántas tarjetas hay (cada una aparece solo si su página tiene contenido): con
 * tres, en tablet la tercera ocupa toda la fila y se pone horizontal; nunca queda un hueco.
 */
function columnas(cuantas: number): { lista: string; ultima: string } {
  if (cuantas >= 3) {
    return { lista: 'md:grid-cols-2 lg:grid-cols-3', ultima: 'md:col-span-2 lg:col-span-1' };
  }
  return { lista: cuantas === 2 ? 'md:grid-cols-2' : '', ultima: '' };
}

/**
 * Las tres puertas de la comunidad (imagen 2): foto, título en serifa, texto, el dato real y el
 * enlace en versalitas naranjas. Cada tarjeta mide su forma por su propio ancho (@container):
 * angosta, la foto arriba; ancha (una sola o la tercera en tablet), la foto al costado.
 */
export function TarjetasComunidad({ tarjetas }: { tarjetas: TarjetaComunidad[] }) {
  if (tarjetas.length === 0) return null;
  const { lista, ultima } = columnas(tarjetas.length);
  return (
    <ul
      className={`grid gap-x-[clamp(1rem,1.8vw,1.75rem)] gap-y-[clamp(2rem,4vw,2.5rem)] ${lista}`}
    >
      {tarjetas.map((t, i) => (
        <li key={t.href} className={`group @container ${i === tarjetas.length - 1 ? ultima : ''}`}>
          <div className="grid gap-[clamp(0.875rem,4cqi,1.25rem)] @2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] @2xl:items-center @2xl:gap-x-[clamp(1.5rem,4cqi,2.5rem)]">
            <Foto
              src={t.foto}
              alt={t.alt}
              sizes="(min-width: 64rem) 30vw, (min-width: 48rem) 50vw, 100vw"
              zoom
              className="relative aspect-[449/194] rounded-[0.625rem] @2xl:aspect-[16/9]"
            />
            <div className="flex flex-col items-start gap-[clamp(0.5rem,2.4cqi,0.75rem)]">
              <Titulo tamano="tarjeta" className="text-ink">
                {t.titulo}
              </Titulo>
              <Texto className="max-w-[28rem]">{t.texto}</Texto>
              {t.dato}
              <div className="pt-[clamp(0.25rem,1.5cqi,0.75rem)]">
                <EnlaceFlecha href={t.href}>{t.enlace}</EnlaceFlecha>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Línea de dato con ícono (ej. «8 grupos en Norte, Centro y Sur»). */
export function DatoConIcono({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[0.95rem] font-semibold text-ink-soft">
      <Icon name="users" className="size-4 text-accent-strong" />
      {children}
    </p>
  );
}
