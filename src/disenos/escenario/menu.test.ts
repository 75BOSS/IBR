import assert from 'node:assert/strict';
import { test } from 'node:test';
import { menuEscenario, rutaCrecer } from './menu';

const vacio = { creencias: false, equipo: false, servir: false, eventos: false, dar: false };
const lleno = { creencias: true, equipo: true, servir: true, eventos: true, dar: true };
const hrefs = (m: ReturnType<typeof menuEscenario>) =>
  [...m.izquierda, ...m.derecha].flatMap((g) => g.items.map((i) => i.href));

test('menuEscenario solo enlaza anclas y páginas con contenido', () => {
  const sin = menuEscenario(vacio, []);
  const todos = hrefs(sin);
  assert.ok(!todos.some((h) => h.endsWith('#creemos') || h.endsWith('#equipo')));
  assert.ok(!todos.some((h) => h.endsWith('#kids') || h.endsWith('#jovenes')));
  assert.ok(!todos.includes('/servir') && !todos.includes('/eventos'));
  assert.deepEqual(
    sin.sueltos.map((s) => s.href),
    ['/oracion'],
  );
  // Mujeres es un ministerio de ejemplo: su ancla siempre existe en Ministerios.
  assert.ok(todos.includes('/disenos/escenario/ministerios#mujeres'));

  const con = menuEscenario(lleno, ['kids', 'jovenes']);
  const conTodos = hrefs(con);
  for (const h of ['#creemos', '#equipo', '#kids', '#jovenes']) {
    assert.ok(
      conTodos.some((x) => x.endsWith(h)),
      h,
    );
  }
  assert.ok(conTodos.includes('/servir') && conTodos.includes('/eventos'));
  assert.deepEqual(
    con.sueltos.map((s) => s.href),
    ['/oracion', '/dar'],
  );
});

test('menuEscenario reparte tres grupos a la izquierda y Recursos a la derecha', () => {
  const m = menuEscenario(lleno, []);
  assert.deepEqual(
    m.izquierda.map((g) => g.titulo),
    ['Conócenos', 'Siguiente paso', 'Comunidad'],
  );
  assert.deepEqual(
    m.derecha.map((g) => g.titulo),
    ['Recursos'],
  );
});

test('rutaCrecer resuelve anclas, grupos y servir según el contenido', () => {
  const fuera = rutaCrecer({ grupos: false, servir: false }, false).map((p) => p.href);
  assert.deepEqual(fuera, [
    '/disenos/escenario/crecer#salvacion',
    '/disenos/escenario/crecer#bautismo',
    '/contacto#mensaje',
    '/disenos/escenario/crecer#formacion',
    '/contacto#mensaje',
  ]);
  const dentro = rutaCrecer({ grupos: true, servir: true }, true).map((p) => p.href);
  assert.deepEqual(dentro, ['#salvacion', '#bautismo', '/grupos', '#formacion', '/servir']);
});
