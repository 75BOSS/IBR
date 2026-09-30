import type { ReactNode } from 'react';

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** En celular es el título de la tarjeta (sin etiqueta y en negrita). */
  primary?: boolean;
  /** En celular no se antepone el nombre de la columna (ej. acciones). */
  hideLabelOnMobile?: boolean;
  className?: string;
};

/**
 * Tabla única del panel. Cabecera con color (nunca en blanco). En celular cada fila pasa a
 * una tarjeta compacta con «Etiqueta: valor», sin scroll horizontal (Reglas Pixelia).
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  caption,
  empty,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  /** Descripción para lectores de pantalla (ej. «Registros de personas nuevas»). */
  caption: string;
  /** Qué mostrar si no hay filas: qué significa y qué hacer. */
  empty: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-line/70">
      <table className="w-full border-collapse text-left max-md:block">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-brand-soft text-brand-strong max-md:hidden">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-4 py-3 text-xs font-bold tracking-wider uppercase ${column.className ?? ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line/60 max-md:block">
          {rows.length === 0 ? (
            <tr className="max-md:block">
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-ink-soft max-md:block"
              >
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="align-top hover:bg-sunken/40 max-md:block max-md:px-4 max-md:py-3"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    data-label={column.header}
                    className={`px-4 py-3 max-md:flex max-md:gap-2 max-md:px-0 max-md:py-0.5 ${
                      column.primary
                        ? 'max-md:pb-1.5 max-md:text-[1.05rem] max-md:font-semibold'
                        : column.hideLabelOnMobile
                          ? 'max-md:pt-2'
                          : 'max-md:text-sm max-md:before:w-28 max-md:before:shrink-0 max-md:before:font-semibold max-md:before:text-ink-soft max-md:before:content-[attr(data-label)]'
                    } ${column.className ?? ''}`}
                  >
                    <div className="min-w-0">{column.cell(row)}</div>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
