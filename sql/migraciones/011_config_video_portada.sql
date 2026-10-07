-- Rediseño: video corto opcional en la portada del inicio (se edita en /admin/config).
INSERT IGNORE INTO config (clave, valor, tipo, grupo, orden) VALUES
('home_hero_video', NULL, 'url', 'home', 4);
