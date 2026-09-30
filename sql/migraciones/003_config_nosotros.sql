-- F2: textos de la página «Nosotros», editables en /admin/config (sección Nosotros).
INSERT IGNORE INTO config (clave, valor, tipo, grupo, orden) VALUES
('nosotros_historia',  NULL, 'textarea', 'nosotros', 1),
('nosotros_mision',    NULL, 'textarea', 'nosotros', 2),
('nosotros_creencias', NULL, 'textarea', 'nosotros', 3),
('nosotros_imagen',    NULL, 'url',      'nosotros', 4);
