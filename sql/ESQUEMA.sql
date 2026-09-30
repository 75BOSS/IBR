-- ============================================================================
-- ESQUEMA.sql — Web IBR (Iglesia Bíblica Riobamba)
-- MySQL 8 / MariaDB 10.6+ (Hostinger). utf8mb4. Fechas en UTC.
-- Versión: 0.1 (2026-09-03) — F0/F1. Las tablas F2/F3 van en sql/migraciones/.
--
-- IMPORTANTE: la sección "TABLAS HEREDADAS" es una PROPUESTA de estructura
-- destino. Antes de aplicarla hay que reconciliarla con el dump real del
-- sistema PHP (ver MIGRACION-PHP.md §1). Los nombres de columnas del PHP
-- pueden diferir; se mapean en la importación, no se fuerza el PHP a cambiar.
-- ============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ----------------------------------------------------------------------------
-- 0. ADMIN Y SEGURIDAD
-- ----------------------------------------------------------------------------

CREATE TABLE usuarios_admin (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(120)  NOT NULL,
  email         VARCHAR(190)  NOT NULL UNIQUE,
  password_hash VARCHAR(100)  NOT NULL,                 -- bcryptjs cost 12
  rol           ENUM('admin','editor') NOT NULL DEFAULT 'editor',
  activo        TINYINT(1)    NOT NULL DEFAULT 1,
  ultimo_login  DATETIME      NULL,
  creado_en     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Límite de envíos de formularios públicos: 5 por IP por formulario cada 10 min.
-- También limita intentos de login por IP y por cuenta (src/lib/rate-limit.ts).
CREATE TABLE rate_limits (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ip         VARBINARY(16) NOT NULL,                    -- clave: 16 primeros bytes de SHA-256("ip:<ip>" o "cuenta:<email>"); no se guarda la IP en claro
  formulario VARCHAR(40)   NOT NULL,                    -- 'soy_nuevo','oracion','contacto','unirme_grupo','login_ip','login_cuenta'
  creado_en  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_rl (ip, formulario, creado_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- Limpieza: DELETE FROM rate_limits WHERE creado_en < NOW() - INTERVAL 1 DAY (job diario o al insertar).

-- Configuración clave/valor editable desde /admin/config.
CREATE TABLE config (
  clave  VARCHAR(60)  PRIMARY KEY,
  valor  TEXT         NULL,
  tipo   ENUM('texto','textarea','url','bool','json') NOT NULL DEFAULT 'texto',
  grupo  VARCHAR(40)  NOT NULL DEFAULT 'general',       -- 'general','contacto','redes','dar','home','en_vivo'
  orden  SMALLINT     NOT NULL DEFAULT 0,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO config (clave, valor, tipo, grupo, orden) VALUES
('nombre_iglesia',      'Iglesia Bíblica Riobamba',   'texto',    'general',  1),
('nombre_corto',        'IBR',                        'texto',    'general',  2),
('vision',              'Hacer discípulos y dar la vida por nuestros amigos', 'textarea', 'general', 3),
('anio_fundacion',      '2008',                       'texto',    'general',  4),   -- 18 años a 2026; confirmar
('direccion',           NULL,                         'textarea', 'contacto', 1),
('referencia_llegada',  NULL,                         'textarea', 'contacto', 2),
('maps_embed_url',      NULL,                         'url',      'contacto', 3),
('telefono',            NULL,                         'texto',    'contacto', 4),
('whatsapp',            NULL,                         'texto',    'contacto', 5),   -- 5939XXXXXXXX sin +
('whatsapp_canal_url',  NULL,                         'url',      'contacto', 6),
('email',               NULL,                         'texto',    'contacto', 7),
('email_avisos',        NULL,                         'texto',    'contacto', 8),   -- recibe registros/peticiones
('instagram',           'https://instagram.com/ibr_riobamba',      'url', 'redes', 1),
('tiktok',              'https://tiktok.com/@ibr_riobamba',        'url', 'redes', 2),
('youtube',             'https://youtube.com/@ibr-riobamba',       'url', 'redes', 3),
('facebook',            NULL,                         'url',      'redes',    4),
('youtube_channel_id',  NULL,                         'texto',    'en_vivo',  1),   -- UC... para embed live
('en_vivo_activo',      '0',                          'bool',     'en_vivo',  2),
('dar_intro',           NULL,                         'textarea', 'dar',      1),
('dar_cuentas',         '[]',                         'json',     'dar',      2),   -- [{banco,tipo,numero,titular,ruc_ci}]
('dar_qr_url',          NULL,                         'url',      'dar',      3),
('home_hero_titulo',    'Bienvenido a casa',          'texto',    'home',     1),
('home_hero_sub',       NULL,                         'textarea', 'home',     2),
('home_hero_imagen',    NULL,                         'url',      'home',     3);

-- ----------------------------------------------------------------------------
-- 1. TABLAS HEREDADAS DEL SISTEMA PHP (estructura destino propuesta)
--    Reconciliar con el dump real antes de aplicar. Ver MIGRACION-PHP.md.
-- ----------------------------------------------------------------------------

CREATE TABLE rangos_edad (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(80)  NOT NULL,                    -- 'Kids','Adolescentes','Jóvenes','Adultos','Adultos mayores'
  slug        VARCHAR(80)  NOT NULL UNIQUE,
  edad_min    TINYINT UNSIGNED NULL,
  edad_max    TINYINT UNSIGNED NULL,
  nombre_ministerio VARCHAR(80) NULL,                   -- identidad propia si la tienen (ej. 'Get Up')
  descripcion TEXT         NULL,
  color       CHAR(7)      NULL,                        -- '#0E5E6F'
  imagen_url  VARCHAR(500) NULL,
  orden       SMALLINT     NOT NULL DEFAULT 0,
  activo      TINYINT(1)   NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ubicaciones (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL,                    -- 'Auditorio principal','Casa fam. Pérez','En línea'
  tipo        ENUM('sede','casa','en_linea','otro') NOT NULL DEFAULT 'casa',
  direccion   VARCHAR(255) NULL,
  referencia  VARCHAR(255) NULL,
  zona        VARCHAR(80)  NULL,                        -- barrio/sector para filtrar grupos
  lat         DECIMAL(9,6) NULL,
  lng         DECIMAL(9,6) NULL,
  maps_url    VARCHAR(500) NULL,
  publica     TINYINT(1)   NOT NULL DEFAULT 0,          -- 0 = dirección exacta no se muestra (casas)
  activo      TINYINT(1)   NOT NULL DEFAULT 1,
  KEY idx_zona (zona)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE grupos (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(120) NOT NULL,
  descripcion   TEXT         NULL,
  tipo          VARCHAR(60)  NULL,                      -- 'crecimiento','matrimonios','oración','estudio','jóvenes'...
  rango_edad_id INT UNSIGNED NULL,
  ubicacion_id  INT UNSIGNED NULL,
  dia_semana    TINYINT      NULL,                      -- 1=lunes ... 7=domingo
  hora          TIME         NULL,
  frecuencia    ENUM('semanal','quincenal','mensual') NOT NULL DEFAULT 'semanal',
  lider_nombre  VARCHAR(120) NULL,
  lider_telefono VARCHAR(20) NULL,                      -- solo admin
  lider_email   VARCHAR(190) NULL,                      -- recibe avisos de solicitudes
  cupo          SMALLINT UNSIGNED NULL,
  imagen_url    VARCHAR(500) NULL,
  publico       TINYINT(1)   NOT NULL DEFAULT 1,        -- aparece en /grupos
  activo        TINYINT(1)   NOT NULL DEFAULT 1,
  creado_en     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_grupos_rango FOREIGN KEY (rango_edad_id) REFERENCES rangos_edad(id) ON DELETE SET NULL,
  CONSTRAINT fk_grupos_ubic  FOREIGN KEY (ubicacion_id)  REFERENCES ubicaciones(id) ON DELETE SET NULL,
  KEY idx_grupos_filtro (publico, activo, rango_edad_id, dia_semana)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Personas que se registran (Soy nuevo, presencial, redes). Una fila por persona.
CREATE TABLE registros (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombres        VARCHAR(120) NOT NULL,
  apellidos      VARCHAR(120) NULL,
  telefono       VARCHAR(20)  NULL,
  email          VARCHAR(190) NULL,
  fecha_nacimiento DATE       NULL,
  rango_edad_id  INT UNSIGNED NULL,
  sector         VARCHAR(80)  NULL,                     -- barrio/zona donde vive
  origen         ENUM('web','presencial','redes','evento','otro') NOT NULL DEFAULT 'presencial',
  como_llego     VARCHAR(60)  NULL,                     -- 'amigo','redes','youtube','pasaba','otro'
  situacion      ENUM('primera_visita','decidio_seguir','rededicacion','quiere_membresia','otro') NULL,
  peticion       TEXT         NULL,
  acepta_datos   TINYINT(1)   NOT NULL DEFAULT 0,
  acepta_datos_en DATETIME    NULL,
  acepta_datos_ip VARBINARY(16) NULL,
  estado         ENUM('nuevo','contactado','integrado','sin_respuesta') NOT NULL DEFAULT 'nuevo',
  notas_admin    TEXT         NULL,
  grupo_id       INT UNSIGNED NULL,                     -- grupo al que finalmente se integró
  creado_en      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reg_rango FOREIGN KEY (rango_edad_id) REFERENCES rangos_edad(id) ON DELETE SET NULL,
  CONSTRAINT fk_reg_grupo FOREIGN KEY (grupo_id)      REFERENCES grupos(id)      ON DELETE SET NULL,
  KEY idx_reg_estado (estado, creado_en),
  KEY idx_reg_tel (telefono)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. TABLAS NUEVAS — F1
-- ----------------------------------------------------------------------------

-- Horarios fijos de reunión (culto, oración, jóvenes, kids...).
CREATE TABLE reuniones (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(120) NOT NULL,                  -- 'Culto dominical','Reunión de oración'
  descripcion   VARCHAR(255) NULL,
  dia_semana    TINYINT      NOT NULL,                  -- 1..7
  hora_inicio   TIME         NOT NULL,
  hora_fin      TIME         NULL,
  ubicacion_id  INT UNSIGNED NULL,
  rango_edad_id INT UNSIGNED NULL,                      -- NULL = todos
  en_linea      TINYINT(1)   NOT NULL DEFAULT 0,        -- se transmite
  orden         SMALLINT     NOT NULL DEFAULT 0,
  activo        TINYINT(1)   NOT NULL DEFAULT 1,
  CONSTRAINT fk_reu_ubic  FOREIGN KEY (ubicacion_id)  REFERENCES ubicaciones(id) ON DELETE SET NULL,
  CONSTRAINT fk_reu_rango FOREIGN KEY (rango_edad_id) REFERENCES rangos_edad(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE predicas (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo      VARCHAR(200) NOT NULL,
  slug        VARCHAR(220) NOT NULL UNIQUE,
  youtube_id  VARCHAR(20)  NOT NULL UNIQUE,
  serie       VARCHAR(120) NULL,
  predicador  VARCHAR(120) NULL,
  fecha       DATE         NOT NULL,
  descripcion TEXT         NULL,
  pasaje      VARCHAR(120) NULL,                        -- 'Juan 15:13'
  miniatura_url VARCHAR(500) NULL,                      -- de YouTube o Cloudinary
  duracion_seg INT UNSIGNED NULL,
  destacada   TINYINT(1)   NOT NULL DEFAULT 0,
  publicada   TINYINT(1)   NOT NULL DEFAULT 1,
  creado_en   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_pred_fecha (publicada, fecha),
  KEY idx_pred_serie (serie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE eventos (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(220) NOT NULL UNIQUE,
  titulo        VARCHAR(200) NOT NULL,
  resumen       VARCHAR(300) NULL,                      -- para tarjetas y OG
  cuerpo        MEDIUMTEXT   NULL,                      -- markdown
  categoria     ENUM('evento','noticia','oracion','comunidad','musica','capacitacion') NOT NULL DEFAULT 'evento',
  fecha_inicio  DATETIME     NOT NULL,
  fecha_fin     DATETIME     NULL,
  todo_el_dia   TINYINT(1)   NOT NULL DEFAULT 0,
  ubicacion_id  INT UNSIGNED NULL,
  rango_edad_id INT UNSIGNED NULL,
  imagen_url    VARCHAR(500) NULL,
  imagen_public_id VARCHAR(200) NULL,                   -- Cloudinary
  requiere_inscripcion TINYINT(1) NOT NULL DEFAULT 0,  -- F2
  cupo          SMALLINT UNSIGNED NULL,                 -- F2
  link_externo  VARCHAR(500) NULL,                      -- Zoom, formulario externo, etc.
  destacado     TINYINT(1)   NOT NULL DEFAULT 0,
  publicado     TINYINT(1)   NOT NULL DEFAULT 0,
  creado_por    INT UNSIGNED NULL,
  creado_en     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ev_ubic  FOREIGN KEY (ubicacion_id)  REFERENCES ubicaciones(id)   ON DELETE SET NULL,
  CONSTRAINT fk_ev_rango FOREIGN KEY (rango_edad_id) REFERENCES rangos_edad(id)   ON DELETE SET NULL,
  CONSTRAINT fk_ev_user  FOREIGN KEY (creado_por)    REFERENCES usuarios_admin(id) ON DELETE SET NULL,
  KEY idx_ev_pub_fecha (publicado, fecha_inicio),
  KEY idx_ev_cat (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE peticiones (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(120) NULL,                        -- puede ser anónima
  telefono    VARCHAR(20)  NULL,
  email       VARCHAR(190) NULL,
  texto       TEXT         NOT NULL,
  es_privada  TINYINT(1)   NOT NULL DEFAULT 1,          -- 1 = solo pastores
  atendida    TINYINT(1)   NOT NULL DEFAULT 0,
  atendida_por INT UNSIGNED NULL,
  atendida_en DATETIME     NULL,
  ip          VARBINARY(16) NULL,
  creado_en   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pet_user FOREIGN KEY (atendida_por) REFERENCES usuarios_admin(id) ON DELETE SET NULL,
  KEY idx_pet (atendida, creado_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE solicitudes_grupo (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  grupo_id    INT UNSIGNED NOT NULL,
  registro_id INT UNSIGNED NULL,                        -- si ya existe la persona
  nombre      VARCHAR(120) NOT NULL,
  telefono    VARCHAR(20)  NOT NULL,
  mensaje     VARCHAR(500) NULL,
  estado      ENUM('pendiente','contactado','integrado','rechazado') NOT NULL DEFAULT 'pendiente',
  notas       TEXT         NULL,
  acepta_datos TINYINT(1)  NOT NULL DEFAULT 0,
  ip          VARBINARY(16) NULL,
  creado_en   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sol_grupo FOREIGN KEY (grupo_id)    REFERENCES grupos(id)    ON DELETE CASCADE,
  CONSTRAINT fk_sol_reg   FOREIGN KEY (registro_id) REFERENCES registros(id) ON DELETE SET NULL,
  KEY idx_sol (estado, creado_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE equipo (
  id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(120) NOT NULL,
  rol       VARCHAR(120) NOT NULL,                      -- 'Pastor principal','Pastora','Líder de jóvenes'
  bio       TEXT         NULL,
  foto_url  VARCHAR(500) NULL,
  foto_public_id VARCHAR(200) NULL,
  es_pastor TINYINT(1)   NOT NULL DEFAULT 0,            -- aparece en home
  orden     SMALLINT     NOT NULL DEFAULT 0,
  visible   TINYINT(1)   NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE contactos (
  id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(120) NOT NULL,
  email     VARCHAR(190) NULL,
  telefono  VARCHAR(20)  NULL,
  mensaje   TEXT         NOT NULL,
  leido     TINYINT(1)   NOT NULL DEFAULT 0,
  ip        VARBINARY(16) NULL,
  creado_en DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. F2 (crear vía sql/migraciones/ cuando toque; aquí solo referencia)
-- ----------------------------------------------------------------------------
-- inscripciones   (id, evento_id FK, registro_id FK NULL, nombre, telefono, email, codigo CHAR(8) UNIQUE, estado ENUM('confirmada','cancelada','asistio'), creado_en)
-- areas_servicio  (id, nombre, slug, descripcion, responsable_id FK equipo NULL, imagen_url, activo, orden)
-- voluntarios     (id, area_id FK, registro_id FK NULL, nombre, telefono, email, disponibilidad, estado, creado_en)
-- suscriptores    (id, email UNIQUE, nombre, token_baja CHAR(36), activo, creado_en)
-- ministerios     -> se cubre con rangos_edad (nombre_ministerio, color, imagen_url). Crear tabla aparte solo si un ministerio no es por edad (ej. Mujeres, Matrimonios).

-- ----------------------------------------------------------------------------
-- 4. VISTAS ÚTILES
-- ----------------------------------------------------------------------------

CREATE OR REPLACE VIEW v_grupos_publicos AS
SELECT g.id, g.nombre, g.descripcion, g.tipo, g.dia_semana, g.hora, g.frecuencia,
       g.lider_nombre, g.imagen_url, g.cupo,
       r.nombre AS rango_edad, r.slug AS rango_slug, r.color AS rango_color,
       u.nombre AS ubicacion, u.zona, u.tipo AS ubicacion_tipo,
       CASE WHEN u.publica = 1 THEN u.direccion ELSE NULL END AS direccion,
       (SELECT COUNT(*) FROM solicitudes_grupo s WHERE s.grupo_id = g.id AND s.estado = 'integrado') AS integrados
FROM grupos g
LEFT JOIN rangos_edad r ON r.id = g.rango_edad_id
LEFT JOIN ubicaciones u ON u.id = g.ubicacion_id
WHERE g.publico = 1 AND g.activo = 1;

CREATE OR REPLACE VIEW v_dashboard AS
SELECT
  (SELECT COUNT(*) FROM registros WHERE creado_en >= NOW() - INTERVAL 7 DAY)      AS registros_semana,
  (SELECT COUNT(*) FROM registros WHERE estado = 'nuevo')                         AS registros_sin_contactar,
  (SELECT COUNT(*) FROM solicitudes_grupo WHERE estado = 'pendiente')             AS solicitudes_pendientes,
  (SELECT COUNT(*) FROM peticiones WHERE atendida = 0)                            AS peticiones_sin_atender,
  (SELECT COUNT(*) FROM contactos WHERE leido = 0)                                AS contactos_sin_leer,
  (SELECT COUNT(*) FROM eventos WHERE publicado = 1 AND fecha_inicio >= NOW())    AS eventos_proximos;

-- ----------------------------------------------------------------------------
-- 5. SEMILLA MÍNIMA (ajustar con datos reales de la iglesia)
-- ----------------------------------------------------------------------------

INSERT INTO rangos_edad (nombre, slug, edad_min, edad_max, orden) VALUES
('Kids',           'kids',           3,  11, 1),
('Adolescentes',   'adolescentes',  12,  17, 2),
('Jóvenes',        'jovenes',       18,  30, 3),
('Adultos',        'adultos',       31,  64, 4),
('Adultos mayores','adultos-mayores',65, NULL,5);

INSERT INTO ubicaciones (nombre, tipo, publica, activo) VALUES
('Auditorio principal', 'sede',     1, 1),
('En línea (YouTube)',  'en_linea', 1, 1);

-- Primer admin: se crea con scripts/seed-admin.ts (pide email y password, genera bcrypt). No poner hashes aquí.
