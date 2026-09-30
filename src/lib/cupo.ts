/** Estado de las inscripciones de un evento (función pura: la usan el sitio, la API y la acción). */
export type CupoStatus = {
  /** ¿Se puede inscribir alguien ahora? */
  abierto: boolean;
  /** null = sin límite. */
  cupo: number | null;
  inscritos: number;
  /** null = sin límite. */
  disponibles: number | null;
  /** Por qué está cerrado, en palabras para el visitante. */
  motivo: string | null;
};

export function cupoStatus(
  e: {
    publicado: boolean;
    requiere_inscripcion: boolean;
    cupo: number | null;
    inscritos: number;
    fecha_inicio: Date;
  },
  now: Date = new Date(),
): CupoStatus {
  const inscritos = Number(e.inscritos);
  const disponibles = e.cupo === null ? null : Math.max(0, e.cupo - inscritos);
  const base = { cupo: e.cupo, inscritos, disponibles };
  if (!e.publicado || !e.requiere_inscripcion)
    return { ...base, abierto: false, motivo: 'Este evento no tiene inscripción en el sitio.' };
  if (e.fecha_inicio.getTime() <= now.getTime())
    return {
      ...base,
      abierto: false,
      motivo: 'Las inscripciones se cerraron: el evento ya empezó.',
    };
  if (disponibles === 0)
    return { ...base, abierto: false, motivo: 'Se llenó el cupo. ¡Gracias por el interés!' };
  return { ...base, abierto: true, motivo: null };
}

/** «Quedan 12 lugares» / «Queda 1 lugar» / «Sin límite de cupo». */
export function disponiblesText(s: CupoStatus): string {
  if (s.disponibles === null) return 'Sin límite de cupo';
  if (s.disponibles === 0) return 'Cupo lleno';
  return s.disponibles === 1 ? 'Queda 1 lugar' : `Quedan ${s.disponibles} lugares`;
}
