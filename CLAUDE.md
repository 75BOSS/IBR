# CLAUDE.md — Web IBR (Iglesia Bíblica Riobamba)

Proyecto: sitio público + panel admin + API de la Iglesia Bíblica Riobamba (ibriglesia.com).
Cliente: hermanos de la iglesia. Desarrolla: Grupo Pixelia (Riobamba, Ecuador).
Idioma del código: inglés en identificadores; español en UI, comentarios de dominio, commits y docs.

## PASO 0 — Antes de escribir código

1. Leer este archivo completo, luego `ROADMAP.md`, `ESTADO.md`, `sql/ESQUEMA.sql` y `MIGRACION-PHP.md`.
2. Si existe código, leer `src/lib/db.ts`, `src/lib/auth.ts`, la sección «Patrones del proyecto» de abajo y un módulo ya hecho (ej. `src/app/(admin)/admin/(panel)/predicas`) y copiar sus patrones. No inventar una segunda forma de hacer lo mismo. El catálogo visual de componentes está en `/admin/componentes`.
3. Actualizar `ESTADO.md` al terminar cada sesión: qué se hizo, qué quedó a medias, qué se descubrió.
4. Nunca tocar tablas del sistema PHP heredado (`grupos`, `ubicaciones`, `registros`, `rangos_edad`) sin revisar `MIGRACION-PHP.md`.

## Reglas Pixelia (se aplican siempre)

1. **Causa raíz, nunca parche del síntoma.** Si algo falla, primero se explica la causa (en el commit o en `ESTADO.md`) y después se arregla donde nace. Nada de `try/catch` que silencie, `!important`, `setTimeout` para "esperar" ni condiciones especiales para un solo caso.
2. **Reutilizar antes que duplicar.** Un componente, función o clase por concepto. Si ya existe algo parecido (en `src/components`, `src/lib`, `src/actions`), se extiende con una prop u opción; no se escribe otro.
3. **Responsive real.** En tablet y celular los componentes, tarjetas y tablas se **redimensionan** (tipografía, padding, columnas y anchos fluidos con `clamp()`/unidades relativas), no solo se reacomodan. Nada obliga a deslizar en exceso: las tablas del admin pasan a filas-tarjeta compactas en celular en vez de scroll horizontal. Breakpoints del proyecto: **360, 768, 1024, 1280** (`xs`, `md`, `lg`, `xl` en Tailwind). Cada página se revisa a 360 px y 768 px antes de darla por terminada.
4. **Las 10 heurísticas de Nielsen, explícitas:**
   - Visibilidad del estado: todo botón que envía muestra carga (`Button` con `pending`), todo guardado confirma con un toast ("Guardado").
   - Prevención de errores: todo borrado o acción irreversible pide confirmación (`ConfirmDialog`); validación en cliente y servidor con el mismo esquema Zod.
   - Consistencia: los mismos botones, campos, tablas y patrones en todo el admin (salen de `src/components`, no se estilan a mano por página).
   - Reconocer antes que recordar: labels visibles siempre; el placeholder es solo un ejemplo, nunca el único texto.
   - Mensajes de error que dicen **qué pasó y cómo arreglarlo** ("El teléfono debe tener 10 dígitos, ej. 0991234567"), junto al campo y en lenguaje humano.
   - Además: lenguaje de la iglesia y no técnico, salida clara (cancelar/volver), atajos solo como extra, diseño sin ruido y ayuda breve donde haga falta.
5. **Diseño con carácter:**
   - Nada de blanco puro (`#fff`): fondos y superficies usan los tokens cálidos del tema.
   - Nada de tarjetas idénticas en cuadrícula: variar jerarquía (destacada + secundarias, tamaños, acentos).
   - Cabeceras de tabla y paneles con color diferenciado; **ningún encabezado de tabla en blanco**.
   - Tipografía con carácter (títulos en serif `Fraunces`, texto en `Figtree`); prohibido usar Inter o Space Grotesk por defecto.

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
    layout.tsx           # raíz: fuentes, metadata base, ToastProvider
    (public)/            # sitio público: layout con header/footer (lee la tabla config)
      page.tsx           # home
      soy-nuevo/  reuniones/  grupos/  grupos/[id]/  predicas/  dar/  oracion/  eventos/  eventos/[slug]/  nosotros/  servir/  contacto/
      [...ruta]/  not-found.tsx   # 404 del sitio con header/footer
    (admin)/admin/       # noindex; middleware exige cookie de sesión
      login/             # sin barra lateral
      error.tsx          # error inesperado del panel (Reintentar)
      (panel)/           # layout con requireAdmin() + AdminNav (barra lateral / cajón)
        page.tsx (resumen)  registros/  grupos/  reuniones/  predicas/  eventos/  peticiones/  equipo/  config/
        componentes/     # catálogo de componentes (referencia, fuera del menú)
        diagnostico/     # TEMPORAL F0: prueba SSE + cabeceras del proxy (borrar al cerrar F0)
        [...ruta]/  not-found.tsx   # 404 dentro del panel
    api/                 # solo lo que necesite endpoint público (ej. api/en-vivo, api/eventos/[id]/cupo)
      ping-sse/          # TEMPORAL F0
  middleware.ts          # filtra /admin/* sin cookie (la autorización real es requireAdmin)
  lib/
    db.ts                # pool mysql2 + query<T>(), queryOne<T>(), execute()  (server-only)
    db-config.ts         # opciones de conexión compartidas con scripts (UTC, TINYINT(1)→boolean)
    env.ts               # requireEnv(): error que explica dónde cargar la variable
    auth.ts              # getSession(), getCurrentAdmin(), requireAdmin()
    session.ts           # opciones de iron-session (usable en middleware)
    password.ts  rate-limit.ts  request.ts (getClientIp)
    config.ts            # getSiteConfig() con caché 5 min, CONFIG_TAG
    nav.ts               # PUBLIC_NAV, ADMIN_NAV (ready:true al terminar cada módulo)
    form-state.ts        # FormState: resultado estándar de server actions
    validators/          # esquemas Zod por entidad
    youtube.ts  maps.ts  whatsapp.ts  dates.ts  site.ts   (mail.ts, cloudinary.ts en F1)
    *.test.ts            # pruebas con node:test (npm test)
  components/            # UI compartida: Button (+ button-styles.ts), Field, Card, Tag, Icon, Toast,
                         # ConfirmDialog, FormAlert, PageHeader, YouTubeEmbed, MapEmbed, WhatsAppButton,
                         # BrandMark, Spinner; site/ (header, menú, pie) y admin/ (AdminNav)
  actions/               # server actions por entidad: auth.ts, registros.ts, grupos.ts, predicas.ts...
scripts/                 # migrate.ts, seed-admin.ts, revisar-responsive.ts, lib/script-db.ts
sql/
  ESQUEMA.sql            # esquema base (se aplica como migración 000_esquema_base)
  migraciones/           # 001_xxx.sql en orden; nunca editar una migración ya aplicada (checksum)
  legado/                # dumps del PHP: ignorados por git (datos personales)
```

## Patrones del proyecto (fijados en F0)

- **Server action de formulario**: firma `(prev: FormState<Campo>, formData: FormData) => Promise<FormState<Campo>>`. En el panel, la primera línea es `await requireAdmin()` (el layout no protege las acciones). Zod con `safeParse` → `fieldErrors: z.flattenError(error).fieldErrors`; devolver `values` para no perder lo escrito; éxito → `{ status: 'success', message: 'Guardado' }` + `revalidatePath`/`revalidateTag`. En el cliente: `useToastAction(action)` (toast «Guardado» dentro de la acción, funciona aunque el formulario se desmonte al revalidar) o `CrudForm` para crear/editar + `Field`/`Button type="submit"` (la carga es automática).
- **Formularios**: siempre `noValidate` (los mensajes son los nuestros, junto al campo, no el globito del navegador); `required` en `Field` solo marca el asterisco y la accesibilidad. Crear → `redirect('/admin/x?aviso=creado')` y la lista muestra `<FlashToast code={aviso} />`.
- **Borrar o desactivar**: siempre `ConfirmDialog` con una action que devuelve `FormState`.
- **Formularios públicos**: Zod → honeypot → `consumeRateLimit('<form>', { ip: await getClientIp() })` → insert → aviso.
- **Menú del panel**: una sola lista `ADMIN_NAV` en `src/lib/nav.ts`; poner `ready: true` al terminar el módulo.
- **Configuración**: leer con `getSiteConfig()`; al guardar en `/admin/config`, `revalidateTag(CONFIG_TAG)`.
- **Colores y tipografía**: solo tokens de `src/app/globals.css` (`bg-surface`, `text-ink-soft`, `text-h2`…). Superficies oscuras: variantes `inverse` de `Button`/`Tag`, nunca pisar clases con `className`.
- **Íconos**: `<Icon name="…">`; para uno nuevo se agrega su SVG al mapa de `src/components/Icon.tsx`.
- **Páginas**: encabezado con `PageHeader`; avisos de formulario/pantalla con `FormAlert`; contenedor `container-page` (sitio) o `container-panel` (panel). Superficies oscuras llevan la clase `on-dark` (anillo de foco claro).
- **Estilos de botón** en Server Components: `buttonClasses()` de `@/components/button-styles` (no de `Button.tsx`, que es cliente).
- **Fechas**: `DATETIME` llega como `Date` (UTC) → `formatDateTime()`; `DATE` llega como `'YYYY-MM-DD'` → `formatDateOnly()`; hoy en Ecuador → `todayInChurchTz()` (`src/lib/dates.ts`).
- **WhatsApp**: guardar y mostrar con `normalizeEcuadorWhatsapp()` / `whatsappHref()` (`src/lib/whatsapp.ts`).
- **Login y límites**: `reserveAttempt()` reserva el intento antes del trabajo caro (con un candado `GET_LOCK` por clave: el tope es exacto) y `release()` lo anula si no debe contar. La IP sale de `getClientIp()` (cuenta `TRUSTED_PROXY_HOPS` desde la derecha de X-Forwarded-For; IPv6 se agrupa por /64). Cerrar sesión o cambiar contraseña sube `usuarios_admin.sesion_version` y corta todas las sesiones.
- **Middleware**: deja pasar las server actions (`next-action`); por eso `requireAdmin()` es obligatorio dentro de cada acción del panel.
- **Scripts de terminal** importan `@/lib/db-config` y `@/lib/env`, nunca `@/lib/db` (es `server-only`).

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
npm run dev              # local, puerto 3000
npm run build            # lo que corre Hostinger
npm run lint             # ESLint sin warnings + tsc --noEmit
npm test                 # pruebas node:test (src/**/*.test.ts)
npm run format           # Prettier
npm run db:migrate       # aplica sql/ESQUEMA.sql y sql/migraciones pendientes (-- --estado | -- --marcar-base)
npm run db:seed-admin -- --email=x@y.com --nombre="Nombre" [--rol=editor] [--generar]
npm run revisar -- --base=http://localhost:3000 --rutas=/,/grupos   # capturas 360/768/1280 + desborde horizontal
REVISAR_EMAIL=… REVISAR_PASSWORD=… npm run probar:login -- --base=http://localhost:3000   # acceso al panel de punta a punta
```

## Configuración de la web app en Hostinger

- Framework preset: Next.js · Node 22 · Build: `npm run build` · Package manager: npm · Output: `.next`
- Variables de entorno: cargar todas las de `.env.example` en el panel antes del primer deploy.
- BD: crear en hPanel → Bases de datos MySQL; usar el host remoto que muestra el panel en `DATABASE_URL`.
- Deploy desde Claude Code: plugin `hostinger@claude-community` con token API de alcance mínimo (websites + DNS). Ver logs de build ahí mismo si falla.
