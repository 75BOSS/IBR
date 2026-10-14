import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DISENOS, destinoDiseno, ubicarDiseno } from './registro';

const porSlug = (slug: string) => {
  const d = DISENOS.find((x) => x.slug === slug);
  assert.ok(d, `falta el diseño ${slug}`);
  return d;
};

test('ubicarDiseno reconoce la página de cada propuesta y el sitio original', () => {
  assert.deepEqual(
    [ubicarDiseno('/').diseno.slug, ubicarDiseno('/').pagina],
    ['original', 'inicio'],
  );
  assert.equal(ubicarDiseno('/soy-nuevo').pagina, 'primera-visita');
  const comunidad = ubicarDiseno('/disenos/calida/comunidad/');
  assert.deepEqual([comunidad.diseno.slug, comunidad.pagina], ['calida', 'comunidad']);
  // Una ruta interna de una propuesta que no es una de sus páginas: el diseño, sin página.
  const otra = ubicarDiseno('/disenos/poster/algo');
  assert.deepEqual([otra.diseno.slug, otra.pagina], ['poster', null]);
  // Cualquier otra página del sitio es del diseño original.
  assert.deepEqual(
    [ubicarDiseno('/eventos').diseno.slug, ubicarDiseno('/eventos').pagina],
    ['original', null],
  );
});

test('destinoDiseno lleva a la misma página o, si no la tiene, al inicio', () => {
  assert.equal(destinoDiseno(porSlug('vibrante'), 'comunidad'), '/disenos/vibrante/comunidad');
  assert.equal(destinoDiseno(porSlug('escenario'), 'comunidad'), '/disenos/escenario/comunidad');
  assert.equal(destinoDiseno(porSlug('original'), 'crecer'), '/servir');
  assert.equal(destinoDiseno(porSlug('original'), 'primera-visita'), '/soy-nuevo');
  assert.equal(destinoDiseno(porSlug('vibrante'), null), '/disenos/vibrante');
});

test('cada propuesta tiene su inicio bajo /disenos/<slug> y slugs únicos', () => {
  const slugs = DISENOS.map((d) => d.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const d of DISENOS.filter((x) => x.slug !== 'original')) {
    assert.equal(d.paginas.inicio, `/disenos/${d.slug}`);
    for (const href of Object.values(d.paginas)) assert.ok(href.startsWith(`/disenos/${d.slug}`));
  }
});

test('todas las propuestas tienen las mismas páginas que el original', () => {
  const paginas = Object.keys(porSlug('original').paginas).sort();
  for (const d of DISENOS) assert.deepEqual(Object.keys(d.paginas).sort(), paginas, d.slug);
});
