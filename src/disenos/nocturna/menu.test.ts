import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { RUTA_CRECER } from '../contenido';
import { armarMenu, destinoPaso, esPaginaActual, grupoActivo } from './menu';
import { RUTAS } from './rutas';

const TODO = { creencias: true, equipo: true, servir: true, eventos: true, dar: true };
const NADA = { creencias: false, equipo: false, servir: false, eventos: false, dar: false };

const hrefs = (menu: ReturnType<typeof armarMenu>) => [
  ...menu.grupos.flatMap((g) => g.items.map((i) => i.href)),
  ...menu.sueltos.map((i) => i.href),
];

describe('armarMenu', () => {
  it('con todo el contenido enlaza las anclas y las páginas del sitio', () => {
    const todos = hrefs(armarMenu(TODO, ['kids', 'jovenes', 'adultos']));
    for (const esperado of [
      `${RUTAS.conocenos}#creemos`,
      `${RUTAS.conocenos}#equipo`,
      `${RUTAS.ministerios}#kids`,
      `${RUTAS.ministerios}#jovenes`,
      '/servir',
      '/eventos',
      '/dar',
    ]) {
      assert.ok(todos.includes(esperado), `falta ${esperado}`);
    }
  });

  it('sin contenido no enlaza páginas vacías ni anclas que no existen', () => {
    const todos = hrefs(armarMenu(NADA, []));
    for (const ausente of [
      `${RUTAS.conocenos}#creemos`,
      `${RUTAS.conocenos}#equipo`,
      `${RUTAS.ministerios}#kids`,
      `${RUTAS.ministerios}#jovenes`,
      '/servir',
      '/eventos',
      '/dar',
    ]) {
      assert.ok(!todos.includes(ausente), `sobra ${ausente}`);
    }
    // Lo que siempre existe: las páginas de la propuesta, Mujeres (ejemplo) y Oración.
    assert.ok(todos.includes(RUTAS.primeraVisita));
    assert.ok(todos.includes(`${RUTAS.ministerios}#mujeres`));
    assert.ok(todos.includes('/oracion'));
  });

  it('cada grupo tiene enlaces sin repetir', () => {
    for (const grupo of armarMenu(TODO, ['kids', 'jovenes']).grupos) {
      const lista = grupo.items.map((i) => i.href);
      assert.equal(new Set(lista).size, lista.length, grupo.titulo);
      assert.ok(lista.length > 0, grupo.titulo);
    }
  });
});

describe('página actual', () => {
  it('un ancla nunca es la página actual; el grupo sí se marca', () => {
    assert.equal(esPaginaActual(RUTAS.crecer, `${RUTAS.crecer}#bautismo`), false);
    assert.equal(esPaginaActual(`${RUTAS.crecer}/`, RUTAS.crecer), true);
    const siguiente = armarMenu(TODO, []).grupos.find((g) => g.titulo === 'Siguiente paso');
    assert.ok(siguiente);
    assert.equal(grupoActivo(RUTAS.crecer, siguiente), true);
    assert.equal(grupoActivo(RUTAS.inicio, siguiente), false);
  });
});

describe('destinoPaso', () => {
  it('las anclas van a Crecer (o se quedan en la misma página)', () => {
    assert.equal(
      destinoPaso('#salvacion', { grupos: true, servir: true }),
      `${RUTAS.crecer}#salvacion`,
    );
    assert.equal(destinoPaso('#salvacion', { grupos: true, servir: true }, true), '#salvacion');
  });

  it('grupos y servir solo si tienen contenido; si no, a escribir un mensaje', () => {
    assert.equal(destinoPaso('/grupos', { grupos: true, servir: false }), '/grupos');
    assert.equal(destinoPaso('/grupos', { grupos: false, servir: false }), '/contacto#mensaje');
    assert.equal(destinoPaso('/servir', { grupos: false, servir: true }), '/servir');
    assert.equal(destinoPaso('/servir', { grupos: true, servir: false }), '/contacto#mensaje');
  });

  it('todos los pasos de la ruta tienen un destino conocido', () => {
    for (const paso of RUTA_CRECER) {
      const destino = destinoPaso(paso.href, { grupos: false, servir: false }, true);
      assert.ok(destino.startsWith('#') || destino === '/contacto#mensaje', paso.titulo);
    }
  });
});
