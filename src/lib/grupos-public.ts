/** Tipos y etiquetas del directorio público (sin datos privados del líder). */
export type GrupoPublico = {
  id: number;
  nombre: string;
  descripcion: string | null;
  tipo: string | null;
  dia_semana: number | null;
  hora: string | null;
  frecuencia: 'semanal' | 'quincenal' | 'mensual';
  lider_nombre: string | null;
  cupo: number | null;
  imagen_url: string | null;
  rango_edad_id: number | null;
  rango_edad: string | null;
  rango_color: string | null;
  ubicacion: string | null;
  ubicacion_tipo: string | null;
  zona: string | null;
  direccion: string | null;
};

export const FRECUENCIAS_LABEL: Record<GrupoPublico['frecuencia'], string> = {
  semanal: 'Cada semana',
  quincenal: 'Cada 15 días',
  mensual: 'Una vez al mes',
};
