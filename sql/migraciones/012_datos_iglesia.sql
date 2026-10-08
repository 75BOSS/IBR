-- Datos reales de la iglesia entregados por Cristian (2026-10-08) y enlace de Google Maps para
-- «Cómo llegar» y el mapa. Solo se llenan campos vacíos o con el valor de ejemplo del esquema:
-- lo que ya se guardó desde /admin/config no se pisa.
-- YouTube: el canal @ibr-riobamba existe (Iglesia Biblica Riobamba); su ID habilita «En vivo».
-- La dirección escrita, el WhatsApp y el teléfono siguen pendientes (no están en Google Maps).

INSERT IGNORE INTO config (clave, valor, tipo, grupo, orden) VALUES
('maps_url', NULL, 'url', 'contacto', 3);

UPDATE config SET valor = 'https://www.google.com/maps/place/Iglesia+Biblica+Riobamba+-+IBR/@-1.6318006,-78.6858256,1032m/data=!3m1!1e3!4m6!3m5!1s0x91d30983a2640101:0xed25b4360cd1429e!8m2!3d-1.631806!4d-78.6832453!16s%2Fg%2F11fn0dhwl3'
 WHERE clave = 'maps_url' AND (valor IS NULL OR valor = '');

UPDATE config SET valor = 'iglesiabiblicariobamba@gmail.com'
 WHERE clave = 'email' AND (valor IS NULL OR valor = '');

UPDATE config SET valor = 'https://www.facebook.com/somosiglesiacristiana'
 WHERE clave = 'facebook' AND (valor IS NULL OR valor = '');

UPDATE config SET valor = 'https://www.instagram.com/ibr_riobamba/'
 WHERE clave = 'instagram' AND (valor IS NULL OR valor = '' OR valor = 'https://instagram.com/ibr_riobamba');

UPDATE config SET valor = 'https://www.tiktok.com/@ibr_riobamba'
 WHERE clave = 'tiktok' AND (valor IS NULL OR valor = '' OR valor = 'https://tiktok.com/@ibr_riobamba');

UPDATE config SET valor = 'https://www.youtube.com/@ibr-riobamba'
 WHERE clave = 'youtube' AND (valor IS NULL OR valor = '' OR valor = 'https://youtube.com/@ibr-riobamba');

UPDATE config SET valor = 'UCwL0afgA_8qr-75cUUPcglw'
 WHERE clave = 'youtube_channel_id' AND (valor IS NULL OR valor = '');
