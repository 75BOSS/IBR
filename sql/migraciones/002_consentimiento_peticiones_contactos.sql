-- Consentimiento en peticiones y contactos (CLAUDE.md: acepta_datos se guarda con fecha e IP).
-- La fecha es creado_en y la IP es la columna ip de la misma fila, como en solicitudes_grupo.
-- En peticiones puede ser 0: una petición anónima no guarda datos personales.
ALTER TABLE peticiones ADD COLUMN acepta_datos TINYINT(1) NOT NULL DEFAULT 0 AFTER es_privada;
ALTER TABLE contactos  ADD COLUMN acepta_datos TINYINT(1) NOT NULL DEFAULT 0 AFTER mensaje;
