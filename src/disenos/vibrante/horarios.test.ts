import assert from 'node:assert/strict';
import { test } from 'node:test';
import { horarioPrincipal } from './horarios';

test('horarioPrincipal toma la primera reunión y nombra el día en plural', () => {
  assert.deepEqual(
    horarioPrincipal([
      { dia_semana: 7, hora_inicio: '10:00:00' },
      { dia_semana: 3, hora_inicio: '19:00:00' },
    ]),
    { dias: 'Domingos', hora: '10:00' },
  );
  assert.deepEqual(horarioPrincipal([{ dia_semana: 1, hora_inicio: '19:30:00' }]), {
    dias: 'Lunes',
    hora: '19:30',
  });
});

test('horarioPrincipal sin reuniones no inventa un horario', () => {
  assert.equal(horarioPrincipal([]), null);
});
