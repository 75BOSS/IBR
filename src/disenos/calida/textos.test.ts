import assert from 'node:assert/strict';
import { test } from 'node:test';
import { diaPrincipal, listaNatural, menuCalida } from './textos';

test('listaNatural une con comas y «y»', () => {
  assert.equal(listaNatural([]), '');
  assert.equal(listaNatural(['Norte']), 'Norte');
  assert.equal(listaNatural(['Norte', 'Sur']), 'Norte y Sur');
  assert.equal(listaNatural(['Norte', 'Centro', 'Sur']), 'Norte, Centro y Sur');
});

test('diaPrincipal prefiere el domingo y junta sus horas sin repetir', () => {
  assert.equal(diaPrincipal([]), null);
  assert.deepEqual(
    diaPrincipal([
      { dia_semana: 3, hora_inicio: '19:00:00' },
      { dia_semana: 7, hora_inicio: '11:00:00' },
      { dia_semana: 7, hora_inicio: '09:00:00' },
      { dia_semana: 7, hora_inicio: '09:00:00' },
    ]),
    { dia: 'Domingos', horas: '09:00 y 11:00' },
  );
  // Sin domingo: el primer día con reunión, sin una «s» de más.
  assert.deepEqual(diaPrincipal([{ dia_semana: 3, hora_inicio: '19:30:00' }]), {
    dia: 'Miércoles',
    horas: '19:30',
  });
});

test('menuCalida agrega Comunidad al inicio de Conéctate', () => {
  const menu = menuCalida([
    { title: 'Conócenos', items: [{ href: '/nosotros', label: 'Nosotros' }] },
    { title: 'Conéctate', items: [{ href: '/soy-nuevo', label: 'Soy nuevo' }] },
  ]);
  assert.deepEqual(
    menu.map((g) => g.items.map((i) => i.href)),
    [['/nosotros'], ['/disenos/calida/comunidad', '/soy-nuevo']],
  );
});
