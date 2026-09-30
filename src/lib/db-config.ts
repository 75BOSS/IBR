import type { PoolOptions, TypeCast } from 'mysql2';

/**
 * Configuración de conexión compartida por la app (src/lib/db.ts) y los scripts
 * (scripts/*.ts). Un solo lugar para zona horaria, charset y conversión de tipos.
 */

/** TINYINT(1) → boolean (y NULL → null). El resto de tipos, conversión estándar. */
const castTinyIntToBoolean: TypeCast = (field, next) => {
  if (field.type === 'TINY' && field.length === 1) {
    const value = field.string();
    return value === null ? null : value === '1';
  }
  return next();
};

export function connectionOptions(uri: string): PoolOptions {
  return {
    uri,
    // La BD guarda UTC; mysql2 convierte DATETIME ↔ Date asumiendo UTC.
    timezone: 'Z',
    // DATE es una fecha sin hora (fecha de prédica, cumpleaños): llega como 'YYYY-MM-DD' y no
    // se convierte de zona horaria (como Date saldría un día antes en Ecuador). Ver lib/dates.ts.
    dateStrings: ['DATE'],
    charset: 'utf8mb4_unicode_ci',
    decimalNumbers: true,
    supportBigNumbers: true,
    typeCast: castTinyIntToBoolean,
  };
}

/**
 * Se ejecuta en cada conexión nueva: NOW() y DEFAULT CURRENT_TIMESTAMP también en UTC,
 * sin depender de la zona horaria global del servidor MySQL de Hostinger.
 */
export const SESSION_INIT_SQL = "SET time_zone = '+00:00'";
