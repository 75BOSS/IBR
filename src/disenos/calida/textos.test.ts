import assert from 'node:assert/strict';
import { test } from 'node:test';
import { destinoPaso, diaPrincipal, listaNatural, menuCalida } from './textos';

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

const SIN_NADA = { creencias: false, equipo: false, servir: false, eventos: false, dar: false };

test('menuCalida arma los cuatro grupos y solo enlaza lo que existe', () => {
  const vacio = menuCalida({ content: SIN_NADA, ministerios: [] });
  assert.deepEqual(
    vacio.grupos.map((g) => g.titulo),
    ['Conócenos', 'Siguiente paso', 'Comunidad', 'Recursos'],
  );
  const hrefs = (m: ReturnType<typeof menuCalida>) =>
    m.grupos.flatMap((g) => g.items.map((i) => i.href));
  // Sin creencias, equipo, servir, eventos ni dar: ninguna ancla ni página vacía.
  for (const h of ['#creemos', '#equipo', '/servir', '/eventos', '#kids', '#jovenes']) {
    assert.equal(
      hrefs(vacio).some((x) => x.endsWith(h)),
      false,
      h,
    );
  }
  assert.deepEqual(
    vacio.sueltos.map((s) => s.href),
    ['/oracion'],
  );
  assert.equal(vacio.visita.href, '/disenos/calida/primera-visita');

  const lleno = menuCalida({
    content: { creencias: true, equipo: true, servir: true, eventos: true, dar: true },
    ministerios: [
      { slug: 'kids', nombre: 'Kids', nombre_ministerio: null },
      { slug: 'jovenes', nombre: 'Jóvenes', nombre_ministerio: 'Generación' },
    ],
  });
  for (const h of [
    '/disenos/calida/conocenos#creemos',
    '/disenos/calida/conocenos#equipo',
    '/disenos/calida/ministerios#kids',
    '/disenos/calida/ministerios#jovenes',
    '/servir',
    '/eventos',
  ]) {
    assert.ok(hrefs(lleno).includes(h), h);
  }
  // El nombre propio del ministerio manda sobre el rango de edad.
  assert.ok(lleno.grupos[2]?.items.some((i) => i.label === 'Generación'));
  assert.deepEqual(
    lleno.sueltos.map((s) => s.href),
    ['/oracion', '/dar'],
  );
});

test('destinoPaso: anclas de Crecer y páginas solo si tienen contenido', () => {
  const con = { grupos: true, servir: true };
  const sin = { grupos: false, servir: false };
  assert.equal(destinoPaso('#bautismo', con, true), '#bautismo');
  assert.equal(destinoPaso('#bautismo', con, false), '/disenos/calida/crecer#bautismo');
  assert.equal(destinoPaso('/grupos', con, true), '/grupos');
  assert.equal(destinoPaso('/grupos', sin, true), '/contacto#mensaje');
  assert.equal(destinoPaso('/servir', sin, false), '/contacto#mensaje');
});
