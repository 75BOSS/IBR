# ESTADO.md — Web IBR

Última actualización: 2026-10-07 (sesión de Claude Code). Claude Code: actualizar este archivo al cierre de cada sesión.

## Fase actual

**Todo el código de F1, F2 y F3 está hecho**, probado en local (MySQL 8 + Chromium) y subido a `dev`. F1, F2 y F3 pasaron por una revisión de código independiente y todos sus hallazgos se corrigieron.

- **F1 — Web que sirve:** 15 de 15 checkboxes de código. Falta el «Cierre F1», que no es código: contenido real, apagar el PHP de grupos, DNS y redirección de `ibrcomunidad.com`.
- **F2 — Comunidad:** 8 de 8 (Nosotros, inscripciones con cupo, ministerios, Servir, agenda semanal, WhatsApp al líder, categorías, roles).
- **F3 — Plataforma:** 2 de 2 (cuenta de miembro con código por WhatsApp, check-in por QR).

**F0** sigue con 3 checkboxes abiertos que dependen de Hostinger:

- F0.4 — Aplicar el esquema en la BD de Hostinger e importar el PHP (necesita credenciales + dump del PHP).
- F0.8 — Crear la web app en Hostinger apuntando a `dev` y primer deploy verde.
- F0.9 — Correr la prueba SSE detrás del proxy de Hostinger (la ruta y la página de prueba ya están hechas).

La revisión a 360/768/1280 px se hizo con datos de prueba (34 rutas del sitio y del panel, sin desborde); se repite con el contenido real antes del cambio de DNS.

## Necesito de Cristian

Lista consolidada. Nada de esto se sube al repo: los valores van en hPanel → Web app → Variables de entorno (referencia: `.env.example`).

1. **Acceso a hPanel** o que crees tú la **web app Node.js** (Node 22, preset Next.js, build `npm run build`, rama `dev`, dominio `dev.ibriglesia.com`), conectada al repo `75BOSS/IBR`.
2. **Base de datos MySQL nueva y vacía** en hPanel → Bases de datos: el host remoto, el usuario, la contraseña y el nombre, que van en `DATABASE_URL`. Dime también si es **MySQL 8 o MariaDB** y su versión (se ve en phpMyAdmin → Inicio).
3. **Dump del sistema PHP** de grupos: phpMyAdmin → Exportar → Personalizado. Primero solo la estructura y después la estructura con los datos. Pásamelo por un canal privado, **no por GitHub** (tiene datos personales; `sql/legado/*.sql` está ignorado por git). Y acceso de **solo lectura** a esa BD (`LEGACY_DATABASE_URL`).
4. **Correo y nombre del primer administrador**. Yo creo el usuario con una contraseña generada y te la paso una sola vez. Importante: **los pastores deben tener rol `admin`**, porque solo ese rol lee las peticiones de oración privadas; los voluntarios que cargan contenido van como `editor`.
5. **`SESSION_SECRET`**: genera uno (o te lo genero) y cárgalo en Hostinger. Debe tener 32 caracteres aleatorios o más.
6. **Token API de Hostinger** (alcance mínimo: websites + DNS) para que Claude Code pueda desplegar y leer los logs de build.
7. **Cloudinary** (plan gratuito): `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. Se usa desde F1.
8. **SMTP de Hostinger**: la casilla de correo que envía los avisos (`SMTP_USER`, `SMTP_PASS`). Sin esto no salen los avisos, la confirmación de inscripciones ni la agenda semanal. Dime también el **límite de envíos por hora** de su plan (la agenda se manda a todos los suscriptores).
9. **YouTube Data API key**: opcional. Sin ella, el título y la miniatura salen de oEmbed (sin fecha de publicación).
10. **Decidir la visibilidad del repo.** `75BOSS/IBR` es **público**. No tiene secretos, pero conviene que sea privado.
11. **Contenido real** para cargar desde el panel (`/admin/config`, `/admin/equipo`, `/admin/reuniones`…): foto de portada, dirección y mapa, WhatsApp oficial, correo que recibe los avisos (`email_avisos`), cuentas bancarias y QR, pastores con foto, horarios. Lo puede cargar la iglesia o me lo pasas y lo cargo yo.
12. **WhatsApp Cloud API de Meta** (opcional, F2/F3): una cuenta de WhatsApp Business verificada en Meta, el `WHATSAPP_TOKEN` (token permanente de un usuario del sistema) y el `WHATSAPP_PHONE_NUMBER_ID`. Hay que crear y aprobar dos plantillas en español:
    - `nueva_solicitud_grupo` (categoría Utilidad): «Hola {{1}}, {{2}} quiere unirse al grupo «{{3}}». Su WhatsApp: {{4}}. Escríbele pronto.»
    - `codigo_acceso` (categoría Autenticación, con botón «Copiar código»): el código de 6 dígitos para entrar a «Mi cuenta».
    Sin esto, el aviso al líder sigue por correo y «Mi cuenta» dice que todavía no se pueden enviar códigos.
13. **Textos de «Nosotros»** (historia, misión y «En qué creemos») y **áreas de servicio** con su responsable. La declaración de fe la debe escribir o aprobar la iglesia: no la inventé, y si está vacía la sección no aparece.
14. **Que la iglesia lea `/privacidad`** (política de datos en lenguaje sencillo, con la LOPDP). Confirmar que están de acuerdo con el texto y con el plazo de 15 días para responder pedidos de datos.

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
| 2026-09-30 | Login: 5 intentos fallidos por IP y 10 por cuenta cada 10 min, **reservados antes** de verificar, con un candado `GET_LOCK` por clave | El tope es exacto con peticiones simultáneas (12 → pasan 5, probado en MySQL y MariaDB). Contar sin candado dejaba pasar a todos (primera versión) o a ninguno (segunda) |
| 2026-09-30 | Cookie de dispositivo `ibr_dispositivo` (180 días, patrón OWASP, con id propio): en navegadores donde la cuenta ya entró, el límite por cuenta se cambia por uno por dispositivo (10/10 min) | Corrige lo que antes figuraba como «costo aceptado». La revisión mostró que el bloqueo por cuenta se podía mantener para siempre y dejaba sin acceso al admin. Ahora el admin entra desde su compu de siempre aunque lo ataquen |
| 2026-09-30 | IP del visitante = la que agregó el proxy de confianza (`TRUSTED_PROXY_HOPS`, por defecto 1, contando desde la derecha de X-Forwarded-For) | Next no limpia X-Forwarded-For: la IP de la izquierda la escribe el visitante. Hay que confirmar el valor en `/admin/diagnostico` |
| 2026-09-30 | `usuarios_admin.sesion_version`: «Cerrar sesión» cierra en todos los dispositivos; `db:seed-admin` sobre un usuario existente también | Poder cortar una sesión robada sin rotar `SESSION_SECRET`. Se agregó en `ESQUEMA.sql` (v0.2) porque aún no se aplicó en ninguna BD real |
| 2026-09-30 | Máximo 3 verificaciones bcrypt simultáneas; el resto espera en fila hasta 10 s y los dispositivos conocidos pasan adelante | Cada una cuesta ~0,4 s de CPU. Una ráfaga no debe tumbar el único proceso, y un ataque no debe dejar afuera al admin |
| 2026-09-30 | Límite por IP agrupado por bloque IPv6 /64 | Una conexión doméstica IPv6 tiene millones de direcciones: rotarlas no debe dar intentos nuevos |
| 2026-09-30 | «Cerrar sesión» solo sube `sesion_version` si la cookie sigue vigente; el aviso distingue entre «todos tus dispositivos», «este equipo» y «no pudimos cerrar las demás» | Una cookie robada y ya revocada no puede echar al admin, y el aviso no promete lo que no pasó |
| 2026-09-30 | El middleware deja pasar las server actions (POST con cabecera `next-action`) | Un 307 del middleware rompía la respuesta de la acción y mostraba la pantalla de error; la autorización de las acciones es `requireAdmin()` |
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
| 2026-09-30 | Módulo extra **«Lugares»** (`/admin/ubicaciones`) | Reuniones, grupos y eventos eligen su lugar de `ubicaciones`; sin pantalla no había cómo crearlos. La dirección de una casa solo se publica si `publica = 1` |
| 2026-09-30 | Módulo extra **«Mensajes»** (`/admin/mensajes`) | El ROADMAP guarda `contactos` pero no tenía dónde leerlos. Pestañas sin leer / leídos, igual que Peticiones |
| 2026-09-30 | Migración `001_grupos_imagen_public_id` | `grupos` no tenía dónde guardar el `public_id` de Cloudinary para borrar la foto vieja. Primera migración real: no se edita `ESQUEMA.sql` una vez aplicado |
| 2026-09-30 | Prédicas: con `YOUTUBE_API_KEY` se usa la Data API; sin ella, oEmbed (título + miniatura) | La key es opcional; oEmbed no pide credenciales. La respuesta se guarda en `predicas`, no se consulta en cada visita |
| 2026-09-30 | `next/image` con `loaderFile` propio (`src/lib/image-loader.ts`): Cloudinary y YouTube se sirven desde su CDN, sin `/_next/image` | Hostinger no tiene que redimensionar imágenes (CPU) y no hay proxy abierto |
| 2026-09-30 | `useToastAction` en vez de un efecto que mira el estado | Si la acción revalida y la fila desaparece (cambió de pestaña), el «Guardado» igual se muestra |
| 2026-09-30 | Todos los formularios con `noValidate`; tras crear o borrar se redirige con `?aviso=creado|guardado|eliminado` (`FlashToast`) | La burbuja nativa del navegador tapaba nuestros mensajes (en inglés o sin explicar cómo arreglarlo) |
| 2026-09-30 | La petición de oración puede ser anónima: el consentimiento se pide solo si deja nombre, WhatsApp o correo; es privada por defecto | Pedir datos para orar alejaría a quien más lo necesita; sin datos personales no hay nada que consentir |
| 2026-09-30 | `whenValid()` en los `.refine()` entre campos y `emptyToNull` también para campos ausentes | Zod no corre las reglas del objeto si otro campo falló: los errores salían de a uno. Un campo opcional ausente daba un error en inglés |
| 2026-09-30 | `pageMetadata()` (`src/lib/seo.ts`) arma el Open Graph completo de cada página, con `public/og-default.png` si no tiene imagen | Next reemplaza el `openGraph` del layout cuando la página define el suyo: los enlaces por WhatsApp salían sin imagen ni descripción |
| 2026-09-30 | Íconos (favicon, `icon.png`, `apple-icon.png`, manifest 192/512/maskable) e imagen OG generados con Chromium y las fuentes reales | El favicon era el de Next. Reemplazables cuando la iglesia tenga logo |
| 2026-09-30 | Peticiones privadas: solo el rol `admin` (pastores) lee el texto y los datos; para `editor` no salen de la BD (`CASE` en la consulta). El correo de aviso de una privada no lleva el texto | Lo promete `/oracion` y `/privacidad`; la revisión encontró que cualquier cuenta del panel las leía y que el correo (posible casilla compartida) llevaba el texto |
| 2026-09-30 | Migración `002`: `acepta_datos` en `peticiones` y `contactos` (fecha = `creado_en`, IP = `ip`, como `solicitudes_grupo`) | CLAUDE.md pide guardar el consentimiento con fecha e IP; en una petición anónima queda en 0 |
| 2026-09-30 | Usuarios del panel: contraseña aleatoria generada y mostrada una sola vez (`secret` en FormState); cambiar rol o desactivar corta sus sesiones; nadie se quita su propio rol de admin y el último admin no se puede degradar (transacción con bloqueo) | Evita contraseñas débiles elegidas por terceros y paneles sin administrador |
| 2026-09-30 | Ministerios = `rangos_edad` (como decía ESQUEMA §3): se editan desde `/admin/ministerios`, no se borran (se desactivan) y el slug no cambia al editar | Grupos, registros y reuniones apuntan a ellos; los enlaces compartidos no se rompen |
| 2026-09-30 | Inscripciones: cupo exacto con `SELECT … FOR UPDATE` sobre el evento (`withTransaction`), `personas` por inscripción, un WhatsApp por evento y código de 8 caracteres sin letras confusas | Probado: 4 personas simultáneas por 2 lugares → entran exactamente 2 |
| 2026-09-30 | Contador de cupo y tablero de check-in por polling (15 s y 10 s) | Hostinger no permite WebSockets entrantes; con estos volúmenes no hace falta SSE ni Supabase Realtime |
| 2026-09-30 | Agenda semanal con doble confirmación, botón (no enlace) para confirmar o darse de baja, cabecera List-Unsubscribe y reintento solo con quienes no la recibieron | Los antivirus de correo abren enlaces solos; nadie puede suscribir un correo ajeno; no se repiten correos |
| 2026-09-30 | Categorías de eventos como rutas estáticas `/eventos/categoria/[categoria]` | Mantienen la caché de 5 min (con `?categoria=` la página se generaba en cada visita) |
| 2026-09-30 | WhatsApp Cloud API opcional (`src/lib/whatsapp-cloud.ts`): plantillas aprobadas, 8 s máximo, sin credenciales no hace nada | Un aviso extra nunca debe hacer perder lo que la persona envió |
| 2026-09-30 | «Mi cuenta» sin contraseña: código de 6 dígitos por WhatsApp, solo a números que la iglesia ya tiene, HMAC en BD, 10 min, 5 intentos; cookie propia `ibr_miembro` de 30 días | Nadie usa el sitio para mandar mensajes a números ajenos ni para saber quién es de la iglesia |
| 2026-09-30 | Check-in con la cámara vía `BarcodeDetector` (Chrome/Android), sin librería; si el navegador no lo tiene, se escribe el código | Sin dependencias pesadas; los ujieres suelen usar Android |
| 2026-09-30 | Dependencia nueva: `qrcode` (genera el QR como SVG en el servidor) | Pequeña y sin dependencias de UI; nada se carga en el navegador |
| 2026-09-30 | Menú del panel agrupado (Personas, Contenido del sitio, Comunicación, Administración) y con desplazamiento interno | 17 módulos ya no cabían; «Cerrar sesión» quedaba fuera de vista |
| 2026-09-30 | «Configuración» no aparece en el menú del rol editor (`adminOnly` en `ADMIN_NAV`) | La página ya exigía admin; el enlace solo llevaba a un aviso de «sin permiso» |
| 2026-09-30 | «Mi cuenta»: a un número desconocido se le guarda un código señuelo y se responde igual que a uno conocido (el WhatsApp sale con `after()`); pedir otro código no anula los anteriores | La respuesta y el tiempo no revelan quién es de la iglesia; si WhatsApp tarda, el primer código sigue sirviendo |
| 2026-09-30 | Topes de códigos: 3 cada 10 min y 5 por día por teléfono, 300 por día en todo el sitio, 10 intentos fallidos por día por teléfono (reservados antes de comparar) | Cada plantilla de WhatsApp cuesta; el tope diario limita el gasto aunque alguien pruebe muchos números |
| 2026-09-30 | Orden de bloqueo fijo en inscripciones: primero el evento, después la inscripción (inscribirse, cancelar y cambiar estado desde el panel) | Evita bloqueos cruzados (deadlock) entre la persona que cancela y el panel |
| 2026-09-30 | `Permissions-Policy: camera=(self)` | El tablero de check-in usa la cámara; ningún sitio de terceros puede pedirla |
| 2026-09-30 | `/eventos?categoria=x` redirige (308) a `/eventos/categoria/x` | Los enlaces viejos ya compartidos por WhatsApp siguen funcionando |
| 2026-10-07 | Rediseño del sitio público tomando ideas de caminodevida.com, masvida.org, ciem.casadedios.org y supresencia.com (revisados con el navegador): titulares grandes, accesos de colores, carrusel, frase en movimiento, ministerios con foto, contadores | Cristian pidió «un sitio muy bonito»; las tipografías y la organización se veían básicas |
| 2026-10-07 | Se mantienen Fraunces + Figtree, pero Fraunces se usa como titular (`font-headline`: peso 420, tamaño óptico alto, letras juntas) con cursiva «WONK» en terracota para el `<em>` de cada título | Las fuentes tienen carácter; lo básico era cómo se usaban (seminegrita a tamaño mediano) |
| 2026-10-07 | Animaciones sin librerías: aparición al hacer scroll con CSS (`animation-timeline: view()`), marquesina y zoom con CSS, contadores y carrusel con un poco de JS propio. Sin GSAP, Lenis, Swiper ni pantalla de carga | Peso mínimo en datos móviles; sin JavaScript nada queda oculto; con «reducir movimiento» todo queda quieto |
| 2026-10-07 | Menú público agrupado (`PUBLIC_MENU`: Conócenos, Conéctate, Recursos + Dar) con desplegables; reemplaza las 6 entradas fijas de F0 | Con F2 y F3 el sitio tiene 17 páginas; agrupadas, todas quedan a un clic sin saturar el encabezado |
| 2026-10-07 | Portada sin foto: ilustración del Chimborazo al amanecer (`HeroArt`). Video corto opcional (`home_hero_video`, migración 011) | Se ve terminada antes de tener fotos reales; el volcán es la imagen de Riobamba |
| 2026-10-07 | Paleta tomada de las redes de la IBR («Somos Familia»): azul marino `#102a4f`/`#0f2340`, durazno `#f8cba0`, azul eléctrico `#2c55c7`, naranja `#b14d1a` y crema. Reemplaza el petróleo y terracota iniciales; el sello pasa a «ibr» en un círculo azul marino | El sitio debe sentirse de la misma iglesia que sus publicaciones de Instagram |
| 2026-10-07 | Escala tipográfica más contenida (hero máx. 6.25rem, display 4.25rem, sección 3.25rem) y tarjetas más bajas (ministerios, portada, cierre) | En una pantalla de 1905 px todo se veía enorme: los máximos de `clamp()` estaban pensados para impacto y no para proporción |

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
- **Segunda verificación** (3 agentes) sobre las correcciones: encontró 18 observaciones (4 regresiones de seguridad y el resto correcciones incompletas). Se corrigieron todas en dos commits. La primera versión de su sugerencia para el límite (contar todas las filas) bloqueaba a todos en una ráfaga. Lo detectó la prueba de concurrencia, y la solución de raíz fue el candado por clave.
- Pruebas finales: 51 unitarias. `npm run probar:login` con 9 comprobaciones de punta a punta. Escenarios de ataque verificados: cookie copiada revocada, logout forzado con cookie revocada, atacante con varias IPs frente al dueño en su dispositivo, ráfagas concurrentes y IPv6 del mismo /64. Revisión responsive sin desborde en todas las páginas.
- Los 2 refutados quedan como notas para F1: validar `NEXT_PUBLIC_SITE_URL` (https en producción) antes de usarla en sitemap o correos, y decidir si la navegación pública oculta las páginas que no existen cuando el sitio salga a producción.

## Qué se hizo — F1 (misma fecha, sesiones siguientes)

- Piezas compartidas: `DataTable` (cabecera con color, filas-tarjeta en celular), `Checkbox`, `CrudForm`, `PublicForm` (honeypot + consentimiento + agradecimiento), `FilterTabs`, `StatusForm`, `ActionButton`, `ContactLinks`, `CopyButton`, `ImageField` (Cloudinary firmado, sin SDK), `sendMail` (Nodemailer; si falta SMTP lo registra y sigue).
- Panel: Configuración, Equipo, Lugares, Reuniones, Prédicas, Eventos, Grupos (+ bandeja de solicitudes), Registros (+ agregar en persona y CSV), Peticiones, Mensajes y el Resumen con pendientes.
- Sitio: portada real, Soy nuevo, Reuniones, Grupos (+ ficha y «Quiero unirme»), Prédicas (+ aviso «En vivo» por polling), Eventos (+ detalle), Dar, Pedir oración, Contacto, Privacidad, 404; `sitemap.xml`, `robots.txt`, manifest, íconos y Open Graph en todas.
- Verificado de punta a punta en Chromium: los 4 formularios públicos (errores juntos, lo escrito se conserva, límite 5/10 min por IP y honeypot que no guarda), bandejas del panel (marcar, deshacer, borrar con confirmación, toasts, contadores) y la revisión 360/768/1280 de 30 rutas públicas y del panel sin desborde horizontal.
- 76 pruebas unitarias (`npm test`), `npm run lint` y `npm run build` limpios.
- Revisión independiente del código de F1: sin fallas de seguridad; 4 hallazgos corregidos (privadas visibles para editores, contador y lista de eventos del resumen con reglas distintas, consentimiento sin guardar en peticiones/contactos, un comentario fuera de lugar). La privacidad se probó con una cuenta editor y una admin.

## Qué se hizo — F2 y F3 (misma fecha)

- F2: usuarios del panel y «Mi cuenta» (cambiar contraseña), Nosotros, Ministerios (sitio y panel), inscripción a eventos con cupo, código, correo, contador en vivo, página personal para ver o cancelar e inscritos con CSV, Servir (áreas y voluntarios), agenda semanal por correo, categorías de eventos y aviso por WhatsApp al líder.
- F3: check-in por QR con tablero para ujieres, y cuenta de miembro con código por WhatsApp (mis inscripciones, mis grupos, dónde sirvo).
- Piezas compartidas nuevas: `withTransaction` (db.ts), `lib/csv.ts`, `lib/slug-db.ts` (uniqueSlug único), `lib/text.ts` (párrafos), `SecretReveal`, `optionalCupo`, `ActionButton` y `FilterTabs` en `src/components`.
- Migraciones 002–010 aplicadas en la BD local (ver `sql/migraciones/`).
- Probado de punta a punta en Chromium con un SMTP falso local y una API de WhatsApp falsa: correos (confirmación, agenda con List-Unsubscribe, reintento), plantillas de WhatsApp (número 593…, parámetros, botón del código), carrera por el último lugar, check-in (válido, repetido, otro evento, cancelado) y el flujo completo de «Mi cuenta».
- Revisión independiente de F2: 11 hallazgos (ninguno de seguridad grave), todos corregidos en `f253576`.
- Revisión independiente de F3: 11 hallazgos (cámara bloqueada por la cabecera, carrera en los intentos del código, enumeración de miembros, topes diarios, lectura vieja del cupo al reconfirmar, agenda que pisaba suscriptores activos, doble admisión en el escáner, deadlock al cancelar, enlaces viejos de categorías, teléfonos del PHP), todos corregidos en `d72df2f`.
- 87 pruebas unitarias, lint y build limpios.

## Qué se hizo — rediseño del sitio público (2026-10-07)

- Se revisaron con el navegador cuatro sitios de referencia (secciones, tipografía, colores y animaciones) y se aplicaron las ideas que encajan con la IBR.
- Base: paleta de acompañamiento (`sage`, `ochre`, `sky`, `rose`, `night`), escala `text-hero`/`text-display`/`text-section`/`text-lead`, utilidades `eyebrow`, `font-headline` y `reveal`, botones `shape: 'pill'`.
- Piezas nuevas en `src/components/site`: `Carousel`, `Marquee`, `CountUp`, `HeroArt`, `EventCover`, `MinisterioCard` (+ `ministerioSpan`), `SectionHeading`; `EmphasizeLast` en `src/components/Emphasis.tsx`. `EventCard` tiene variantes `featured`/`tile`/`row`; `FilterTabs` tiene `variant="pills"`.
- Encabezado con desplegables y menú del celular a pantalla completa; pie con el nombre grande y los grupos del menú.
- Portada nueva; Nosotros con cifras (`src/lib/stats.ts`); Ministerios con tarjetas de foto; Eventos con portadas tipográficas; todas las páginas públicas con `PageHeader size="display"`.
- Revisado a 360/768/1280 sin desborde (20 rutas). Se encontró y corrigió que el menú del celular no se podía tocar (ver notas).

## Descubrimientos / notas de sesión

- `backdrop-filter` (el desenfoque del encabezado) convierte al elemento en el contenedor de sus hijos `position: fixed`: el menú del celular, que era `fixed`, quedaba encerrado en los 64 px del header y no se podía tocar. Ahora es `absolute top-full` con alto `100dvh` menos el header.
- La aparición al hacer scroll es solo CSS (`animation-timeline: view()`). En las capturas con Playwright conviene `reducedMotion: 'reduce'`; si no, lo que está fuera de pantalla sale transparente.
- Chromium del contenedor no confiaba en el CA del proxy para sitios externos: se agregó `/root/.ccr/agent-proxy-ca.crt` al almacén NSS (`certutil -A -d sql:/root/.pki/nssdb -n ccr-agent-proxy -t "C,," -i …`).

- `ESQUEMA.sql`, `db:migrate`, `db:seed-admin`, los helpers de `db.ts` y el login de punta a punta pasan tanto en **MySQL 8.0.46** como en **MariaDB 10.11.14**, ambos con la zona global en -05:00. En MySQL hay 21 avisos inofensivos de «display width deprecated» por `TINYINT(1)`. El SQL del código evita la sintaxis exclusiva de MySQL 8 (se usa `VALUES()` en `ON DUPLICATE KEY UPDATE`).
- `next start` pone `x-forwarded-for` solo si no llega, y **no limpia** lo que manda el visitante. Por eso `getClientIp()` toma la IP desde la derecha (`TRUSTED_PROXY_HOPS`). Cómo verificarlo en Hostinger: en `/admin/diagnostico`, `x-forwarded-for` debería terminar en tu IP real. Si hay dos IPs de Hostinger al final, poner `TRUSTED_PROXY_HOPS=2`. Revisar también que la respuesta traiga `Strict-Transport-Security`.
- La compresión de Next no comprime `text/event-stream`, así que SSE no queda retenido por gzip.
- El contenedor de Claude bloquea los dominios de YouTube, por eso la miniatura sale rota en las capturas locales. En Hostinger debería cargar.
- Next.js inyecta su propio `role="alert"` (route announcer). En los tests hay que buscar el texto del mensaje, no el rol.
- `getSiteConfig()` y las páginas con `revalidate` guardan caché 5 min también entre builds (`.next/cache`): un cambio hecho directo en phpMyAdmin tarda hasta 5 min en verse. Lo que se guarda desde el panel se ve al instante (`revalidateTag`).
- `npm run build` genera en el momento las páginas en caché (inicio, reuniones, sitemap…) y para eso **necesita la BD**. En Hostinger el build corre donde la BD es accesible; si algún día falla con `ECONNREFUSED`, es eso.
- `npm audit` marca `postcss` dentro de Next (solo se usa al compilar nuestro propio CSS). La corrección que propone es pasar a Next 16, que el stack no permite; no afecta al sitio en producción. Revisar cuando salga un parche para 15.x.
- En el contenedor de Claude el MySQL local a veces se reinicia (recuperación «XA crash recovery»): `service mysql start` y listo.
- Para escribir texto con tildes desde la terminal: `mysql --default-character-set=utf8mb4`. Sin eso, el cliente guarda «jÃ³venes». phpMyAdmin no tiene ese problema.

## Cómo probar en local (contenedor de Claude)

MySQL 8 local con la BD `ibr_dev`, el usuario `ibr` y `.env.local` apuntando a `127.0.0.1`. En cada sesión nueva hay que reinstalarlo (`apt-get install mysql-server-8.0`), crear la BD y el usuario, y correr `npm run db:migrate` y `npm run db:seed-admin -- --email=admin@ibr.test --nombre="Admin Pruebas" --generar`. Conviene poner el servidor en `SET GLOBAL time_zone='-05:00'` para detectar errores de zona horaria.

Para probar en MariaDB sin chocar con MySQL: `apt-get download mariadb-server-core mariadb-client-core libmariadb3 liburing2`, extraer con `dpkg -x` en el scratchpad, `mariadb-install-db` y `mariadbd` en el puerto 3307 con socket corto (`/tmp/ibr-mdb.sock`; las rutas largas pasan el límite de 107 caracteres). Después, `DATABASE_URL=mysql://…@127.0.0.1:3307/… npm run db:migrate`.

## Qué hacer en la próxima sesión

1. Ejecutar PASO 0 de `CLAUDE.md`.
1. Copia de prueba **en línea** desde el 2026-10-07: https://ibr.pixeliacomsoluciones.es (versión `6456295`, BD con las migraciones 000–011, robots y `noindex` verificados, 59 páginas generadas). La publica la sesión local de Cristian (`DESPLIEGUE.md`). Falta: (a) el primer administrador (`db:seed-admin --generar`, lo corre Cristian), (b) el despliegue automático (GitHub de hPanel no ve `75BOSS/IBR`, ver `DESPLIEGUE.md` §D; mientras, se sube como zip), (c) `/admin/diagnostico` → «Probar SSE» (F0.9).
2. Si ya hay credenciales de Hostinger: F0.8 (web app → `dev`), `npm run db:migrate` contra la BD nueva (aplica `000` a `010`), crear el primer admin y correr `/admin/diagnostico` (F0.9). Cargar `NEXT_PUBLIC_SITE_URL` con `https://` (sitemap, OG, correos y QR la usan).
3. Si ya está el dump del PHP: reconciliar `ESQUEMA.sql` §«Tablas heredadas» (MIGRACION-PHP.md §1) **antes** de aplicarlo en Hostinger, y escribir `scripts/importar-php.ts`.
4. Al cerrar F0: borrar `/api/ping-sse` y `/admin/diagnostico`.
5. Con SMTP real: mandar una agenda de prueba a un correo propio y revisar que no caiga en spam (SPF/DKIM del dominio en Hostinger).
6. Con WhatsApp configurado: probar las dos plantillas con un número propio.
7. Con el contenido real cargado: repetir `npm run revisar` a 360/768 sobre `dev.ibriglesia.com` y probar un envío real de cada formulario.
