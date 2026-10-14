import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { SiteContent } from '@/lib/nav';
import { RUTAS, esPaginaActual, menuVibrante } from './menu';
import { destinoPaso } from './secciones/destinoPaso';

const VACIO: SiteContent = {
  reuniones: false,
  horarios: false,
  grupos: false,
  eventos: false,
  servir: false,
  predicas: false,
  ministerios: false,
  equipo: false,
  pastores: false,
  creencias: false,
  dar: false,
  agenda: false,
  cuenta: false,
};

const hrefs = (menu: ReturnType<typeof menuVibrante>) => [
  ...menu.grupos.flatMap((g) => g.items.map((i) => i.href)),
  ...menu.sueltos.map((i) => i.href),
];

test('menuVibrante sin contenido no enlaza páginas vacías ni anclas que no existen', () => {
  const todos = hrefs(menuVibrante({ content: VACIO, ministerios: [] }));
  for (const vacio of ['/servir', '/eventos', '/dar']) assert.ok(!todos.includes(vacio), vacio);
  for (const ancla of ['#creemos', '#equipo', '#kids', '#jovenes']) {
    assert.ok(!todos.some((h) => h.endsWith(ancla)), ancla);
  }
  // Lo que es de la propuesta siempre está: sus páginas y sus secciones fijas.
  assert.ok(todos.includes(RUTAS.primeraVisita));
  assert.ok(todos.includes(`${RUTAS.crecer}#bautismo`));
  assert.ok(todos.includes(`${RUTAS.ministerios}#mujeres`));
  assert.ok(todos.includes('/oracion'));
});

test('menuVibrante agrega Kids, Jóvenes, Servir, Eventos y Dar cuando existen', () => {
  const menu = menuVibrante({
    content: { ...VACIO, servir: true, eventos: true, dar: true, creencias: true, equipo: true },
    ministerios: [
      { slug: 'kids', nombre: 'Kids' },
      { slug: 'jovenes', nombre: 'Jóvenes' },
      { slug: 'adultos', nombre: 'Adultos' },
    ],
  });
  const todos = hrefs(menu);
  for (const h of ['/servir', '/eventos', '/dar', `${RUTAS.ministerios}#kids`]) {
    assert.ok(todos.includes(h), h);
  }
  assert.ok(todos.includes(`${RUTAS.conocenos}#creemos`));
  assert.ok(!todos.includes(`${RUTAS.ministerios}#adultos`), 'solo Kids y Jóvenes van al menú');
  assert.deepEqual(
    menu.grupos.map((g) => g.titulo),
    ['Conócenos', 'Siguiente paso', 'Comunidad', 'Recursos'],
  );
});

test('esPaginaActual compara la ruta exacta y nunca marca un ancla', () => {
  assert.equal(esPaginaActual('/disenos/vibrante/crecer', RUTAS.crecer), true);
  assert.equal(esPaginaActual('/disenos/vibrante/crecer/', RUTAS.crecer), true);
  assert.equal(esPaginaActual('/disenos/vibrante/crecer', `${RUTAS.crecer}#bautismo`), false);
  assert.equal(esPaginaActual('/disenos/vibrante/crecer', RUTAS.inicio), false);
});

test('destinoPaso: anclas de Crecer y páginas del sitio solo con contenido', () => {
  assert.equal(destinoPaso('#salvacion', { pagina: '', content: VACIO }), '#salvacion');
  assert.equal(
    destinoPaso('#bautismo', { pagina: RUTAS.crecer, content: VACIO }),
    `${RUTAS.crecer}#bautismo`,
  );
  assert.equal(destinoPaso('/grupos', { pagina: '', content: VACIO }), '/contacto#mensaje');
  assert.equal(
    destinoPaso('/grupos', { pagina: '', content: { ...VACIO, grupos: true } }),
    '/grupos',
  );
  assert.equal(destinoPaso('/servir', { pagina: '', content: VACIO }), '/contacto#mensaje');
});
