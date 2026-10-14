import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { devocionalDeHoy } from './semana';

const PLAN = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];

describe('devocionalDeHoy', () => {
  it('de lunes a viernes toca la lectura de ese día', () => {
    // 2026-10-13 es martes y 2026-10-16, viernes.
    assert.deepEqual(devocionalDeHoy(PLAN, '2026-10-13'), {
      devocional: 'martes',
      indice: 1,
      hoy: true,
    });
    assert.equal(devocionalDeHoy(PLAN, '2026-10-16')?.devocional, 'viernes');
  });

  it('el fin de semana muestra la del lunes como la próxima', () => {
    assert.deepEqual(devocionalDeHoy(PLAN, '2026-10-18'), {
      devocional: 'lunes',
      indice: 0,
      hoy: false,
    });
    assert.equal(devocionalDeHoy(PLAN, '2026-10-17')?.hoy, false);
  });

  it('sin plan no hay lectura', () => {
    assert.equal(devocionalDeHoy([], '2026-10-13'), null);
  });
});
