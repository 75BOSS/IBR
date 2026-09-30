import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseCreencias } from '@/lib/config-fields';
import { paragraphs } from '@/lib/text';

test('creencias: título en la primera línea y texto debajo', () => {
  assert.deepEqual(
    parseCreencias(
      'La Biblia\nEs la Palabra de Dios.\n\nLa salvación\nEs por gracia\npor medio de la fe.',
    ),
    [
      { titulo: 'La Biblia', texto: 'Es la Palabra de Dios.' },
      { titulo: 'La salvación', texto: 'Es por gracia\npor medio de la fe.' },
    ],
  );
});

test('creencias: párrafo de una línea queda sin título; vacío da lista vacía', () => {
  assert.deepEqual(parseCreencias('Creemos en un solo Dios.'), [
    { titulo: null, texto: 'Creemos en un solo Dios.' },
  ]);
  assert.deepEqual(parseCreencias('  \n\n '), []);
  assert.deepEqual(parseCreencias(null), []);
});

test('párrafos con saltos de Windows y líneas en blanco con espacios', () => {
  assert.deepEqual(paragraphs('Uno\r\n\r\nDos\n   \nTres'), ['Uno', 'Dos', 'Tres']);
});
