-- F2: la foto de cada ministerio (rangos_edad.imagen_url) se sube a Cloudinary desde
-- /admin/ministerios; hace falta el public_id para borrar la anterior al reemplazarla.
ALTER TABLE rangos_edad ADD COLUMN imagen_public_id VARCHAR(200) NULL AFTER imagen_url;
