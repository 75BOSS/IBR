-- F2: suscripción a la agenda semanal por correo (doble confirmación) y registro de envíos.
-- `token` es la llave personal para confirmar o darse de baja (va en cada correo); activo = 1
-- solo después de confirmar. Consentimiento: acepta_datos con la fecha de creado_en y la IP.
CREATE TABLE suscriptores (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(190) NOT NULL,
  nombre        VARCHAR(120) NULL,
  token         CHAR(43)     NOT NULL,
  activo        TINYINT(1)   NOT NULL DEFAULT 0,
  confirmado_en DATETIME     NULL,
  baja_en       DATETIME     NULL,
  acepta_datos  TINYINT(1)   NOT NULL DEFAULT 0,
  ip            VARBINARY(16) NULL,
  creado_en     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_susc_email (email),
  UNIQUE KEY uq_susc_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE envios_agenda (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  asunto      VARCHAR(200) NOT NULL,
  enviados    INT UNSIGNED NOT NULL DEFAULT 0,
  fallidos    INT UNSIGNED NOT NULL DEFAULT 0,
  enviado_por INT UNSIGNED NULL,
  creado_en   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_envio_user FOREIGN KEY (enviado_por) REFERENCES usuarios_admin(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
