# Web IBR — Iglesia Bíblica Riobamba

Sitio público, panel admin y API mínima de [ibriglesia.com](https://ibriglesia.com). Desarrolla Grupo Pixelia.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · MySQL de Hostinger (`mysql2`, sin ORM) · Zod · iron-session · Cloudinary · Nodemailer.

## Empezar

```bash
cp .env.example .env.local   # completar DATABASE_URL y SESSION_SECRET como mínimo
npm install
npm run db:migrate           # aplica sql/ESQUEMA.sql y sql/migraciones/ pendientes
npm run db:seed-admin -- --email=tu@correo.com --nombre="Tu Nombre"   # crea el primer admin
npm run dev                  # http://localhost:3000  ·  admin en /admin
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor local en el puerto 3000 |
| `npm run build` | Build de producción (lo que corre Hostinger) |
| `npm run lint` | ESLint + verificación de tipos |
| `npm run format` | Prettier sobre todo el proyecto |
| `npm run db:migrate` | Aplica migraciones pendientes |
| `npm run db:seed-admin` | Crea o reactiva un usuario admin |

## Ramas y deploy

- `main` → producción (`ibriglesia.com`)
- `dev` → pruebas (`dev.ibriglesia.com`)

Hostinger compila automáticamente al recibir push en cada rama (preset Next.js, Node 22, `npm run build`).

## Documentación del proyecto

- [`CLAUDE.md`](CLAUDE.md) — reglas, stack y estructura (leer primero)
- [`ROADMAP.md`](ROADMAP.md) — fases y checklist
- [`ESTADO.md`](ESTADO.md) — estado actual, decisiones y pendientes
- [`MIGRACION-PHP.md`](MIGRACION-PHP.md) — cómo se reemplaza el sistema PHP de grupos
- [`sql/ESQUEMA.sql`](sql/ESQUEMA.sql) — esquema completo de la base de datos
