import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fieldErrorsOf } from '@/lib/validators/common';
import { contactoSchema, peticionSchema } from '@/lib/validators/mensajes';
import { reunionSchema } from '@/lib/validators/reuniones';

const errors = (result: { success: boolean; error?: unknown }) =>
  result.success ? {} : fieldErrorsOf(result.error as Parameters<typeof fieldErrorsOf>[0]);

test('petición anónima no pide consentimiento', () => {
  const r = peticionSchema.safeParse({ texto: 'Por mi familia' });
  assert.equal(r.success, true);
  assert.equal(r.data?.es_privada, false);
});

test('petición con datos pide consentimiento, junto con los demás errores', () => {
  const e = errors(peticionSchema.safeParse({ texto: '', nombre: 'Ana' }));
  assert.ok(e.texto, 'falta el texto');
  assert.ok(e.acepta_datos, 'también avisa del consentimiento en el mismo envío');
});

test('contacto sin WhatsApp ni correo avisa junto con el consentimiento', () => {
  const e = errors(contactoSchema.safeParse({ nombre: 'Luis', mensaje: 'Hola' }));
  assert.ok(e.telefono);
  assert.ok(e.acepta_datos);
});

test('contacto válido normaliza el WhatsApp', () => {
  const r = contactoSchema.safeParse({
    nombre: 'Luis',
    telefono: '099 123 4567',
    mensaje: 'Hola',
    acepta_datos: '1',
  });
  assert.equal(r.success, true);
});

test('la regla entre horas se ve aunque otro campo falle', () => {
  const e = errors(
    reunionSchema.safeParse({
      nombre: '',
      dia_semana: '0',
      hora_inicio: '10:00',
      hora_fin: '09:00',
      orden: '0',
    }),
  );
  assert.ok(e.nombre);
  assert.ok(e.hora_fin);
});
