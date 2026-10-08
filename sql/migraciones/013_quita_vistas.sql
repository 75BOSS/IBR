-- Quita las vistas del esquema base: el sitio ya no las usa.
-- Causa: una vista de MySQL queda atada a la cuenta que la creó (DEFINER = usuario@host). En
-- Hostinger las migraciones se corren por «MySQL remoto», así que el DEFINER es usuario@IP de
-- quien las corrió; la web app entra por 127.0.0.1. Si esa cuenta remota deja de existir (se quita
-- el acceso remoto o cambia la IP), MySQL rechaza la vista: el resumen del panel no cargaba.
-- El resumen ahora hace la consulta directa (src/lib/dashboard.ts). v_grupos_publicos no la usaba
-- nadie y tenía el mismo riesgo para quien la abriera en phpMyAdmin.

DROP VIEW IF EXISTS v_dashboard;
DROP VIEW IF EXISTS v_grupos_publicos;
