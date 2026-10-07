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
   - Preset Next.js · Node 22 · Build `npm run build` · Package manager npm · Output `.next`.
   - Dominio: subdominio **`ibr.pixeliacomsoluciones.es`** (si el dominio está en esta cuenta,
     el DNS se crea solo; si no, un registro CNAME/A según indique hPanel).
   - Variables de entorno (mínimas para que funcione):
     - `NEXT_PUBLIC_SITE_URL=https://ibr.pixeliacomsoluciones.es`
     - `DATABASE_URL=mysql://USUARIO:CLAVE@HOST:3306/NOMBRE_BD` (caracteres especiales de la clave en `%XX`)
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
   `--generar` imprime una contraseña temporal una sola vez: dársela a Cristian por un canal
   privado; se cambia desde el panel en «Mi cuenta». Nunca subir la `DATABASE_URL` al repo.
5. **Primer deploy**: lanzarlo desde hPanel (o el conector) y revisar el log de build.
6. **Verificar**: abrir `https://ibr.pixeliacomsoluciones.es`, `/robots.txt` (debe decir
   `Disallow: /`), entrar a `/admin/login` y correr `/admin/diagnostico` → «Probar SSE».
   Anotar el resultado en `ESTADO.md`.

## B. Cada vez que haya cambios nuevos en `dev`

Con el despliegue automático activado, **no hay que hacer nada**: cada push a `dev` compila y
publica solo. Solo dos casos piden un paso extra:

- **Hay migraciones nuevas** (`sql/migraciones/0NN_*.sql` que la BD de prueba no tiene): correr
  `DATABASE_URL='mysql://…' npm run db:migrate` **antes** de que termine el build
  (`npm run db:migrate -- --estado` muestra las pendientes).
- **El build falló**: leer el log en hPanel, corregir la causa en el código (no en el servidor),
  subir el arreglo a `dev`.

## C. Si falla algo conocido

- `ECONNREFUSED` o `Access denied` en el build: la web app no llega a la BD (host, usuario o
  MySQL remoto). El build necesita la BD.
- Login que no guarda la sesión: falta `SESSION_SECRET` o `NEXT_PUBLIC_SITE_URL` no es `https://`.
- Rate limit que bloquea a todos con la misma IP: ajustar `TRUSTED_PROXY_HOPS` mirando
  `x-forwarded-for` en `/admin/diagnostico` (debe terminar en la IP real del visitante).
