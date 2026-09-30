-- F3: códigos de un solo uso para que un miembro entre a /mi-cuenta con su WhatsApp.
-- Se guarda solo el HMAC del código (nunca el código), vence a los 10 minutos y admite 5
-- intentos. La sesión del miembro es una cookie aparte de la del panel.
CREATE TABLE codigos_acceso (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  telefono    VARCHAR(20)  NOT NULL,
  codigo_hash CHAR(64)     NOT NULL,
  expira_en   DATETIME     NOT NULL,
  intentos    TINYINT UNSIGNED NOT NULL DEFAULT 0,
  usado       TINYINT(1)   NOT NULL DEFAULT 0,
  ip          VARBINARY(16) NULL,
  creado_en   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_codigo_tel (telefono, creado_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
