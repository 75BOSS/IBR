-- F1: los grupos guardan el public_id de su foto en Cloudinary (como equipo y eventos) para
-- poder borrarla al reemplazarla o eliminar el grupo. ESQUEMA.sql lo había omitido.
ALTER TABLE grupos ADD COLUMN imagen_public_id VARCHAR(200) NULL AFTER imagen_url;
