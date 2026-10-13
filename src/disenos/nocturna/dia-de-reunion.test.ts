import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { diaDeReunion, unirHoras } from './dia-de-reunion';

describe('diaDeReunion', () => {
  it('destaca el domingo aunque haya reuniones antes en la semana', () => {
    assert.deepEqual(
      diaDeReunion([
        { dia_semana: 3, hora_inicio: '19:00:00' },
        { dia_semana: 7, hora_inicio: '11:00:00' },
        { dia_semana: 7, hora_inicio: '09:00:00' },
        { dia_semana: 7, hora_inicio: '09:00:00' },
      ]),
      { dia: 'Domingos', horas: ['09:00', '11:00'], domingo: true },
    );
  });

  it('sin domingo usa el primer día y no le agrega otra s', () => {
    assert.deepEqual(
      diaDeReunion([
        { dia_semana: 5, hora_inicio: '20:00:00' },
        { dia_semana: 3, hora_inicio: '19:30:00' },
      ]),
      { dia: 'Miércoles', horas: ['19:30'], domingo: false },
    );
  });

  it('sin reuniones no inventa un horario', () => {
    assert.equal(diaDeReunion([]), null);
  });
});

describe('unirHoras', () => {
  it('une las horas como se dicen', () => {
    assert.equal(unirHoras(['10:00']), '10:00');
    assert.equal(unirHoras(['09:00', '11:00']), '09:00 y 11:00');
    assert.equal(unirHoras(['08:00', '10:00', '12:00']), '08:00, 10:00 y 12:00');
    assert.equal(unirHoras([]), '');
  });
});
