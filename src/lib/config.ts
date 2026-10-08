import 'server-only';
import { unstable_cache } from 'next/cache';
import { query } from '@/lib/db';

/**
 * Configuración editable desde /admin/config (tabla `config`). Los valores por defecto
 * replican la semilla de sql/ESQUEMA.sql más los datos reales de la migración 012: mantenerlos
 * iguales.
 */
export const CONFIG_DEFAULTS = {
  nombre_iglesia: 'Iglesia Bíblica Riobamba',
  nombre_corto: 'IBR',
  vision: 'Hacer discípulos y dar la vida por nuestros amigos',
  anio_fundacion: '2008',
  direccion: null,
  referencia_llegada: null,
  maps_url: null,
  maps_embed_url: null,
  telefono: null,
  whatsapp: null,
  whatsapp_canal_url: null,
  email: 'iglesiabiblicariobamba@gmail.com',
  email_avisos: null,
  instagram: 'https://www.instagram.com/ibr_riobamba/',
  tiktok: 'https://www.tiktok.com/@ibr_riobamba',
  youtube: 'https://www.youtube.com/@ibr-riobamba',
  facebook: 'https://www.facebook.com/somosiglesiacristiana',
  youtube_channel_id: 'UCwL0afgA_8qr-75cUUPcglw',
  en_vivo_activo: '0',
  dar_intro: null,
  dar_cuentas: '[]',
  dar_qr_url: null,
  home_hero_titulo: 'Bienvenido a casa',
  home_hero_sub: null,
  home_hero_imagen: null,
  home_hero_video: null,
  nosotros_historia: null,
  nosotros_mision: null,
  nosotros_creencias: null,
  nosotros_imagen: null,
} satisfies Record<string, string | null>;

export type ConfigKey = keyof typeof CONFIG_DEFAULTS;
export type SiteConfig = Record<ConfigKey, string | null>;

/** Tag para revalidar desde el admin al guardar: revalidateTag(CONFIG_TAG). */
export const CONFIG_TAG = 'config';

/** Lectura directa, sin caché (panel de configuración). */
export async function loadSiteConfigFromDb(): Promise<SiteConfig> {
  const config: SiteConfig = { ...CONFIG_DEFAULTS };
  const rows = await query<{ clave: string; valor: string | null }>(
    'SELECT clave, valor FROM config',
  );
  for (const row of rows) {
    if (row.clave in config) config[row.clave as ConfigKey] = row.valor;
  }
  return config;
}

// Solo se guarda en caché una lectura buena: si la BD falla, la función lanza y Next sigue
// sirviendo el último valor bueno (no lo pisa con los valores por defecto).
const cachedSiteConfig = unstable_cache(loadSiteConfigFromDb, ['site-config'], {
  revalidate: 300,
  tags: [CONFIG_TAG],
});

/**
 * Configuración del sitio. Si la BD no responde y no hay un valor bueno en caché, se usan
 * los valores base y se registra el error: el encabezado y el pie no deben tumbar el sitio
 * ni el build (decisión en ESTADO.md 2026-09-30).
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    return await cachedSiteConfig();
  } catch (error) {
    console.error('[config] No se pudo leer la tabla config; se usan valores base.', error);
    return { ...CONFIG_DEFAULTS };
  }
}

/**
 * A dónde llegan los avisos internos (Soy nuevo, oración, contacto, voluntarios, grupos sin
 * correo del líder): el «correo que recibe los avisos» o, si está vacío, el correo público.
 * Así un aviso no se pierde solo porque falta ese campo en /admin/config.
 */
export function noticeEmail(config: Pick<SiteConfig, 'email_avisos' | 'email'>): string | null {
  return config.email_avisos || config.email;
}
