import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cupoStatus, disponiblesText } from '@/lib/cupo';

const now = new Date('2026-10-01T15:00:00Z');
const base = {
  publicado: true,
  requiere_inscripcion: true,
  cupo: 10,
  inscritos: 7,
  fecha_inicio: new Date('2026-10-05T15:00:00Z'),
};

test('abierto con lugares disponibles', () => {
  const s = cupoStatus(base, now);
  assert.equal(s.abierto, true);
  assert.equal(s.disponibles, 3);
  assert.equal(disponiblesText(s), 'Quedan 3 lugares');
});

test('lleno, empezado, sin inscripción o borrador: cerrado con motivo', () => {
  assert.equal(cupoStatus({ ...base, inscritos: 10 }, now).abierto, false);
  assert.equal(disponiblesText(cupoStatus({ ...base, inscritos: 12 }, now)), 'Cupo lleno');
  assert.match(cupoStatus({ ...base, fecha_inicio: now }, now).motivo ?? '', /ya empezó/);
  assert.equal(cupoStatus({ ...base, requiere_inscripcion: false }, now).abierto, false);
  assert.equal(cupoStatus({ ...base, publicado: false }, now).abierto, false);
});

test('sin cupo = sin límite; el conteo llega como texto desde MySQL', () => {
  const s = cupoStatus({ ...base, cupo: null, inscritos: '40' as unknown as number }, now);
  assert.equal(s.abierto, true);
  assert.equal(s.disponibles, null);
  assert.equal(s.inscritos, 40);
  assert.equal(disponiblesText(cupoStatus({ ...base, inscritos: 9 }, now)), 'Queda 1 lugar');
});
