import assert from 'node:assert/strict';
import { test } from 'node:test';
import { diaDeHoy, diaEnPlural, diaPrincipal } from './horarios';

test('diaPrincipal toma el primer día y une sus horas sin repetir', () => {
  assert.equal(diaPrincipal([]), null);
  assert.deepEqual(
    diaPrincipal([
      { dia_semana: 7, hora_inicio: '10:00:00' },
      { dia_semana: 7, hora_inicio: '10:00:00' },
      { dia_semana: 7, hora_inicio: '18:00:00' },
      { dia_semana: 3, hora_inicio: '19:00:00' },
    ]),
    { dia: 'Domingos', horas: '10:00 y 18:00' },
  );
  assert.deepEqual(diaPrincipal([{ dia_semana: 3, hora_inicio: '19:30:00' }]), {
    dia: 'Miércoles',
    horas: '19:30',
  });
});

test('diaEnPlural no duplica la s de lunes a viernes', () => {
  assert.equal(diaEnPlural('Sábado'), 'Sábados');
  assert.equal(diaEnPlural('Jueves'), 'Jueves');
});

test('diaDeHoy usa la hora de Ecuador y pone mayúscula', () => {
  // 13 de octubre de 2026, 03:00 UTC = lunes 12 a las 22:00 en Guayaquil.
  assert.equal(diaDeHoy(new Date('2026-10-13T03:00:00Z')), 'Lunes');
  assert.equal(diaDeHoy(new Date('2026-10-14T15:00:00Z')), 'Miércoles');
});
