import assert from 'node:assert/strict';
import { test } from 'node:test';
import { agruparHorarios, unirHoras } from './horarios';

test('agruparHorarios junta las reuniones de la misma hora y pone el domingo primero', () => {
  const horarios = agruparHorarios([
    { dia_semana: 3, hora_inicio: '19:00:00', nombre: 'Reunión de oración' },
    { dia_semana: 7, hora_inicio: '10:00:00', nombre: 'Culto dominical' },
    { dia_semana: 6, hora_inicio: '17:30:00', nombre: 'Jóvenes' },
    { dia_semana: 7, hora_inicio: '10:00:00', nombre: 'Kids' },
    { dia_semana: 6, hora_inicio: '15:00:00', nombre: 'Adolescentes' },
  ]);
  assert.deepEqual(horarios, [
    { dia: 'Domingo', hora: '10:00', nombres: ['Culto dominical', 'Kids'] },
    { dia: 'Miércoles', hora: '19:00', nombres: ['Reunión de oración'] },
    { dia: 'Sábado', hora: '15:00', nombres: ['Adolescentes'] },
    { dia: 'Sábado', hora: '17:30', nombres: ['Jóvenes'] },
  ]);
});

test('agruparHorarios sin reuniones devuelve una lista vacía', () => {
  assert.deepEqual(agruparHorarios([]), []);
});

test('unirHoras une con comas y «y»', () => {
  assert.equal(unirHoras([]), '');
  assert.equal(unirHoras(['10:00']), '10:00');
  assert.equal(unirHoras(['10:00', '18:00']), '10:00 y 18:00');
  assert.equal(unirHoras(['8:00', '10:00', '18:00']), '8:00, 10:00 y 18:00');
});
