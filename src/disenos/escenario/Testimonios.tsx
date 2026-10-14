import type { Testimonio } from '@/disenos/contenido';

/** Iniciales de quien da el testimonio (círculo rojo) y su barrio de Riobamba. */
function Firma({ t, tono }: { t: Testimonio; tono: 'claro' | 'oscuro' }) {
  return (
    <figcaption className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-full bg-accent font-display text-lg font-extrabold text-cream"
      >
        {t.nombre.charAt(0)}
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className={`font-display font-bold ${tono === 'oscuro' ? 'text-cream' : 'text-ink'}`}>
          {t.nombre}
        </span>
        <span className={`text-sm ${tono === 'oscuro' ? 'text-cream/75' : 'text-ink-soft'}`}>
          {t.barrio} · Riobamba
        </span>
      </span>
    </figcaption>
  );
}

/**
 * Testimonios (de ejemplo): el primero destacado en una tarjeta azul marino con la cita en la
 * serifa cursiva y unas comillas rojas enormes; los demás en tarjetas crema. Mide su contenedor:
 * angosto, una columna; ancho, el destacado a la izquierda y los demás apilados a la derecha.
 * Las tarjetas se levantan al pasar el cursor.
 */
export function Testimonios({ testimonios }: { testimonios: Testimonio[] }) {
  const [primero, ...resto] = testimonios;
  if (!primero) return null;
  return (
    <div className="@container">
      <ul className="grid gap-[clamp(1rem,2.5cqi,1.5rem)] @3xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <li className="@3xl:row-span-3">
          <figure className="d-tarjeta relative isolate flex h-full flex-col justify-end gap-6 overflow-hidden rounded-[1.75rem] bg-(--d-marino) p-[clamp(1.5rem,5cqi,2.75rem)] pt-[clamp(4.5rem,14cqi,7rem)] text-cream on-dark">
            <span
              aria-hidden="true"
              className="absolute top-[clamp(1rem,3cqi,1.75rem)] left-[clamp(1.25rem,4.5cqi,2.5rem)] -z-10 font-serif text-[clamp(7rem,22cqi,13rem)] leading-[0.8] font-black text-(--d-rojo)"
            >
              “
            </span>
            <blockquote className="font-serif text-[clamp(1.375rem,1.05rem+2cqi,2.125rem)] leading-snug font-medium text-balance italic">
              {primero.texto}
            </blockquote>
            <Firma t={primero} tono="oscuro" />
          </figure>
        </li>
        {resto.map((t) => (
          <li key={t.nombre}>
            <figure className="d-tarjeta flex h-full flex-col justify-between gap-4 rounded-2xl border-l-4 border-(--d-rojo) bg-surface p-[clamp(1.25rem,4cqi,1.75rem)] shadow-card">
              <blockquote className="text-[clamp(1.0625rem,1rem+0.4cqi,1.1875rem)] text-ink">
                «{t.texto}»
              </blockquote>
              <Firma t={t} tono="claro" />
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
