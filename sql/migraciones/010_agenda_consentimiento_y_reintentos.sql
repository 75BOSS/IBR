-- Correcciones de la revisión de F2 (agenda semanal):
-- · consentimiento_en: fecha del último «acepto» (volver a suscribirse renueva fecha e IP juntas).
-- · ultimo_envio_id + envios_agenda.cuerpo: saber a quién ya le llegó cada envío, para reintentar
--   solo con los que fallaron (con el mismo texto) sin repetir el correo a los demás.
ALTER TABLE suscriptores
  ADD COLUMN consentimiento_en DATETIME NULL AFTER acepta_datos,
  ADD COLUMN ultimo_envio_id INT UNSIGNED NULL AFTER baja_en;
UPDATE suscriptores SET consentimiento_en = creado_en WHERE acepta_datos = 1;
ALTER TABLE envios_agenda ADD COLUMN cuerpo TEXT NULL AFTER asunto;
