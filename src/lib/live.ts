import { TIME_ZONE } from '@/lib/site';

export type LiveSlot = { dia_semana: number; hora_inicio: string; hora_fin: string | null };

/** Día (1 = lunes … 7 = domingo) y minutos del día en hora de Ecuador. */
export function churchClock(now: Date): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday')) + 1;
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

const toMinutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));

/**
 * ¿Hay una reunión transmitida en curso? Desde 10 min antes del inicio hasta el fin (o 2 h
 * después del inicio si no tiene hora de fin).
 */
export function isInBroadcastWindow(slots: LiveSlot[], now: Date): boolean {
  const { day, minutes } = churchClock(now);
  return slots.some((slot) => {
    if (slot.dia_semana !== day) return false;
    const start = toMinutes(slot.hora_inicio);
    const end = slot.hora_fin ? toMinutes(slot.hora_fin) : start + 120;
    return minutes >= start - 10 && minutes <= end;
  });
}
