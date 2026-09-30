import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { z } from 'zod';
import {
  checkbox,
  hora,
  optionalPhone,
  optionalText,
  optionalUrl,
  requiredPhone,
} from '@/lib/validators/common';

describe('validadores comunes', () => {
  it('teléfono celular en formato local', () =>
    assert.equal(requiredPhone.parse('+593 99 123 4567'), '0991234567'));
  it('teléfono fijo', () => assert.equal(requiredPhone.parse('03 212 3456'), '032123456'));
  it('teléfono inválido explica el formato', () => {
    const r = requiredPhone.safeParse('12345');
    assert.equal(r.success, false);
    assert.match(r.error!.issues[0]!.message, /ej\. 0991234567/);
  });
  it('teléfono opcional vacío → null', () => assert.equal(optionalPhone.parse(''), null));
  it('texto opcional vacío → null', () => assert.equal(optionalText(10).parse('   '), null));
  it('casilla', () => {
    assert.equal(checkbox.parse('1'), true);
    assert.equal(checkbox.parse(null), false);
  });
  it('hora 24 h', () => {
    assert.equal(hora.safeParse('19:30').success, true);
    assert.equal(hora.safeParse('7:30 pm').success, false);
  });
  it('url solo http(s)', () => {
    assert.equal(optionalUrl.parse('https://instagram.com/ibr'), 'https://instagram.com/ibr');
    assert.equal(optionalUrl.safeParse('javascript:alert(1)').success, false);
    assert.equal(z.object({ u: optionalUrl }).parse({ u: '' }).u, null);
  });
});
