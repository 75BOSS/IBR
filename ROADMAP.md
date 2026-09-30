# ROADMAP.md — Web IBR

Criterio de éxito de F1: un desconocido en Riobamba entra desde WhatsApp en su celular, sabe a qué hora y dónde ir, deja sus datos como nuevo, encuentra un grupo de su edad y ve la última prédica. Un hermano sin conocimientos técnicos puede publicar un evento y una prédica desde el admin.

Cada fase termina con: deploy en `main`, `ESTADO.md` actualizado, checklist de la fase marcada.

---

## F0 — Cimientos (1 semana)

- [x] Repo GitHub `pixelia/ibr-web`, ramas `main` y `dev`, `.env.example`, README corto. _(repo real: `75BOSS/IBR`; ver ESTADO.md 2026-09-30)_
- [x] `create-next-app` (TS, Tailwind, App Router, `src/`), ESLint, Prettier.
- [x] `src/lib/db.ts` con pool `mysql2` y helper `query<T>()`; `scripts/migrate.ts`.
- [ ] Aplicar `sql/ESQUEMA.sql` en la BD de Hostinger (vacía) y correr `MIGRACION-PHP.md` §2 (importar datos heredados).
- [x] Auth admin: `iron-session`, tabla `usuarios_admin`, login, middleware que protege `/admin/*`, seed del primer admin por script.
- [x] Layout público (header con 6 entradas: Inicio · Soy nuevo · Reuniones · Grupos · Prédicas · Dar; footer con redes, dirección, WhatsApp) y layout admin (sidebar).
- [x] Componentes base: `Field`, `Button`, `Card`, `YouTubeEmbed`, `MapEmbed`, `WhatsAppButton`, `Tag`.
- [ ] Web app creada en Hostinger apuntando a `dev`; primer deploy verde; `dev.ibriglesia.com` funcionando.
- [ ] Prueba: SSE detrás del proxy de Hostinger (`/api/ping-sse`) — anotar resultado en `ESTADO.md`. Si falla, todo "en vivo" será polling.

## F1 — Web que sirve (4–5 semanas)

### Contenido y configuración
- [x] Tabla `config` + pantalla `/admin/config`: dirección, teléfono/WhatsApp, correo, cuentas bancarias, canal YouTube, redes, textos de home.
- [x] `equipo` + `/admin/equipo` (pastores y líderes con foto en Cloudinary).

### Público
- [ ] `/` Home: hero con foto real + 3 accesos (Soy nuevo · Horarios · Grupos), próximos 3 eventos, última prédica, pastores, bloque de oración, mapa, botón WhatsApp.
- [x] `/reuniones`: horarios por día desde `reuniones`, dirección, mapa embebido, "cómo llegar", opción En línea.
- [ ] `/soy-nuevo`: qué esperar, ministerios por rango de edad, formulario → `registros` (origen=web, decidio_seguir, como_llego, peticion, acepta_datos). Correo de aviso al responsable configurado.
- [ ] `/grupos`: directorio público filtrable por zona (ubicación), día, rango de edad y tipo; solo grupos `publico=1 AND activo=1`. `/grupos/[id]`: ficha + "Quiero unirme" → `solicitudes_grupo` + aviso al líder por correo.
- [x] `/predicas`: grilla desde `predicas`, filtro por serie y predicador, `YouTubeEmbed`. Botón "En vivo" que aparece si `config.en_vivo_activo=1` o dentro del horario de culto.
- [ ] `/dar`: cuentas bancarias, QR, texto pastoral. Sin pasarela en F1.
- [ ] `/oracion`: formulario corto → `peticiones` (es_privada).
- [ ] `/contacto`: formulario → `contactos`, redes, mapa, WhatsApp.
- [ ] Páginas legales: `/privacidad` (política de datos, obligatoria por el consentimiento).
- [ ] `sitemap.xml`, `robots.txt`, Metadata/OG por página, favicon, manifest básico.

### Admin
- [ ] `/admin` dashboard: registros nuevos esta semana, solicitudes pendientes, peticiones sin atender, próximos eventos.
- [ ] `/admin/registros`: lista, filtro por origen/estado, cambiar estado, exportar CSV.
- [ ] `/admin/grupos`: CRUD completo (reemplaza al PHP), toggle público, asignar líder y ubicación; bandeja de `solicitudes_grupo` con estados.
- [x] `/admin/reuniones`: CRUD horarios. _(+ `/admin/ubicaciones` «Lugares», ver ESTADO.md)_
- [x] `/admin/predicas`: pegar link de YouTube → se extrae `youtube_id`, se trae título/miniatura vía YouTube Data API (o manual si no hay key).
- [ ] `/admin/eventos`: CRUD básico (sin inscripción aún), imagen en Cloudinary, `publicado`.
- [ ] `/admin/peticiones`: lista, marcar atendida.
- [ ] Rate limit + honeypot en todos los formularios públicos.

### Cierre F1
- [ ] Cargar contenido real (fotos, horarios, dirección, pastores, cuentas).
- [ ] Revisión en celular 360px de todas las páginas.
- [ ] Apagar el PHP de grupos (dejar solo lectura) — ver `MIGRACION-PHP.md` §4.
- [ ] Cambio de DNS: `ibriglesia.com` → web app `main`. Website Builder se apaga después de 48 h sin incidencias.
- [ ] Redirección de `ibrcomunidad.com` y unificación de correo.

## F2 — Comunidad (+4 semanas)

- [ ] `/nosotros` completo: historia, visión, en qué creemos, equipo.
- [ ] Eventos con inscripción: `inscripciones`, cupo, confirmación por correo, contador de cupo con polling/SSE cada 15 s, página por evento con OG para compartir.
- [ ] Ministerios por rango de edad: `/ministerios/[slug]` con sus reuniones y grupos.
- [ ] `/servir`: `areas_servicio` + `voluntarios`.
- [ ] Suscripción a agenda semanal (`suscriptores`) + envío manual desde admin.
- [ ] Aviso al líder por WhatsApp Cloud API cuando entra una solicitud a su grupo (patrón webhook ya usado en Pixelia).
- [ ] Noticias / categorías en eventos (Noticias · Oración · Comunidad · Música · Capacitación).
- [ ] Roles en admin: `admin` y `editor` (editor no toca config ni usuarios).

## F3 — Plataforma (según demanda)

- [ ] Cuenta de miembro (login con celular + código por WhatsApp): mis grupos, mis inscripciones.
- [ ] Check-in por QR en eventos con tablero para ujieres — evaluar Supabase Realtime vs polling según prueba SSE de F0.
- [ ] Formación: cursos por módulos con inscripción (modelo Alpha / bautismo / escuela de líderes).
- [ ] PWA instalable + notificaciones push (OneSignal o Web Push).
- [ ] Pasarela PayPhone en `/dar` (diezmo / ofrenda / proyecto).
- [ ] Panel de métricas: registros por origen, asistencia a grupos, crecimiento mensual.

---

## Endpoints públicos permitidos (sin auth)

| Ruta | Método | Uso |
|---|---|---|
| `/api/en-vivo` | GET | `{ activo: boolean, youtube_id }` para el botón En vivo |
| `/api/eventos/[id]/cupo` | GET | `{ cupo, inscritos }` para el contador (F2) |
| `/api/ping-sse` | GET | prueba de SSE en F0; borrar después |

Todo lo demás son server actions o rutas bajo auth.
