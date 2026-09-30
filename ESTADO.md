# ESTADO.md — Web IBR

Última actualización: 2026-09-03 (Cristian / planificación). Claude Code: actualizar este archivo al cierre de cada sesión.

## Fase actual

**F0 — Cimientos.** Nada implementado todavía. Este paquete (CLAUDE.md, ROADMAP.md, ESQUEMA.sql, MIGRACION-PHP.md) es el punto de partida.

## Decisiones tomadas

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-09-03 | Arquitectura B: Node.js gestionado en Hostinger (Business/Cloud) + MySQL de Hostinger | Más opciones de desarrollo y deploy desde Claude Code sin sysadmin; PHP convive en el mismo plan |
| 2026-09-03 | Next.js 15 App Router + TypeScript + Tailwind + mysql2 (sin ORM) | Stack ya probado por Pixelia en el proyecto de la cafetería |
| 2026-09-03 | Sin Socket.io; tiempo real = polling/SSE; Supabase Realtime solo si F3 lo exige | Hostinger Web/Cloud solo permite WebSockets salientes |
| 2026-09-03 | El sistema PHP de grupos se reemplaza módulo por módulo, no se reescribe de golpe | Está funcionando; se importa su BD y se apaga cuando `/admin/grupos` esté listo |
| 2026-09-03 | Archivos en Cloudinary, nunca en el filesystem de la app | El build de Hostinger borra lo que no viene del repo |

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
- [ ] Repo GitHub creado y conectado a la web app de Hostinger
- [ ] Token API de Hostinger (alcance mínimo) en la cuenta de Claude Code de implementación
- [ ] Cuenta Cloudinary (plan gratuito) y credenciales
- [ ] YouTube Data API key (opcional en F1; sin key se llena título a mano)

## Descubrimientos / notas de sesión

_(vacío — Claude Code escribe aquí: resultado de la prueba SSE, columnas reales del PHP, cosas raras del hosting, etc.)_

## Qué hacer en la próxima sesión

1. Ejecutar PASO 0 de `CLAUDE.md`.
2. Arrancar F0 desde el primer checkbox de `ROADMAP.md`.
3. Si ya está el dump del PHP: reconciliar `ESQUEMA.sql` §"Tablas heredadas" antes de aplicar nada.
