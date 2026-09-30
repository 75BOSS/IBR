/**
 * npm run db:migrate                → aplica sql/ESQUEMA.sql (base) y sql/migraciones/ pendientes
 * npm run db:migrate -- --estado    → solo muestra qué está aplicado y qué falta
 * npm run db:migrate -- --marcar-base
 *     → registra ESQUEMA.sql como aplicado SIN ejecutarlo (cuando se aplicó a mano en phpMyAdmin)
 *
 * Reglas: una migración aplicada no se edita nunca (se verifica por checksum); los cambios
 * nuevos van en sql/migraciones/NNN_descripcion.sql, en orden.
 */
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import type { RowDataPacket } from 'mysql2';
import { describeTarget, fail, openScriptConnection } from './lib/script-db';

const ROOT = process.cwd();
const BASE_NAME = '000_esquema_base';
const BASE_FILE = path.join(ROOT, 'sql', 'ESQUEMA.sql');
const MIGRATIONS_DIR = path.join(ROOT, 'sql', 'migraciones');
const NAME_PATTERN = /^(\d{3})_[a-z0-9_]+\.sql$/;

type Migration = { name: string; file: string; sql: string; checksum: string };

async function loadMigration(name: string, file: string): Promise<Migration> {
  // Checksum sobre LF para que un checkout en Windows (CRLF) no parezca una edición.
  const sql = (await readFile(file, 'utf8')).replace(/\r\n/g, '\n');
  const checksum = createHash('sha256').update(sql).digest('hex');
  return { name, file, sql, checksum };
}

async function loadAllMigrations(): Promise<Migration[]> {
  const files = (await readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith('.sql')).sort();
  const seenNumbers = new Set<string>();
  for (const file of files) {
    const match = NAME_PATTERN.exec(file);
    if (!match || match[1] === '000') {
      fail(
        `El archivo sql/migraciones/${file} no tiene un nombre válido. ` +
          `Usa NNN_descripcion.sql (ej. 001_crea_inscripciones.sql), en minúsculas y desde 001.`,
      );
    }
    if (seenNumbers.has(match[1]!)) {
      fail(`Hay dos migraciones con el número ${match[1]}. Renumera la más nueva.`);
    }
    seenNumbers.add(match[1]!);
  }
  const base = await loadMigration(BASE_NAME, BASE_FILE);
  const rest = await Promise.all(
    files.map((f) => loadMigration(f.replace(/\.sql$/, ''), path.join(MIGRATIONS_DIR, f))),
  );
  return [base, ...rest];
}

async function main() {
  const { values } = parseArgs({
    options: { estado: { type: 'boolean' }, 'marcar-base': { type: 'boolean' } },
  });

  const migrations = await loadAllMigrations();
  const connection = await openScriptConnection({ multipleStatements: true });
  const target = describeTarget(connection);

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        nombre      VARCHAR(190) PRIMARY KEY,
        checksum    CHAR(64)     NOT NULL,
        aplicada_en DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

    const [appliedRows] = await connection.query<RowDataPacket[]>(
      'SELECT nombre, checksum FROM schema_migrations',
    );
    const applied = new Map(appliedRows.map((r) => [r.nombre as string, r.checksum as string]));

    for (const m of migrations) {
      const stored = applied.get(m.name);
      if (stored && stored !== m.checksum) {
        const file = path.relative(ROOT, m.file);
        fail(
          `${file} cambió después de aplicarse en ${target}. Las migraciones aplicadas no se editan: ` +
            `revierte el cambio y crea una migración nueva en sql/migraciones/. ` +
            `(Si es una BD de desarrollo y el cambio es anterior al primer despliegue, vacíala y vuelve a migrar.)`,
        );
      }
    }

    const pending = migrations.filter((m) => !applied.has(m.name));

    if (values.estado) {
      console.log(`\nBD: ${target}`);
      for (const m of migrations) {
        console.log(`  ${applied.has(m.name) ? '✓ aplicada ' : '· pendiente'}  ${m.name}`);
      }
      console.log(`\n${pending.length} pendiente(s).\n`);
      return;
    }

    const base = pending.find((m) => m.name === BASE_NAME);
    if (base) {
      const [[tables]] = await connection.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS total FROM information_schema.tables
          WHERE table_schema = DATABASE() AND table_name <> 'schema_migrations'`,
      );
      const hasTables = Number(tables?.total ?? 0) > 0;
      if (values['marcar-base']) {
        if (!hasTables) {
          fail(
            `La BD ${target} está vacía: no hay nada que marcar. Corre npm run db:migrate sin flags.`,
          );
        }
        await connection.query('INSERT INTO schema_migrations (nombre, checksum) VALUES (?, ?)', [
          base.name,
          base.checksum,
        ]);
        console.log(`✓ ${BASE_NAME} marcada como aplicada (sin ejecutar) en ${target}.`);
        pending.splice(pending.indexOf(base), 1);
      } else if (hasTables) {
        fail(
          `La BD ${target} ya tiene tablas pero no tiene registrado ESQUEMA.sql. ` +
            `Si lo aplicaste a mano (phpMyAdmin), corre: npm run db:migrate -- --marcar-base. ` +
            `Si no, usa una BD vacía.`,
        );
      }
    }

    if (pending.length === 0) {
      console.log(`✓ ${target} está al día. Nada que aplicar.`);
      return;
    }

    console.log(`Aplicando ${pending.length} migración(es) en ${target}:`);
    for (const m of pending) {
      try {
        await connection.query(m.sql);
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        fail(
          `Falló ${m.name}: ${reason}\n  MySQL no revierte cambios de estructura: revisa qué quedó ` +
            `creado en la BD antes de reintentar. Las migraciones anteriores sí quedaron registradas.`,
        );
      }
      await connection.query('INSERT INTO schema_migrations (nombre, checksum) VALUES (?, ?)', [
        m.name,
        m.checksum,
      ]);
      console.log(`  ✓ ${m.name}`);
    }
    console.log('Listo.');
  } finally {
    await connection.end();
  }
}

main().catch((error: unknown) => {
  fail(error instanceof Error ? error.message : String(error));
});
