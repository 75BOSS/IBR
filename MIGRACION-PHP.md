# MIGRACION-PHP.md — Del sistema PHP de grupos al stack Node

Situación: existe un sistema PHP/MySQL funcionando con grupos, ubicaciones, registros y rangos de edad (con opción de registro). No se reescribe de golpe: se importa su base, se reemplaza módulo por módulo desde el admin Next.js, y se apaga cuando `/admin/grupos` y `/admin/registros` estén en producción.

Regla: **el PHP no se modifica.** Se lee su BD, se mapea, se importa. Si algo del PHP hace falta y no está en el esquema nuevo, se agrega al esquema nuevo.

---

## §1 Reconciliación de esquema (antes de aplicar ESQUEMA.sql)

1. Obtener el dump del PHP:
   ```bash
   mysqldump -h HOST -u USER -p --no-data BD_PHP > sql/legado/estructura_php.sql
   mysqldump -h HOST -u USER -p BD_PHP > sql/legado/datos_php_$(date +%F).sql
   ```
   (o phpMyAdmin → Exportar → Personalizado → estructura y datos por separado).
2. Anotar en la tabla de mapeo de abajo cada columna real del PHP. Marcar con `NUEVA` lo que no existe en el PHP y con `DESCARTAR` lo del PHP que no se migra.
3. Si el PHP tiene una tabla o columna con información que el esquema nuevo no contempla (ej. `asistencias`, `notas_lider`, `estado_civil`), **agregarla a ESQUEMA.sql** antes de aplicar. No se pierde información en la migración.
4. Recién entonces aplicar `ESQUEMA.sql` en la BD nueva (vacía).

### Tabla de mapeo (llenar con el dump real)

| Tabla nueva | Columna nueva | Tabla PHP | Columna PHP | Transformación |
|---|---|---|---|---|
| rangos_edad | id | ? | ? | directo |
| rangos_edad | nombre | ? | ? | |
| rangos_edad | slug | — | NUEVA | `slugify(nombre)` |
| rangos_edad | edad_min / edad_max | ? | ? | |
| ubicaciones | id, nombre, direccion | ? | ? | |
| ubicaciones | tipo | ? | ? | si no existe: `'casa'` por defecto, `'sede'` para el auditorio |
| ubicaciones | zona | ? | ? | |
| ubicaciones | publica | — | NUEVA | `0` por defecto (casas no se publican) |
| grupos | id, nombre, descripcion | ? | ? | |
| grupos | rango_edad_id, ubicacion_id | ? | ? | verificar FKs huérfanas antes |
| grupos | dia_semana | ? | ? | si viene texto ('Lunes'): mapear a 1..7 |
| grupos | hora | ? | ? | `TIME` |
| grupos | lider_nombre / lider_telefono | ? | ? | ¿el PHP tiene tabla `lideres` o `usuarios`? si sí, JOIN |
| grupos | publico | — | NUEVA | `1` para activos, revisar a mano antes del lanzamiento |
| registros | nombres / apellidos | ? | ? | si el PHP tiene `nombre_completo`: split por primer espacio, revisar a mano |
| registros | telefono | ? | ? | normalizar a `09XXXXXXXX` / `+5939XXXXXXXX` |
| registros | rango_edad_id | ? | ? | si el PHP guarda edad numérica: calcular rango |
| registros | origen | — | NUEVA | `'presencial'` para todo lo importado |
| registros | estado | ? | ? | mapear estados del PHP; si no hay: `'integrado'` si tiene grupo, si no `'contactado'` |
| registros | grupo_id | ? | ? | ¿relación N:M en el PHP (`grupo_miembros`)? ver §1.1 |
| registros | acepta_datos | — | NUEVA | `0` (no hay evidencia de consentimiento previo) |

### §1.1 Si el PHP tiene miembros por grupo (N:M)

Si existe algo como `grupo_miembros (grupo_id, registro_id, fecha_ingreso)`, no se aplana a `registros.grupo_id`. Se agrega a ESQUEMA.sql:

```sql
CREATE TABLE grupo_miembros (
  grupo_id    INT UNSIGNED NOT NULL,
  registro_id INT UNSIGNED NOT NULL,
  rol         ENUM('miembro','anfitrion','lider','colider') NOT NULL DEFAULT 'miembro',
  desde       DATE NULL,
  hasta       DATE NULL,
  PRIMARY KEY (grupo_id, registro_id),
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE,
  FOREIGN KEY (registro_id) REFERENCES registros(id) ON DELETE CASCADE
);
```

y `registros.grupo_id` se elimina del esquema.

---

## §2 Importación de datos

Orden por dependencias: `rangos_edad` → `ubicaciones` → `grupos` → `registros` → (`grupo_miembros`).

Script `scripts/importar-php.ts`:
- Lee de la BD PHP (segunda conexión `LEGACY_DATABASE_URL`, solo lectura).
- Escribe en la BD nueva con `INSERT ... ON DUPLICATE KEY UPDATE` para poder re-ejecutar.
- Mantiene los `id` originales (no re-numerar: hay links y referencias en WhatsApp/impresos).
- Normaliza los teléfonos al formato del sitio (`0991234567`, con `normalizeEcuadorWhatsapp()` y quitando el `593`): «Mi cuenta» y las búsquedas por WhatsApp comparan el texto exacto; un `+593 99…` o con espacios no se encontraría.
- Registra en `sql/legado/importacion_log.md`: filas leídas, insertadas, descartadas y por qué.
- Ejecutar primero en `dev`, revisar en `/admin`, luego en producción la noche antes del corte.

Validaciones post-importación (queries en el mismo script, deben dar 0):
```sql
SELECT COUNT(*) FROM grupos g LEFT JOIN rangos_edad r ON r.id=g.rango_edad_id WHERE g.rango_edad_id IS NOT NULL AND r.id IS NULL;
SELECT COUNT(*) FROM grupos g LEFT JOIN ubicaciones u ON u.id=g.ubicacion_id WHERE g.ubicacion_id IS NOT NULL AND u.id IS NULL;
SELECT COUNT(*) FROM registros WHERE nombres = '' OR nombres IS NULL;
SELECT telefono, COUNT(*) c FROM registros WHERE telefono IS NOT NULL GROUP BY telefono HAVING c > 1;  -- duplicados a revisar
```

---

## §3 Convivencia durante F1

| Qué | Dónde vive | Hasta cuándo |
|---|---|---|
| Sitio público nuevo | `dev.ibriglesia.com` (F0–F1) → `ibriglesia.com` (cierre F1) | permanente |
| Admin nuevo | `ibriglesia.com/admin` | permanente |
| PHP de grupos | `sistema.ibriglesia.com` (mover del hosting actual si está en otro lado) | fin de F1 |
| BD PHP | la actual | fin de F1; luego solo lectura 30 días, luego backup y borrar |
| BD nueva | MySQL del plan Business/Cloud | permanente |

Durante F1 **no hay doble escritura**: los hermanos siguen usando el PHP para grupos hasta el día del corte; la web nueva solo lee grupos importados (se re-importa antes del corte). Los registros nuevos desde la web sí van directo a la BD nueva. El día del corte se corre `importar-php.ts` por última vez y se apaga el PHP.

---

## §4 Corte (checklist)

- [ ] `/admin/grupos` y `/admin/registros` probados por la persona que hoy usa el PHP; firma "puedo hacer todo lo que hacía".
- [ ] Re-importación final (`importar-php.ts`) fuera de horario de uso.
- [ ] Validaciones §2 en 0.
- [ ] Redirección 301 de `sistema.ibriglesia.com/*` → `ibriglesia.com/admin`.
- [ ] Credenciales del PHP revocadas; BD PHP en solo lectura (`GRANT SELECT`).
- [ ] Backup final de la BD PHP en `sql/legado/` y en el Drive de la iglesia.
- [ ] Nota en `ESTADO.md`: fecha de corte, filas migradas, incidencias.
- [ ] 30 días después: borrar la BD PHP y el subdominio.

---

## §5 Lo que se gana y lo que hay que reponer

Al pasar del PHP al admin Next.js hay que garantizar paridad funcional. Llenar esta tabla con lo que hace el PHP hoy (revisar cada pantalla del PHP y anotar):

| Función del PHP | ¿Existe en ROADMAP F1? | Notas |
|---|---|---|
| Listar / crear / editar grupos | Sí (`/admin/grupos`) | |
| Asignar ubicación y rango de edad | Sí | |
| Registrar persona (formulario) | Sí (`/admin/registros` + `/soy-nuevo`) | |
| Filtrar registros por rango de edad | Sí | |
| ? | ? | completar con el PHP abierto al lado |
