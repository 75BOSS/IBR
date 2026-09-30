/** Celda CSV segura: comillas escapadas y sin fórmulas (evita inyección al abrir en Excel). */
export function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

/** Texto CSV con separador «;» y BOM: así lo abre bien Excel configurado en español. */
export function toCsv(header: string[], rows: unknown[][]): string {
  const lines = [header, ...rows].map((row) => row.map(csvCell).join(';'));
  return `﻿${lines.join('\r\n')}`;
}

/** Respuesta de descarga para un route handler. */
export function csvResponse(filename: string, header: string[], rows: unknown[][]): Response {
  return new Response(toCsv(header, rows), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
