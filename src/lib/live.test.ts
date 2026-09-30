import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { churchClock, isInBroadcastWindow } from '@/lib/live';
import { slugify } from '@/lib/slug';

const culto = [{ dia_semana: 7, hora_inicio: '10:00:00', hora_fin: '12:00:00' }];

describe('en vivo', () => {
  it('domingo 10:30 en Ecuador = 15:30 UTC', () =>
    assert.deepEqual(churchClock(new Date('2026-10-04T15:30:00Z')), { day: 7, minutes: 630 }));
  it('dentro del culto', () =>
    assert.equal(isInBroadcastWindow(culto, new Date('2026-10-04T15:30:00Z')), true));
  it('10 min antes cuenta', () =>
    assert.equal(isInBroadcastWindow(culto, new Date('2026-10-04T14:52:00Z')), true));
  it('después del fin no', () =>
    assert.equal(isInBroadcastWindow(culto, new Date('2026-10-04T17:05:00Z')), false));
  it('otro día no', () =>
    assert.equal(isInBroadcastWindow(culto, new Date('2026-10-05T15:30:00Z')), false));
});

describe('slugify', () => {
  it('quita tildes y signos', () =>
    assert.equal(slugify('Él es mi Pastor: Salmo 23'), 'el-es-mi-pastor-salmo-23'));
  it('ñ', () => assert.equal(slugify('Año nuevo, niños'), 'ano-nuevo-ninos'));
});
