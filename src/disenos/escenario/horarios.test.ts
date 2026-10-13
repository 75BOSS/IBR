import assert from 'node:assert/strict';
import { test } from 'node:test';
import { diaEnPlural, diaPrincipal } from './horarios';
import { repartirMenu } from './menu';

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

test('repartirMenu deja dos grupos a la izquierda y los sueltos en el último de la derecha', () => {
  const g = (title: string) => ({ title, items: [{ href: `/${title}`, label: title }] });
  const dar = { href: '/dar', label: 'Dar' };
  const { izquierda, derecha } = repartirMenu([g('a'), g('b'), g('c')], [dar]);
  assert.deepEqual(
    izquierda.map((x) => x.title),
    ['a', 'b'],
  );
  assert.deepEqual(
    derecha.map((x) => x.items.map((i) => i.href)),
    [['/c', '/dar']],
  );
  // Sin grupos a la derecha, los sueltos forman uno propio.
  assert.deepEqual(repartirMenu([g('a')], [dar]).derecha, [{ title: 'Más', items: [dar] }]);
  assert.deepEqual(repartirMenu([g('a'), g('b')], []).derecha, []);
});
