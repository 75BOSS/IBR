import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { safeMapsEmbedUrl } from '@/lib/maps';
import { safeAdminPath } from '@/lib/validators/auth';
import { whatsappHref } from '@/lib/whatsapp';
import { parseYouTubeId } from '@/lib/youtube';

describe('parseYouTubeId', () => {
  const id = 'dQw4w9WgXcQ';
  for (const input of [
    `https://www.youtube.com/watch?v=${id}&t=10s`,
    `https://youtu.be/${id}?si=abc`,
    `youtube.com/shorts/${id}`,
    `https://m.youtube.com/watch?v=${id}`,
    `https://www.youtube.com/live/${id}?feature=share`,
    `https://www.youtube.com/embed/${id}`,
    id,
  ]) {
    it(`extrae el ID de ${input}`, () => assert.equal(parseYouTubeId(input), id));
  }
  for (const input of [
    'https://www.youtube.com/@ibr-riobamba',
    `https://evil.com/watch?v=${id}`,
    'hola',
  ]) {
    it(`rechaza ${input}`, () => assert.equal(parseYouTubeId(input), null));
  }
});

describe('safeMapsEmbedUrl', () => {
  it('acepta el src de Google Maps', () =>
    assert.ok(safeMapsEmbedUrl('https://www.google.com/maps/embed?pb=!1m18')));
  it('acepta el <iframe> completo', () =>
    assert.ok(
      safeMapsEmbedUrl('<iframe src="https://www.google.com/maps/embed?pb=!1m18"></iframe>'),
    ));
  for (const bad of [
    'https://evil.com/maps/embed?pb=x',
    'https://www.google.com.evil.com/maps/embed',
    'http://www.google.com/maps/embed?pb=x',
    'javascript:alert(1)',
    'https://www.google.com/search?q=x',
  ]) {
    it(`rechaza ${bad}`, () => assert.equal(safeMapsEmbedUrl(bad), null));
  }
});

describe('whatsappHref', () => {
  it('usa el formato internacional', () =>
    assert.equal(whatsappHref('593991234567'), 'https://wa.me/593991234567'));
  it('convierte 09XXXXXXXX a +593', () =>
    assert.equal(whatsappHref('0991234567'), 'https://wa.me/593991234567'));
  it('limpia espacios y +', () =>
    assert.equal(whatsappHref('+593 99 123 4567'), 'https://wa.me/593991234567'));
  it('agrega el mensaje', () =>
    assert.equal(
      whatsappHref('593991234567', 'Hola IBR'),
      'https://wa.me/593991234567?text=Hola+IBR',
    ));
  it('sin número usable devuelve null', () => {
    assert.equal(whatsappHref(''), null);
    assert.equal(whatsappHref('123'), null);
    assert.equal(whatsappHref(null), null);
  });
});

describe('safeAdminPath (evita redirecciones abiertas)', () => {
  const cases: [unknown, string][] = [
    ['/admin/grupos?x=1', '/admin/grupos?x=1'],
    ['/admin', '/admin'],
    ['https://evil.com', '/admin'],
    ['//evil.com', '/admin'],
    ['/administrador', '/admin'],
    ['/admin/login', '/admin'],
    ['/admin/..//evil.com', '/admin'],
    ['/admin\\evil', '/admin'],
    [undefined, '/admin'],
  ];
  for (const [input, expected] of cases) {
    it(`${String(input)} → ${expected}`, () => assert.equal(safeAdminPath(input), expected));
  }
});
