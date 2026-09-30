import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { rateLimitIp } from '@/lib/ip';
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
    `Https://youtu.be/${id}`,
    `HTTPS://WWW.YOUTUBE.COM/watch?v=${id}`,
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
  it('quita el 0 sobrante tras +593', () =>
    assert.equal(whatsappHref('+593 0991234567'), 'https://wa.me/593991234567'));
  it('acepta el prefijo internacional 00', () =>
    assert.equal(whatsappHref('00593991234567'), 'https://wa.me/593991234567'));
  it('acepta un fijo con código de provincia', () =>
    assert.equal(whatsappHref('03 212 3456'), 'https://wa.me/59332123456'));
  it('rechaza números que no son de Ecuador', () =>
    assert.equal(whatsappHref('+1 555 123 4567'), null));
  it('rechaza un celular con un dígito de menos', () =>
    assert.equal(whatsappHref('099123456'), null));
  it('rechaza un fijo con un dígito de más', () => assert.equal(whatsappHref('0221234567'), null));
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

describe('rateLimitIp (clave del límite por IP)', () => {
  it('IPv4 va tal cual', () => assert.equal(rateLimitIp('190.152.1.10'), '190.152.1.10'));
  it('IPv4 mapeada en IPv6 se trata como IPv4', () =>
    assert.equal(rateLimitIp('::ffff:190.152.1.10'), '190.152.1.10'));
  it('IPv6 se agrupa por /64', () =>
    assert.equal(rateLimitIp('2800:bf0:1:2:aaaa:bbbb:cccc:dddd'), '2800:0bf0:0001:0002::/64'));
  it('IPv6 comprimida da el mismo bloque', () =>
    assert.equal(rateLimitIp('2800:bf0:1:2::5'), '2800:0bf0:0001:0002::/64'));
  it('IPv6 corta con :: al inicio del bloque', () =>
    assert.equal(rateLimitIp('2800::1'), '2800:0000:0000:0000::/64'));
});
