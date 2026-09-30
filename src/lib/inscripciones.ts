import 'server-only';
import { query, queryOne } from '@/lib/db';

export type Inscripcion = {
  id: number;
  evento_id: number;
  nombre: string;
  telefono: string;
  email: string | null;
  personas: number;
  codigo: string;
  estado: 'confirmada' | 'cancelada' | 'asistio';
  creado_en: Date;
};

const COLUMNS =
  'i.id, i.evento_id, i.nombre, i.telefono, i.email, i.personas, i.codigo, i.estado, i.creado_en';

export function listInscripciones(eventoId: number): Promise<Inscripcion[]> {
  return query<Inscripcion>(
    `SELECT ${COLUMNS} FROM inscripciones i WHERE i.evento_id = ?
      ORDER BY i.estado = 'cancelada', i.creado_en`,
    [eventoId],
  );
}

export type InscripcionPublica = Inscripcion & {
  evento_titulo: string;
  evento_slug: string;
  fecha_inicio: Date;
  todo_el_dia: boolean;
  ubicacion: string | null;
};

/** Para la página /inscripcion/[codigo]: la persona ve y puede cancelar la suya. */
export function getInscripcionByCode(codigo: string): Promise<InscripcionPublica | null> {
  return queryOne<InscripcionPublica>(
    `SELECT ${COLUMNS}, e.titulo AS evento_titulo, e.slug AS evento_slug, e.fecha_inicio, e.todo_el_dia,
            u.nombre AS ubicacion
       FROM inscripciones i
       JOIN eventos e ON e.id = i.evento_id
       LEFT JOIN ubicaciones u ON u.id = e.ubicacion_id
      WHERE i.codigo = ?`,
    [codigo],
  );
}

export const INSCRIPCION_ESTADOS = [
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'asistio', label: 'Asistió' },
  { value: 'cancelada', label: 'Cancelada' },
] as const;
