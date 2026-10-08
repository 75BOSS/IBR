import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  directionsUrl,
  isGoogleMapsLink,
  mapsEmbedFromLink,
  mapsPinFromLink,
  safeMapsEmbedUrl,
} from '@/lib/maps';

const PLACE =
  'https://www.google.com/maps/place/Iglesia+Biblica+Riobamba+-+IBR/@-1.6318006,-78.6858256,1032m/data=!3m1!1e3!4m6!3m5!1s0x91d30983a2640101:0xed25b4360cd1429e!8m2!3d-1.631806!4d-78.6832453!16s%2Fg%2F11fn0dhwl3';

test('el pin sale de !3d!4d (lugar exacto), no del centro de la vista', () => {
  assert.deepEqual(mapsPinFromLink(PLACE), {
    lat: -1.631806,
    lng: -78.6832453,
    name: 'Iglesia Biblica Riobamba - IBR',
  });
  assert.deepEqual(mapsPinFromLink('https://www.google.com/maps/@-1.67,-78.65,15z'), {
    lat: -1.67,
    lng: -78.65,
    name: null,
  });
  assert.equal(mapsPinFromLink('https://maps.app.goo.gl/jBLUAy5JLmgPKcsN9'), null);
  assert.equal(mapsPinFromLink('https://example.com/maps/@1,2'), null);
});

test('el mapa sin clave se arma desde el enlace y pasa la validación del iframe', () => {
  const embed = mapsEmbedFromLink(PLACE);
  assert.ok(embed);
  assert.equal(safeMapsEmbedUrl(embed), embed);
  assert.match(embed, /^https:\/\/www\.google\.com\/maps\/embed\?.*!1s-1\.631806,-78\.6832453!/);
  assert.equal(mapsEmbedFromLink(null), null);
});

test('solo se incrustan mapas de Google', () => {
  assert.ok(safeMapsEmbedUrl('<iframe src="https://www.google.com/maps/embed?pb=!1m18"></iframe>'));
  assert.equal(safeMapsEmbedUrl('https://www.google.com/maps?q=1,2'), null); // no es /maps/embed
  assert.equal(safeMapsEmbedUrl('https://evil.example/maps/embed'), null);
  assert.equal(safeMapsEmbedUrl('http://www.google.com/maps/embed?pb=1'), null);
});

test('«Cómo llegar» prefiere el enlace de Google Maps; si no hay, busca la dirección', () => {
  assert.equal(
    directionsUrl('https://maps.app.goo.gl/abc', 'Av. X'),
    'https://maps.app.goo.gl/abc',
  );
  assert.match(directionsUrl(null, 'Av. X y Calle Y') ?? '', /maps\/search\/\?api=1&query=Av/);
  assert.match(directionsUrl('https://example.com', 'Av. X') ?? '', /maps\/search/);
  assert.equal(directionsUrl(null, null), null);
  assert.equal(isGoogleMapsLink('https://maps.app.goo.gl/jBLUAy5JLmgPKcsN9'), true);
  assert.equal(isGoogleMapsLink('https://www.google.com/search?q=x'), false);
});
