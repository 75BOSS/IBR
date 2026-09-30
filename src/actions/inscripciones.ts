'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { cupoStatus } from '@/lib/cupo';
import { formatDateTime } from '@/lib/dates';
import { execute, queryOne, withTransaction } from '@/lib/db';
import type { FormState } from '@/lib/form-state';
import { codeFromScan, newInscripcionCode, normalizeCode } from '@/lib/inscripcion-code';
import { INSCRIPCION_ESTADOS } from '@/lib/inscripciones';
import { sendMail } from '@/lib/mail';
import { guardPublicForm } from '@/lib/public-form';
import { consumeRateLimit, minutesText } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/request';
import { siteUrl } from '@/lib/site';
import { fieldErrorsOf, id as idSchema, valuesOf } from '@/lib/validators/common';
import { INSCRIPCION_FIELDS, inscripcionSchema } from '@/lib/validators/inscripciones';

const OK = '¡Listo! Ya estás inscrito.';

type EventoRow = {
  id: number;
  titulo: string;
  slug: string;
  fecha_inicio: Date;
  todo_el_dia: boolean;
  publicado: boolean;
  requiere_inscripcion: boolean;
  cupo: number | null;
  ubicacion: string | null;
};

type Outcome =
  { ok: true; codigo: string; evento: EventoRow } | { ok: false; state: Omit<FormState, 'values'> };

const isDuplicateKey = (error: unknown) =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === 'ER_DUP_ENTRY';

function inscripcionUrl(codigo: string) {
  return `${siteUrl()}/inscripcion/${codigo}`;
}

function whenText(e: Pick<EventoRow, 'fecha_inicio' | 'todo_el_dia'>) {
  return formatDateTime(
    e.fecha_inicio,
    e.todo_el_dia
      ? { weekday: 'long', day: 'numeric', month: 'long' }
      : { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' },
  );
}

/** Inscripción pública a un evento: Zod → honeypot → límite por IP → cupo exacto → correo. */
export async function inscribirse(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = valuesOf(formData, INSCRIPCION_FIELDS);
  const parsed = inscripcionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos marcados.',
      fieldErrors: fieldErrorsOf(parsed.error),
      values,
    };
  }
  const guard = await guardPublicForm(formData, 'inscripcion', OK);
  if (!guard.ok)
    return { ...guard.state, values: guard.state.status === 'error' ? values : undefined };
  const d = parsed.data;

  // El evento queda bloqueado (FOR UPDATE) mientras se cuentan los lugares y se inserta: dos
  // personas que se inscriben a la vez por el último lugar no pueden pasar las dos.
  const outcome = await withTransaction<Outcome>(async (tx) => {
    const evento = await tx.queryOne<EventoRow>(
      `SELECT e.id, e.titulo, e.slug, e.fecha_inicio, e.todo_el_dia, e.publicado, e.requiere_inscripcion,
              e.cupo, u.nombre AS ubicacion
         FROM eventos e LEFT JOIN ubicaciones u ON u.id = e.ubicacion_id
        WHERE e.id = ? FOR UPDATE`,
      [d.evento_id],
    );
    if (!evento)
      return { ok: false, state: { status: 'error', message: 'Este evento ya no existe.' } };
    const count = await tx.queryOne<{ n: number | string }>(
      "SELECT COALESCE(SUM(personas), 0) AS n FROM inscripciones WHERE evento_id = ? AND estado <> 'cancelada'",
      [evento.id],
    );
    const status = cupoStatus({ ...evento, inscritos: Number(count?.n ?? 0) });
    if (!status.abierto)
      return { ok: false, state: { status: 'error', message: status.motivo ?? undefined } };
    if (status.disponibles !== null && d.personas > status.disponibles) {
      return {
        ok: false,
        state: {
          status: 'error',
          fieldErrors: {
            personas: [
              status.disponibles === 1
                ? 'Solo queda 1 lugar. Inscribe a 1 persona.'
                : `Solo quedan ${status.disponibles} lugares. Inscribe a ${status.disponibles} personas o menos.`,
            ],
          },
        },
      };
    }
    const repeated = await tx.queryOne<{ id: number }>(
      "SELECT id FROM inscripciones WHERE evento_id = ? AND telefono = ? AND estado <> 'cancelada'",
      [evento.id, d.telefono],
    );
    if (repeated) {
      return {
        ok: false,
        state: {
          status: 'error',
          message:
            'Ya hay una inscripción con ese WhatsApp para este evento. Si necesitas cambiarla, usa el enlace que te enviamos o escríbenos.',
        },
      };
    }
    for (let attempt = 0; ; attempt++) {
      const codigo = newInscripcionCode();
      try {
        await tx.execute(
          `INSERT INTO inscripciones (evento_id, nombre, telefono, email, personas, codigo, acepta_datos, ip)
           VALUES (?, ?, ?, ?, ?, ?, 1, INET6_ATON(?))`,
          [evento.id, d.nombre, d.telefono, d.email, d.personas, codigo, guard.ip],
        );
        return { ok: true, codigo, evento };
      } catch (error) {
        // Choque de código (improbable, ~1 en mil millones): se genera otro.
        if (!isDuplicateKey(error) || attempt >= 3) throw error;
      }
    }
  });

  if (!outcome.ok) return { ...outcome.state, values };
  const { codigo, evento } = outcome;
  if (d.email) {
    await sendMail({
      to: d.email,
      subject: `Inscripción confirmada: ${evento.titulo}`,
      text: [
        `Hola ${d.nombre}, tu inscripción quedó confirmada.`,
        '',
        evento.titulo,
        whenText(evento),
        evento.ubicacion ? `Lugar: ${evento.ubicacion}` : null,
        `Personas: ${d.personas}`,
        '',
        `Tu código: ${codigo}`,
        `Para ver o cancelar tu inscripción: ${inscripcionUrl(codigo)}`,
        '',
        'Iglesia Bíblica Riobamba',
      ]
        .filter((l) => l !== null)
        .join('\n'),
    });
  }
  revalidatePath(`/eventos/${evento.slug}`);
  revalidatePath('/admin/eventos');
  return {
    status: 'success',
    message: OK,
    secret: {
      label: 'Tu código de inscripción',
      value: codigo,
      hint: `Guárdalo o toma captura: con él ves o cancelas tu inscripción en ${inscripcionUrl(codigo)}${d.email ? '. También te lo enviamos por correo.' : '.'}`,
    },
  };
}

/** La persona cancela su propia inscripción con su código (antes de que empiece el evento). */
export async function cancelarInscripcion(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const codigo = normalizeCode(String(formData.get('codigo') ?? ''));
  if (!codigo) return { status: 'error', message: 'Ese código no es válido. Revisa el enlace.' };
  const limit = await consumeRateLimit('inscripcion_cancelar', { ip: await getClientIp() });
  if (limit.blocked) {
    return {
      status: 'error',
      message: `Demasiados intentos. Espera ${minutesText(limit.retryAfterMinutes)} o escríbenos por WhatsApp.`,
    };
  }
  const { affectedRows } = await execute(
    `UPDATE inscripciones i JOIN eventos e ON e.id = i.evento_id
        SET i.estado = 'cancelada'
      WHERE i.codigo = ? AND i.estado = 'confirmada' AND e.fecha_inicio > NOW()`,
    [codigo],
  );
  if (affectedRows === 0) {
    return {
      status: 'error',
      message:
        'No se pudo cancelar: ya estaba cancelada o el evento ya empezó. Si necesitas ayuda, escríbenos.',
    };
  }
  revalidatePath(`/inscripcion/${codigo}`);
  revalidatePath('/eventos', 'layout');
  revalidatePath('/admin/eventos', 'layout');
  return { status: 'success', message: 'Tu inscripción quedó cancelada. Liberaste tu lugar.' };
}

/** Panel: confirmar, marcar asistencia o cancelar una inscripción. */
export async function setInscripcionEstado(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(formData.get('id'));
  const estado = INSCRIPCION_ESTADOS.find((e) => e.value === formData.get('estado'));
  if (!parsed.success || !estado)
    return { status: 'error', message: 'No entendimos el cambio. Recarga la página.' };
  const { affectedRows } = await execute(
    `UPDATE inscripciones
        SET estado = ?, checkin_en = CASE WHEN ? = 'asistio' THEN COALESCE(checkin_en, NOW()) END
      WHERE id = ?`,
    [estado.value, estado.value, parsed.data],
  );
  if (affectedRows === 0)
    return { status: 'error', message: 'Esta inscripción ya no existe. Recarga la página.' };
  revalidatePath('/admin/eventos', 'layout');
  revalidatePath('/eventos', 'layout');
  return { status: 'success', message: `Marcada como «${estado.label}»` };
}

/**
 * Check-in en la puerta: registra la llegada por código (QR escaneado o escrito). Solo para el
 * evento abierto en el tablero, para que un código de otro evento no pase.
 */
export async function checkIn(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const eventoId = idSchema.safeParse(formData.get('evento_id'));
  const codigo = codeFromScan(String(formData.get('codigo') ?? ''));
  if (!eventoId.success) return { status: 'error', message: 'Recarga la página del tablero.' };
  if (!codigo) {
    return {
      status: 'error',
      message: 'Ese código no es válido: son 8 letras y números, ej. AB3D EF7H.',
    };
  }
  const insc = await queryOne<{
    id: number;
    nombre: string;
    personas: number;
    estado: string;
    checkin_en: Date | null;
    evento_id: number;
  }>(
    'SELECT id, nombre, personas, estado, checkin_en, evento_id FROM inscripciones WHERE codigo = ?',
    [codigo],
  );
  if (!insc || insc.evento_id !== eventoId.data) {
    return { status: 'error', message: `No hay una inscripción ${codigo} para este evento.` };
  }
  if (insc.estado === 'cancelada') {
    return { status: 'error', message: `La inscripción de ${insc.nombre} está cancelada.` };
  }
  if (insc.estado === 'asistio') {
    return {
      status: 'error',
      message: `${insc.nombre} ya registró su llegada${insc.checkin_en ? ` (${formatDateTime(insc.checkin_en, { hour: 'numeric', minute: '2-digit' })})` : ''}. No hace falta volver a escanear.`,
    };
  }
  await execute(
    "UPDATE inscripciones SET estado = 'asistio', checkin_en = NOW() WHERE id = ? AND estado = 'confirmada'",
    [insc.id],
  );
  revalidatePath('/admin/eventos', 'layout');
  return {
    status: 'success',
    message: `Bienvenido/a, ${insc.nombre}${insc.personas > 1 ? ` (${insc.personas} personas)` : ''}.`,
  };
}
