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
 * Tabla única del panel. Cabecera con color (nunca en blanco). Cuando no cabe (menos de 56rem
 * de ancho) cada fila pasa a una tarjeta compacta con «Etiqueta: valor», sin scroll horizontal
 * (Reglas Pixelia). Decide por su propio ancho (@container), no por el de la ventana: desde
 * 1024 px aparece la barra lateral y al contenido le queda menos que en una tablet.
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
    <div className="@container overflow-hidden rounded-2xl bg-surface ring-1 ring-line/70">
      <table className="w-full border-collapse text-left @max-4xl:block">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-brand-soft text-brand-strong @max-4xl:hidden">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-4 py-3 caps ${column.className ?? ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line/60 @max-4xl:block">
          {rows.length === 0 ? (
            <tr className="@max-4xl:block">
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-ink-soft @max-4xl:block"
              >
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="align-top hover:bg-sunken/40 @max-4xl:block @max-4xl:px-4 @max-4xl:py-3"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    data-label={column.header}
                    className={`px-4 py-3 @max-4xl:flex @max-4xl:gap-2 @max-4xl:px-0 @max-4xl:py-0.5 ${
                      column.primary
                        ? '@max-4xl:pb-1.5 @max-4xl:text-[1.05rem] @max-4xl:font-semibold'
                        : column.hideLabelOnMobile
                          ? '@max-4xl:pt-2'
                          : '@max-4xl:text-sm @max-4xl:before:w-28 @max-4xl:before:shrink-0 @max-4xl:before:font-semibold @max-4xl:before:text-ink-soft @max-4xl:before:content-[attr(data-label)]'
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
