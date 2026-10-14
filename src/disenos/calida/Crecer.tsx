import Link from 'next/link';
import type { Curso } from '@/disenos/contenido';
import { Icon } from '@/components/Icon';
import { Etiqueta } from './Etiqueta';
import { Foto } from './Foto';
import { Titulo } from './Titulo';
import { botonCalida } from './botones';
import { Texto } from './Texto';

/**
 * Salvación (SALVACION): banda azul noche con la luz cálida que sigue al mouse. A la izquierda el
 * mensaje; a la derecha la oración destacada en la itálica caligráfica, dentro de un marco con
 * comillas grandes, y la invitación a contarnos.
 */
export function SalvacionBanda({
  id,
  titulo,
  texto,
  oracion,
  siguiente,
}: {
  id: string;
  titulo: string;
  texto: string;
  oracion: string;
  siguiente: string;
}) {
  // «Un nuevo comienzo» → «Un nuevo <em>comienzo</em>»: la última palabra en itálica.
  const corte = titulo.lastIndexOf(' ');
  return (
    <div className="@container">
      <div
        data-luz=""
        className="calida-luz relative isolate grid gap-[clamp(2rem,5cqi,4rem)] overflow-clip bg-(--d-noche) px-[clamp(1.25rem,5cqi,4.5rem)] py-[clamp(2.5rem,7cqi,5.5rem)] text-cream on-dark md:rounded-[0.875rem] @4xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] @4xl:items-center"
      >
        <div className="calida-aparece flex flex-col items-start gap-4">
          <Etiqueta className="text-peach">Paso 01 · Salvación</Etiqueta>
          <Titulo id={id} tamano="seccion" className="text-cream">
            {titulo.slice(0, corte)} <em>{titulo.slice(corte + 1)}</em>
          </Titulo>
          <Texto className="max-w-[32rem] text-cream/85">{texto}</Texto>
        </div>
        <figure className="calida-aparece relative flex flex-col gap-5 rounded-[0.875rem] px-[clamp(1.5rem,5cqi,3rem)] pt-[clamp(3rem,7cqi,4.25rem)] pb-[clamp(1.5rem,5cqi,3rem)] ring-1 ring-peach/35">
          <span
            aria-hidden="true"
            className="absolute -top-[0.45em] left-[clamp(1rem,4cqi,2rem)] bg-(--d-noche) px-3 font-script text-[clamp(4rem,3rem+4cqi,6.5rem)] leading-none text-peach italic"
          >
            “
          </span>
          <figcaption className="text-[0.75rem] font-bold tracking-[0.2em] text-peach uppercase">
            Una oración para empezar
          </figcaption>
          <blockquote className="font-script text-[clamp(1.5rem,1.1rem+1.8cqi,2.375rem)] leading-[1.2] text-cream italic">
            {oracion}
          </blockquote>
          <p className="border-t border-cream/15 pt-4 text-cream/85">{siguiente}</p>
          <Link href="/contacto#mensaje" className={botonCalida('naranja', 'normal', 'self-start')}>
            Hice esta oración
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </figure>
      </div>
    </div>
  );
}

/** Escalones de la Escuela de Discipulado en escritorio (cada módulo un poco más abajo). */
const ESCALON = ['', 'xl:mt-12', 'xl:mt-24', 'xl:mt-36'];

/**
 * Escuela de Discipulado (CURSOS, como los módulos de CIEM): cuatro módulos que bajan como una
 * escalera en escritorio, unidos por una raya; cada uno con su número, duración, título y texto.
 */
export function CursosEscalera({ cursos }: { cursos: Curso[] }) {
  return (
    <ol className="calida-escalonado grid gap-[clamp(0.875rem,2vw,1.5rem)] md:grid-cols-2 xl:grid-cols-4">
      {cursos.map((c, i) => (
        <li
          key={c.titulo}
          className={`calida-elevar relative flex flex-col gap-3 rounded-[0.875rem] bg-surface p-[clamp(1.25rem,2.4vw,1.75rem)] ring-1 ring-line ${ESCALON[i] ?? ''}`}
        >
          <span className="flex items-center justify-between gap-3">
            <span className="text-[0.75rem] font-bold tracking-[0.2em] text-accent-strong uppercase">
              Módulo {i + 1}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-[0.85rem] font-semibold text-ink">
              <Icon name="clock" className="size-3.5 text-accent-strong" />
              {c.duracion}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="font-script text-[clamp(3rem,2.5rem+2vw,4.5rem)] leading-[0.85] text-accent/25 italic"
          >
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className="font-display text-[clamp(1.5rem,1.3rem+0.8vw,1.875rem)] leading-tight hyphens-auto text-ink">
            {c.titulo}
          </h3>
          <p className="text-[clamp(1rem,0.96rem+0.2vw,1.0625rem)] leading-normal text-ink-soft">
            {c.texto}
          </p>
        </li>
      ))}
    </ol>
  );
}

/**
 * Áreas de servicio reales como un mosaico de fotos (la primera más grande, tres columnas desde
 * tablet) con el nombre encima;
 * la foto se acerca despacio al pasar el mouse. Sin foto, un bloque azul noche con el nombre.
 */
export function AreasMosaico({
  areas,
  href,
}: {
  areas: { id: number; nombre: string; descripcion: string | null; imagen_url: string | null }[];
  /** A dónde lleva cada área: /servir si existe, si no a Contacto. */
  href: string;
}) {
  return (
    <ul className="calida-escalonado grid grid-cols-2 gap-[clamp(0.625rem,1.5vw,1.125rem)] md:grid-cols-3">
      {areas.map((a, i) => (
        <li
          key={a.id}
          className={
            i === 0
              ? 'col-span-2 md:row-span-2'
              : // En dos columnas, si queda una sola al final, ocupa la fila entera (sin hueco).
                i === areas.length - 1 && (areas.length - 1) % 2 === 1
                ? 'max-md:col-span-2'
                : ''
          }
        >
          <Link
            href={href}
            className={`group calida-elevar relative isolate flex h-full flex-col justify-end ${i === 0 ? 'min-h-[clamp(15rem,50vw,24rem)]' : 'min-h-[clamp(9rem,18vw,13rem)]'} overflow-clip rounded-[0.875rem] bg-(--d-noche) p-[clamp(0.875rem,2vw,1.5rem)] text-cream on-dark`}
          >
            {a.imagen_url && (
              <Foto
                src={a.imagen_url}
                alt=""
                sizes={i === 0 ? '(min-width: 48rem) 50vw, 100vw' : '(min-width: 48rem) 25vw, 50vw'}
                zoom
                className="absolute inset-0 -z-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-(--d-noche) from-10% via-(--d-noche)/65 via-50% to-(--d-noche)/5"
                />
              </Foto>
            )}
            <span
              className={`font-display leading-tight wrap-break-word hyphens-auto ${
                i === 0
                  ? 'text-[clamp(1.75rem,1.3rem+2vw,3rem)]'
                  : 'text-[clamp(1.125rem,1rem+0.6vw,1.5rem)]'
              }`}
            >
              {a.nombre}
            </span>
            {i === 0 && a.descripcion && (
              <span className="mt-1 max-w-[28rem] text-cream/85">{a.descripcion}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
