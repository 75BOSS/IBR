-- F2: inscripciones a eventos (eventos.requiere_inscripcion y eventos.cupo ya existen en
-- ESQUEMA.sql). `personas` cuenta cuántos lugares ocupa (una familia se inscribe junta) y el
-- cupo se descuenta con SUM(personas) de las confirmadas y asistidas. `codigo` identifica la
-- inscripción ante la persona (ver o cancelar) y sirve para el check-in.
-- Consentimiento: acepta_datos con la fecha de creado_en y la IP de la fila.
CREATE TABLE inscripciones (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  evento_id   INT UNSIGNED NOT NULL,
  registro_id INT UNSIGNED NULL,
  nombre      VARCHAR(120) NOT NULL,
  telefono    VARCHAR(20)  NOT NULL,
  email       VARCHAR(190) NULL,
  personas    TINYINT UNSIGNED NOT NULL DEFAULT 1,
  codigo      CHAR(8)      NOT NULL,
  estado      ENUM('confirmada','cancelada','asistio') NOT NULL DEFAULT 'confirmada',
  acepta_datos TINYINT(1)  NOT NULL DEFAULT 0,
  ip          VARBINARY(16) NULL,
  creado_en   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_insc_codigo (codigo),
  KEY idx_insc_evento (evento_id, estado),
  CONSTRAINT fk_insc_evento   FOREIGN KEY (evento_id)   REFERENCES eventos(id)   ON DELETE CASCADE,
  CONSTRAINT fk_insc_registro FOREIGN KEY (registro_id) REFERENCES registros(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
