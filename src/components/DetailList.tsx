import type { ReactNode } from 'react';

export type Detail = { label: string; value: ReactNode };

/**
 * Datos de una ficha («Cuándo», «Dónde», «Líder»…) en una lista de definición. De a dos columnas
 * cuando hay espacio, según su propio ancho: en la columna angosta de un evento van una debajo
 * de otra y en la ficha ancha de un grupo, de a dos. Los datos vacíos (`dato && {…}`) se omiten.
 */
/** Lo que deja `dato && {…}` cuando el dato está vacío. */
type Empty = false | '' | 0 | null | undefined;

export function DetailList({ items }: { items: (Detail | Empty)[] }) {
  return (
    <div className="@container">
      <dl className="grid gap-4 @md:grid-cols-2">
        {items
          .filter((item): item is Detail => Boolean(item))
          .map(({ label, value }) => (
            <div key={label}>
              <dt className="text-sm font-semibold text-ink-soft">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
      </dl>
    </div>
  );
}
