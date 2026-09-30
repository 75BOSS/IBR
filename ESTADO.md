# ESTADO.md — Web IBR

Última actualización: 2026-09-30 (sesión de Claude Code). Claude Code: actualizar este archivo al cierre de cada sesión.

## Fase actual

**F0 — Cimientos: 6 de 9 checkboxes hechos.** Todo lo que no depende de Hostinger está implementado, probado en local (MySQL 8 + Chromium) y subido a `dev`.

Falta, y depende de Cristian (ver «Necesito de Cristian»):

- F0.4 — Aplicar el esquema en la BD de Hostinger e importar el PHP (necesita credenciales + dump del PHP).
- F0.8 — Crear la web app en Hostinger apuntando a `dev` y primer deploy verde.
- F0.9 — Correr la prueba SSE detrás del proxy de Hostinger (la ruta y la página de prueba ya están hechas).

## Necesito de Cristian

Lista consolidada. Nada de esto se sube al repo: los valores van en hPanel → Web app → Variables de entorno (referencia: `.env.example`).

1. **Acceso a hPanel** o que crees tú la **web app Node.js** (Node 22, preset Next.js, build `npm run build`, rama `dev`, dominio `dev.ibriglesia.com`), conectada al repo `75BOSS/IBR`.
2. **Base de datos MySQL nueva y vacía** en hPanel → Bases de datos: el host remoto, el usuario, la contraseña y el nombre, que van en `DATABASE_URL`. Dime también si es **MySQL 8 o MariaDB** y su versión (se ve en phpMyAdmin → Inicio).
3. **Dump del sistema PHP** de grupos: phpMyAdmin → Exportar → Personalizado. Primero solo la estructura y después la estructura con los datos. Pásamelo por un canal privado, **no por GitHub** (tiene datos personales; `sql/legado/*.sql` está ignorado por git). Y acceso de **solo lectura** a esa BD (`LEGACY_DATABASE_URL`).
4. **Correo y nombre del primer administrador**. Yo creo el usuario con una contraseña generada y te la paso una sola vez.
5. **`SESSION_SECRET`**: genera uno (o te lo genero) y cárgalo en Hostinger. Debe tener 32 caracteres aleatorios o más.
6. **Token API de Hostinger** (alcance mínimo: websites + DNS) para que Claude Code pueda desplegar y leer los logs de build.
7. **Cloudinary** (plan gratuito): `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. Se usa desde F1.
8. **SMTP de Hostinger**: la casilla de correo que envía los avisos (`SMTP_USER`, `SMTP_PASS`). Se usa desde F1.
9. **YouTube Data API key**: opcional. Sin ella, en F1 el título de la prédica se escribe a mano.
10. **Decidir la visibilidad del repo.** `75BOSS/IBR` es **público**. No tiene secretos, pero conviene que sea privado.

Cuando haya deploy en `dev.ibriglesia.com`: entrar a `/admin/diagnostico` → «Probar SSE» y pegarme el resultado y la tabla de cabeceras (o dejarme el acceso y lo hago yo).

## Decisiones tomadas

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-09-03 | Arquitectura B: Node.js gestionado en Hostinger (Business/Cloud) + MySQL de Hostinger | Más opciones de desarrollo y deploy desde Claude Code sin sysadmin; PHP convive en el mismo plan |
| 2026-09-03 | Next.js 15 App Router + TypeScript + Tailwind + mysql2 (sin ORM) | Stack ya probado por Pixelia en el proyecto de la cafetería |
| 2026-09-03 | Sin Socket.io; tiempo real = polling/SSE; Supabase Realtime solo si F3 lo exige | Hostinger Web/Cloud solo permite WebSockets salientes |
| 2026-09-03 | El sistema PHP de grupos se reemplaza módulo por módulo, no se reescribe de golpe | Está funcionando; se importa su BD y se apaga cuando `/admin/grupos` esté listo |
| 2026-09-03 | Archivos en Cloudinary, nunca en el filesystem de la app | El build de Hostinger borra lo que no viene del repo |
| 2026-09-30 | Se mantiene Next.js aunque la preferencia general de Cristian es PHP | La arquitectura ya estaba decidida el 2026-09-03; MySQL/phpMyAdmin y Hostinger siguen igual |
| 2026-09-30 | Repo real `75BOSS/IBR` (el ROADMAP decía `pixelia/ibr-web`) | Es el repo que existe y está conectado; `main` = producción (no se toca), `dev` = pruebas |
| 2026-09-30 | Claude trabaja en `claude/focused-albattani-mvfzd0` y adelanta `dev` a ese mismo commit cuando build + lint pasan | Así lo pidió Cristian; `main` solo se actualiza con su aprobación |
| 2026-09-30 | `ESQUEMA.sql` vive en `sql/ESQUEMA.sql` y se aplica como migración `000_esquema_base` | Estructura de CLAUDE.md; un solo camino (`npm run db:migrate`) para BD vacía y para migraciones nuevas |
| 2026-09-30 | `db:migrate -- --marcar-base` registra el esquema sin ejecutarlo | Cristian usa phpMyAdmin: si aplica `ESQUEMA.sql` a mano, el runner no intenta recrear tablas |
| 2026-09-30 | Next.js 15.5.26 fijado (no 16), React 19.1.9 | Stack fijo "Next.js 15"; 15.5.x trae los parches de seguridad de middleware y RSC |
| 2026-09-30 | Cada conexión MySQL ejecuta `SET time_zone = '+00:00'` | `DEFAULT CURRENT_TIMESTAMP` y `NOW()` usan la zona de la sesión; en Hostinger puede no ser UTC (probado con servidor en -05:00) |
| 2026-09-30 | `TINYINT(1)` llega como `boolean` a JS | Tipos claros (`activo: boolean`); `TINYINT` sin (1), como `dia_semana`, sigue siendo número |
| 2026-09-30 | `rate_limits.ip` guarda 16 bytes de SHA-256 de `ip:<ip>` o `cuenta:<email>` | Limitar el login por IP **y** por cuenta con la misma tabla; no guardar IPs en claro. Solo cambió el comentario del esquema |
| 2026-09-30 | Sesión del admin: 12 h, cookie `ibr_admin` httpOnly/Secure/Lax; `requireAdmin()` revisa en BD que el usuario siga activo | Voluntarios en compus compartidas; desactivar a alguien corta el acceso de inmediato |
| 2026-09-30 | Login: 5 intentos fallidos por IP y 10 por cuenta cada 10 min, **reservados antes** de verificar | Insertar y después contar: las peticiones simultáneas no se saltan el tope (probado: 12 simultáneas → 5 pasan) |
| 2026-09-30 | Cookie de dispositivo `ibr_dispositivo` (180 días, patrón OWASP): el límite por cuenta solo aplica a navegadores donde esa cuenta nunca entró | Corrige lo que antes figuraba como «costo aceptado». La revisión mostró que el bloqueo por cuenta se podía mantener para siempre y dejaba sin acceso al admin. Ahora el admin entra desde su compu de siempre aunque lo ataquen |
| 2026-09-30 | IP del visitante = la que agregó el proxy de confianza (`TRUSTED_PROXY_HOPS`, por defecto 1, contando desde la derecha de X-Forwarded-For) | Next no limpia X-Forwarded-For: la IP de la izquierda la escribe el visitante. Hay que confirmar el valor en `/admin/diagnostico` |
| 2026-09-30 | `usuarios_admin.sesion_version`: «Cerrar sesión» cierra en todos los dispositivos; `db:seed-admin` sobre un usuario existente también | Poder cortar una sesión robada sin rotar `SESSION_SECRET`. Se agregó en `ESQUEMA.sql` (v0.2) porque aún no se aplicó en ninguna BD real |
| 2026-09-30 | Máximo 3 verificaciones bcrypt simultáneas | Cada una cuesta ~0,4 s de CPU; una ráfaga no debe tumbar el único proceso |
| 2026-09-30 | El middleware deja pasar las server actions (cabecera `next-action`) | Un 307 del middleware rompía la respuesta de la acción y mostraba la pantalla de error; la autorización de las acciones es `requireAdmin()` |
| 2026-09-30 | Columnas `DATE` como texto `'YYYY-MM-DD'` (`dateStrings: ['DATE']`) | Como `Date` UTC salían un día antes al mostrarlas en hora de Ecuador |
| 2026-09-30 | `next/image` solo acepta miniaturas de YouTube; Cloudinary se agrega en F1 con la ruta de la cuenta | Sin ruta, `/_next/image` servía de proxy para cualquier cuenta de Cloudinary (CPU/disco del hosting) |
| 2026-09-30 | Grupo de rutas `(admin)/admin/(panel)` para las páginas con barra lateral | El login queda sin barra lateral sin condicionales en el layout; las URLs no cambian |
| 2026-09-30 | `getSiteConfig()` usa los valores base si la BD no responde y nunca hubo un valor bueno (lo registra en el log); un error no se guarda en caché | El header y el footer no deben tumbar el sitio ni el build de Hostinger; tampoco una caída breve debe pisar la configuración real 5 minutos |
| 2026-09-30 | Tipografía Fraunces (títulos) + Figtree (texto); paleta petróleo `#0E5E6F` + terracota; fondos arena, sin blanco puro | Reglas Pixelia; contraste AA verificado en todas las combinaciones de texto |
| 2026-09-30 | Íconos propios en `Icon.tsx` (trazos de Lucide ISC + marcas de Simple Icons CC0), sin librería | Sin dependencias pesadas; WhatsApp y TikTok no están en Lucide |
| 2026-09-30 | `FormState` como resultado único de server actions; `ConfirmDialog` y `Toast` desde F0 | Consistencia (Nielsen) antes de construir los CRUD de F1 |
| 2026-09-30 | `playwright-core` (dev) + `npm run revisar` para la revisión a 360/768/1280 | Comprobar las Reglas Pixelia (sin desborde horizontal) de forma repetible |
| 2026-09-30 | Pruebas unitarias con `node:test` vía `tsx --test`, sin framework extra | Utilidades puras (YouTube, mapas, WhatsApp, redirecciones, fechas): 41 pruebas |
| 2026-09-30 | `PageHeader`, `FormAlert`, `container-panel` y `on-dark` como piezas únicas; `buttonClasses` en un módulo sin `'use client'` | La revisión encontró encabezados y avisos copiados a mano con variantes, y el foco con contraste < 3:1 sobre fondos oscuros |

## Pendiente de confirmar con la iglesia (bloquea F1 contenido, no F0)

- [ ] Plan contratado exacto (Business = 5 apps / Cloud Startup = 10 apps)
- [ ] Dirección real del auditorio, horarios por día, teléfono/WhatsApp oficial, correo único
- [ ] Nombres, fotos y bios de pastores y equipo
- [ ] 20–40 fotos reales
- [ ] Cuentas bancarias para `/dar` y quién recibe avisos de registros/peticiones
- [ ] Nombres de ministerios por rango de edad
- [ ] 1–2 personas que administrarán contenido
- [ ] Acceso a hPanel y DNS

## Pendiente técnico (bloquea F0)

- [ ] Dump SQL del sistema PHP actual (`mysqldump` o export phpMyAdmin) para reconciliar columnas reales con `ESQUEMA.sql` — ver `MIGRACION-PHP.md` §1
- [x] Repo GitHub creado (`75BOSS/IBR`, ramas `main` y `dev`)
- [ ] Repo conectado a la web app de Hostinger
- [ ] Token API de Hostinger (alcance mínimo) en la cuenta de Claude Code de implementación
- [ ] Cuenta Cloudinary (plan gratuito) y credenciales
- [ ] YouTube Data API key (opcional en F1; sin key se llena título a mano)

## Qué se hizo — sesión 2026-09-30

- Se ordenó el repo: los documentos quedaron en la raíz, el esquema en `sql/ESQUEMA.sql` y se borró el zip subido. Se agregó la sección «Reglas Pixelia» a `CLAUDE.md`.
- F0.1 y F0.2: `.env.example`, README, `.gitignore`, `.gitattributes` (LF), scaffold Next 15.5.26 con TS estricto, ESLint (sin warnings) + Prettier, tema de diseño con tokens y rama `dev`.
- F0.3: `db.ts` (pool, `query`, `queryOne`, `execute`, UTC por conexión) y `scripts/migrate.ts` con checksums, `--estado` y `--marcar-base`. Se probaron el camino feliz y los errores.
- F0.5: auth completa. Login con Zod, límite de intentos, middleware y `requireAdmin()`, más `scripts/seed-admin.ts`. Se probó de punta a punta en Chromium: deep link con `next`, errores por campo, bloqueo, logout y `next` malicioso.
- F0.6: layout público (header con menú móvil y footer desde `config`) y panel (barra lateral y cajón con `<dialog>`), cada uno con su 404.
- F0.7: los componentes base, más Toast, ConfirmDialog, Tag, Icon y BrandMark. El catálogo está en `/admin/componentes`.
- F0.9 (parcial): `/api/ping-sse` y `/admin/diagnostico`. En local, los eventos llegan cada 2 s.
- Revisión en 360/768/1280 px de `/`, `/admin/login`, `/admin`, `/admin/componentes`, `/admin/diagnostico` y los 404: sin desborde horizontal.
- **Revisión adversarial de F0** con un workflow de 8 agentes (seguridad, bugs, Next.js y Reglas Pixelia, cada uno con su verificador escéptico). Salieron 37 hallazgos: 33 confirmados, 2 inciertos y 2 refutados. Se corrigieron los 33 confirmados y los 2 inciertos (HSTS y `/api/ping-sse` con sesión) en tres commits: login y sesión, Next y datos, UI. Cada corrección tiene su prueba: 15 escenarios de punta a punta en Chromium, pruebas de reserva concurrente en MySQL y MariaDB y 41 pruebas unitarias.
- Los 2 refutados quedan como notas para F1: validar `NEXT_PUBLIC_SITE_URL` (https en producción) antes de usarla en sitemap o correos, y decidir si la navegación pública oculta las páginas que no existen cuando el sitio salga a producción.

## Descubrimientos / notas de sesión

- `ESQUEMA.sql`, `db:migrate`, `db:seed-admin`, los helpers de `db.ts` y el login de punta a punta pasan tanto en **MySQL 8.0.46** como en **MariaDB 10.11.14**, ambos con la zona global en -05:00. En MySQL hay 21 avisos inofensivos de «display width deprecated» por `TINYINT(1)`. El SQL del código evita la sintaxis exclusiva de MySQL 8 (se usa `VALUES()` en `ON DUPLICATE KEY UPDATE`).
- `next start` pone `x-forwarded-for` solo si no llega, y **no limpia** lo que manda el visitante. Por eso `getClientIp()` toma la IP desde la derecha (`TRUSTED_PROXY_HOPS`). Cómo verificarlo en Hostinger: en `/admin/diagnostico`, `x-forwarded-for` debería terminar en tu IP real. Si hay dos IPs de Hostinger al final, poner `TRUSTED_PROXY_HOPS=2`. Revisar también que la respuesta traiga `Strict-Transport-Security`.
- La compresión de Next no comprime `text/event-stream`, así que SSE no queda retenido por gzip.
- El contenedor de Claude bloquea los dominios de YouTube, por eso la miniatura sale rota en las capturas locales. En Hostinger debería cargar.
- Next.js inyecta su propio `role="alert"` (route announcer). En los tests hay que buscar el texto del mensaje, no el rol.

## Cómo probar en local (contenedor de Claude)

MySQL 8 local con la BD `ibr_dev`, el usuario `ibr` y `.env.local` apuntando a `127.0.0.1`. En cada sesión nueva hay que reinstalarlo (`apt-get install mysql-server-8.0`), crear la BD y el usuario, y correr `npm run db:migrate` y `npm run db:seed-admin -- --email=admin@ibr.test --nombre="Admin Pruebas" --generar`. Conviene poner el servidor en `SET GLOBAL time_zone='-05:00'` para detectar errores de zona horaria.

Para probar en MariaDB sin chocar con MySQL: `apt-get download mariadb-server-core mariadb-client-core libmariadb3 liburing2`, extraer con `dpkg -x` en el scratchpad, `mariadb-install-db` y `mariadbd` en el puerto 3307 con socket corto (`/tmp/ibr-mdb.sock`; las rutas largas pasan el límite de 107 caracteres). Después, `DATABASE_URL=mysql://…@127.0.0.1:3307/… npm run db:migrate`.

## Qué hacer en la próxima sesión

1. Ejecutar PASO 0 de `CLAUDE.md`.
2. Si ya hay credenciales de Hostinger: F0.8 (web app → `dev`), `npm run db:migrate` contra la BD nueva, crear el primer admin y correr `/admin/diagnostico` (F0.9). Anotar los resultados aquí.
3. Si ya está el dump del PHP: reconciliar `ESQUEMA.sql` §«Tablas heredadas» (MIGRACION-PHP.md §1) **antes** de aplicarlo en Hostinger, y escribir `scripts/importar-php.ts`.
4. Al cerrar F0: borrar `/api/ping-sse` y `/admin/diagnostico`.
5. F1: arrancar por `/admin/config` y `/admin/equipo`. Crear el componente de tabla del panel (cabecera con color y filas-tarjeta en celular) con el primer listado real, no antes. En `/admin/config`, validar el WhatsApp con `normalizeEcuadorWhatsapp()` y llamar a `revalidateTag(CONFIG_TAG)` al guardar.
6. Filtrar `ADMIN_NAV` por rol (el editor no debe ver Configuración ni Usuarios) cuando existan esos módulos.
