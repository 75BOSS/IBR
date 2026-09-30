import assert from 'node:assert/strict';
import { test } from 'node:test';
import { newInscripcionCode, normalizeCode } from '@/lib/inscripcion-code';

test('código: 8 caracteres del alfabeto sin confusiones', () => {
  for (let i = 0; i < 200; i++) assert.match(newInscripcionCode(), /^[A-HJ-NP-Z2-9]{8}$/);
});

test('normaliza lo escrito y rechaza lo que no puede ser un código', () => {
  assert.equal(normalizeCode('ab3d-ef7h'), 'AB3DEF7H');
  assert.equal(normalizeCode(' AB3D EF7H '), 'AB3DEF7H');
  assert.equal(normalizeCode('AB3DEF7'), null);
  assert.equal(normalizeCode('AB3DEF70'), null); // 0 no está en el alfabeto
  assert.equal(normalizeCode("' OR 1=1"), null);
});
