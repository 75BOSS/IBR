-- F2: /servir. Áreas donde se puede servir (alabanza, niños, bienvenida…) y las personas que
-- se ofrecen como voluntarias. Un área con voluntarios no se borra (RESTRICT): se desactiva.
-- Consentimiento de voluntarios: acepta_datos con la fecha de creado_en y la IP de la fila.
CREATE TABLE areas_servicio (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(120) NOT NULL,
  slug           VARCHAR(140) NOT NULL,
  descripcion    TEXT         NULL,
  responsable_id INT UNSIGNED NULL,
  imagen_url     VARCHAR(500) NULL,
  imagen_public_id VARCHAR(200) NULL,
  activo         TINYINT(1)   NOT NULL DEFAULT 1,
  orden          SMALLINT     NOT NULL DEFAULT 0,
  UNIQUE KEY uq_area_slug (slug),
  CONSTRAINT fk_area_resp FOREIGN KEY (responsable_id) REFERENCES equipo(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE voluntarios (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  area_id        INT UNSIGNED NOT NULL,
  registro_id    INT UNSIGNED NULL,
  nombre         VARCHAR(120) NOT NULL,
  telefono       VARCHAR(20)  NOT NULL,
  email          VARCHAR(190) NULL,
  disponibilidad VARCHAR(255) NULL,
  mensaje        VARCHAR(1000) NULL,
  estado         ENUM('nuevo','contactado','sirviendo','no_continua') NOT NULL DEFAULT 'nuevo',
  notas          VARCHAR(1000) NULL,
  acepta_datos   TINYINT(1)   NOT NULL DEFAULT 0,
  ip             VARBINARY(16) NULL,
  creado_en      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_vol_estado (estado, creado_en),
  CONSTRAINT fk_vol_area     FOREIGN KEY (area_id)     REFERENCES areas_servicio(id) ON DELETE RESTRICT,
  CONSTRAINT fk_vol_registro FOREIGN KEY (registro_id) REFERENCES registros(id)      ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
