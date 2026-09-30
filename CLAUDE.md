# CLAUDE.md — Web IBR (Iglesia Bíblica Riobamba)

Proyecto: sitio público + panel admin + API de la Iglesia Bíblica Riobamba (ibriglesia.com).
Cliente: hermanos de la iglesia. Desarrolla: Grupo Pixelia (Riobamba, Ecuador).
Idioma del código: inglés en identificadores; español en UI, comentarios de dominio, commits y docs.

## PASO 0 — Antes de escribir código

1. Leer este archivo completo, luego `ROADMAP.md`, `ESTADO.md`, `sql/ESQUEMA.sql` y `MIGRACION-PHP.md`.
2. Si existe código, leer `src/lib/db.ts`, `src/lib/auth.ts` y un módulo ya hecho (ej. `src/app/(admin)/admin/predicas`) y copiar sus patrones. No inventar una segunda forma de hacer lo mismo.
3. Actualizar `ESTADO.md` al terminar cada sesión: qué se hizo, qué quedó a medias, qué se descubrió.
4. Nunca tocar tablas del sistema PHP heredado (`grupos`, `ubicaciones`, `registros`, `rangos_edad`) sin revisar `MIGRACION-PHP.md`.

## Stack (fijo, no cambiar sin decisión explícita)

| Capa | Elección |
|---|---|
| Hosting | Hostinger web app Node.js (plan Business/Cloud). Sin WebSockets entrantes. Sin root. |
| Runtime | Node.js 22 LTS |
| Framework | Next.js 15, App Router, TypeScript estricto |
| UI | Tailwind CSS. Sin librerías de componentes pesadas. |
| BD | MySQL 8 / MariaDB de Hostinger vía `mysql2/promise` con pool. Consultas SQL a mano, parametrizadas. No ORM. |
| Validación | Zod en todo input (server actions y route handlers) |
| Auth admin | Sesiones propias: cookie httpOnly firmada (`iron-session`), password con `bcryptjs` (cost 12) |
| Archivos | Cloudinary (upload firmado desde server action). La BD guarda solo `secure_url` + `public_id`. |
| Correo | Nodemailer + SMTP de Hostinger |
| Tiempo real | Polling con `fetch` o SSE. Nunca Socket.io (no funciona en este hosting). |
| Deploy | GitHub → auto-build de Hostinger. `main` = producción. `dev` = web app en `dev.ibriglesia.com`. |

## Estructura de carpetas

```
src/
  app/
    (public)/            # sitio público, layout con header/footer de la iglesia
      page.tsx           # home
      soy-nuevo/  reuniones/  grupos/  grupos/[id]/  predicas/  dar/  oracion/  eventos/  eventos/[slug]/  nosotros/  servir/  contacto/
    (admin)/admin/       # panel, protegido por middleware
      login/  page.tsx (dashboard)  registros/  grupos/  reuniones/  predicas/  eventos/  peticiones/  equipo/  config/
    api/                 # solo lo que necesite endpoint público (ej. api/en-vivo, api/eventos/[id]/cupo)
  lib/
    db.ts                # pool mysql2 + helper query<T>()
    auth.ts              # getSession(), requireAdmin()
    validators/          # esquemas Zod por entidad
    mail.ts  cloudinary.ts  youtube.ts
  components/            # ui compartida (Button, Field, Card, YouTubeEmbed, MapEmbed, WhatsAppButton)
  actions/               # server actions por entidad: registros.ts, grupos.ts, predicas.ts...
sql/
  ESQUEMA.sql            # esquema completo, versionado
  migraciones/           # 001_xxx.sql en orden; nunca editar una migración ya aplicada
```

## Reglas de código

- Toda consulta: `await query<Row>('SELECT ... WHERE id = ?', [id])`. Prohibido interpolar strings en SQL.
- Toda escritura desde el sitio público pasa por un server action con: Zod → honeypot (`campo "website"` debe venir vacío) → rate limit por IP (tabla `rate_limits`, 5 envíos / 10 min) → insert → correo/WhatsApp si aplica.
- Consentimiento de datos: checkbox obligatorio `acepta_datos`; se guarda con fecha e IP.
- Secretos solo en variables de entorno de Hostinger (`DATABASE_URL`, `SESSION_SECRET`, `CLOUDINARY_*`, `SMTP_*`, `YOUTUBE_API_KEY`). `.env.example` en el repo, `.env*` en `.gitignore`.
- Páginas públicas: `export const revalidate = 300` por defecto; eventos y prédicas usan `revalidatePath` desde el admin al guardar.
- Metadata API en cada página pública (title, description, openGraph con imagen) — los links se comparten por WhatsApp.
- Fechas en BD en UTC (`DATETIME`); mostrar en `America/Guayaquil` con `Intl.DateTimeFormat`.
- Mobile first. Probar cada página a 360px de ancho antes de dar por terminada.
- Accesibilidad mínima: labels reales en formularios, foco visible, contraste AA.
- Commits en español, imperativo: `agrega directorio público de grupos`.

## Lo que NO se hace

- No instalar Prisma, Drizzle, NextAuth, tRPC ni shadcn sin decisión explícita en `ESTADO.md`.
- No guardar archivos en el filesystem de la app (el build los borra).
- No consumir la API de YouTube en cada request: se cachea en tabla `predicas` o en `unstable_cache` 1 h.
- No exponer `/api/*` sin auth salvo lo listado en `ROADMAP.md`.
- No modificar el sistema PHP heredado; se lee su BD y se reemplaza módulo por módulo.

## Comandos

```
npm run dev        # local, puerto 3000
npm run build      # lo que corre Hostinger
npm run lint
npm run db:migrate # aplica sql/migraciones pendientes (script propio en scripts/migrate.ts)
```

## Configuración de la web app en Hostinger

- Framework preset: Next.js · Node 22 · Build: `npm run build` · Package manager: npm · Output: `.next`
- Variables de entorno: cargar todas las de `.env.example` en el panel antes del primer deploy.
- BD: crear en hPanel → Bases de datos MySQL; usar el host remoto que muestra el panel en `DATABASE_URL`.
- Deploy desde Claude Code: plugin `hostinger@claude-community` con token API de alcance mínimo (websites + DNS). Ver logs de build ahí mismo si falla.
