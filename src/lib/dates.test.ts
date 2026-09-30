import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { NO_DATE, formatDateOnly, formatDateTime, todayInChurchTz } from '@/lib/dates';

describe('fechas', () => {
  it('DATE se muestra sin correrse un día', () =>
    assert.equal(formatDateOnly('2026-09-27'), '27 de septiembre de 2026'));
  it('DATETIME UTC se muestra en hora de Ecuador', () =>
    assert.match(
      formatDateTime(new Date(Date.UTC(2026, 8, 28, 0, 30))),
      /27 de septiembre de 2026.*7:30/,
    ));
  it('hoy en Ecuador después de las 19:00 sigue siendo el mismo día', () =>
    assert.equal(todayInChurchTz(new Date(Date.UTC(2026, 8, 28, 1, 0))), '2026-09-27'));
  it('texto que no es fecha se devuelve igual', () =>
    assert.equal(formatDateOnly('pronto'), 'pronto'));
  it('fecha cero del PHP → sin fecha', () => assert.equal(formatDateOnly('0000-00-00'), NO_DATE));
  it('30 de febrero → sin fecha', () => assert.equal(formatDateOnly('2026-02-30'), NO_DATE));
  it('año 0026 → sin fecha (no 1926)', () => assert.equal(formatDateOnly('0026-09-27'), NO_DATE));
});
