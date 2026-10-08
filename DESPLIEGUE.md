# DESPLIEGUE.md — Copia de prueba en ibr.pixeliacomsoluciones.es

Guía para la sesión de Claude Code que tiene acceso a Hostinger (la sesión local de Cristian).
El código se trabaja en la rama `dev` de `75BOSS/IBR`; esta guía la publica en un subdominio de
Pixelia para que la iglesia la pruebe. La copia de prueba sale con `noindex` automáticamente
(solo `ibriglesia.com` se indexa: `PRODUCTION_HOSTS` en `src/lib/site.ts`).

## A. Primera vez (una sola vez)

1. **Plan**: confirmar que la cuenta de Hostinger tiene web apps de Node.js (Business o Cloud).
2. **Base de datos**: crear en hPanel → Bases de datos → MySQL una BD nueva (ej. `ibr_prueba`).
   Anotar host remoto, usuario, contraseña y nombre. Activar «MySQL remoto» para la IP desde
   donde se corre el paso 4 (o «cualquier host» mientras dure la prueba).
3. **Web app Node.js** en hPanel → Sitios web → Agregar → Web app de Node.js:
   - Repositorio GitHub `75BOSS/IBR`, rama **`dev`**, **despliegue automático al hacer push: activado**.
     Ojo: la conexión de GitHub de hPanel es de la cuenta *PixeliacomSoluciones* y no ve
     `75BOSS/IBR`. Mientras no tenga acceso (ver «D»), se sube el código como zip en cada cambio.
   - Preset Next.js · Node 22 · Build `npm run build` · Package manager npm · Output `.next`.
   - Dominio: subdominio **`ibr.pixeliacomsoluciones.es`** (si el dominio está en esta cuenta,
     el DNS se crea solo; si no, un registro CNAME/A según indique hPanel).
   - Variables de entorno (mínimas para que funcione):
     - `NEXT_PUBLIC_SITE_URL=https://ibr.pixeliacomsoluciones.es`
     - `DATABASE_URL=mysql://USUARIO:CLAVE@127.0.0.1:3306/NOMBRE_BD` dentro de Hostinger (así lo
       recomienda Hostinger); desde fuera, el host remoto que muestra hPanel. Caracteres
       especiales de la clave en `%XX`.
     - `SESSION_SECRET=` 32+ caracteres aleatorios (`openssl rand -base64 48`)
     - `TRUSTED_PROXY_HOPS=1`
     - Opcionales (sin ellas el sitio funciona, pero no sube fotos ni manda correos/WhatsApp):
       `CLOUDINARY_*`, `SMTP_*`, `WHATSAPP_*`, `YOUTUBE_API_KEY` (ver `.env.example`).
4. **Tablas ANTES del primer build** (el build consulta la BD para prerenderizar). Desde la
   carpeta del proyecto, con la rama `dev` al día:
   ```
   git fetch origin dev && git checkout dev && git pull
   npm ci
   DATABASE_URL='mysql://…' npm run db:migrate
   DATABASE_URL='mysql://…' npm run db:seed-admin -- --email=CORREO --nombre="NOMBRE" --generar
   ```
   `--generar` crea una contraseña segura y la muestra una sola vez en la terminal de quien lo
   corre (Cristian): nadie la escribe en un chat. Se cambia desde el panel en «Mi cuenta».
   Nunca subir la `DATABASE_URL` al repo (va en `.env.local`, que git ignora).
5. **Primer deploy**: lanzarlo desde hPanel (o el conector) y revisar el log de build.
6. **Verificar**: abrir `https://ibr.pixeliacomsoluciones.es`, `/robots.txt` (debe decir
   `Disallow: /`), entrar a `/admin/login` y correr `/admin/diagnostico` → «Probar SSE».
   Anotar el resultado en `ESTADO.md`.

## B. Cada vez que haya cambios nuevos en `dev`

Con el despliegue automático activado, **no hay que hacer nada**: cada push a `dev` compila y
publica solo. Sin él: `git pull` de `dev` en el clon local y volver a subir el código (zip) a
la web app. Dos casos piden un paso extra:

- **Hay migraciones nuevas** (`sql/migraciones/0NN_*.sql` que la BD de prueba no tiene): correr
  `DATABASE_URL='mysql://…' npm run db:migrate` **antes** de que termine el build
  (`npm run db:migrate -- --estado` muestra las pendientes).
- **El build falló**: leer el log en hPanel, corregir la causa en el código (no en el servidor),
  subir el arreglo a `dev`.

## C. Si falla algo conocido

- `ECONNREFUSED` o `Access denied` en el build: la web app no llega a la BD (host, usuario o
  MySQL remoto). El build necesita la BD.
- Login que no guarda la sesión: falta `SESSION_SECRET` o `NEXT_PUBLIC_SITE_URL` no es `https://`.
- Panel que entra pero «Resumen» dice «No pudimos cargar esta pantalla»: la BD tiene vistas
  creadas por «MySQL remoto» cuyo dueño (`usuario@IP`) ya no existe. Correr `npm run db:migrate`
  (la migración 013 las borra; el código ya no las usa). Regla: no crear vistas, triggers ni
  procedimientos en la BD, por la misma razón.
- Rate limit que bloquea a todos con la misma IP: ajustar `TRUSTED_PROXY_HOPS` mirando
  `x-forwarded-for` en `/admin/diagnostico` (debe terminar en la IP real del visitante).

## D. Activar el despliegue automático

La web app solo puede seguir un repositorio que vea la cuenta de GitHub conectada en hPanel
(*PixeliacomSoluciones*). Opciones, de la más simple a la más definitiva:

1. En GitHub, con la cuenta **75BOSS**: `75BOSS/IBR` → Settings → Collaborators → invitar a
   *PixeliacomSoluciones*; aceptar la invitación con esa cuenta y volver a hPanel → Git.
2. Si hPanel sigue sin verlo (la app de GitHub de Hostinger se instala por dueño, no por
   colaborador): transferir el repositorio a *PixeliacomSoluciones* (Settings → Danger zone →
   Transfer). GitHub redirige la URL vieja; la sesión de Claude en la nube necesita que se le
   agregue el repositorio nuevo.

