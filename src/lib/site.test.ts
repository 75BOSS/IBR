import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isIndexable } from '@/lib/site';

test('solo el dominio de producción se deja indexar', () => {
  assert.equal(isIndexable('https://ibriglesia.com'), true);
  assert.equal(isIndexable('https://www.ibriglesia.com'), true);
  assert.equal(isIndexable('https://dev.ibriglesia.com'), false);
  assert.equal(isIndexable('https://ibr.pixelia.example'), false);
  assert.equal(isIndexable('http://localhost:3000'), false);
});
