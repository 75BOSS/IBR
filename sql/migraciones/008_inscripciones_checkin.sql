-- F3: hora en que se registró la llegada (check-in por QR o código) de cada inscripción.
ALTER TABLE inscripciones ADD COLUMN checkin_en DATETIME NULL AFTER estado;
