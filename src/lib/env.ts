/**
 * Variables de entorno del servidor. Se leen al usarse (no al importar) para que
 * `next build` funcione aunque falte alguna, y el error diga qué hacer.
 */
export type EnvName =
  | 'DATABASE_URL'
  | 'LEGACY_DATABASE_URL'
  | 'SESSION_SECRET'
  | 'CLOUDINARY_CLOUD_NAME'
  | 'CLOUDINARY_API_KEY'
  | 'CLOUDINARY_API_SECRET'
  | 'SMTP_HOST'
  | 'SMTP_PORT'
  | 'SMTP_USER'
  | 'SMTP_PASS'
  | 'SMTP_FROM'
  | 'YOUTUBE_API_KEY'
  | 'WHATSAPP_TOKEN'
  | 'WHATSAPP_PHONE_NUMBER_ID'
  | 'WHATSAPP_TEMPLATE_SOLICITUD'
  | 'WHATSAPP_TEMPLATE_CODIGO'
  | 'WHATSAPP_API_URL';

export class MissingEnvError extends Error {
  constructor(name: EnvName) {
    super(
      `Falta la variable de entorno ${name}. Cárgala en hPanel → Web app → Variables de entorno ` +
        `(o en .env.local para desarrollo). Referencia: .env.example.`,
    );
    this.name = 'MissingEnvError';
  }
}

export function readEnv(name: EnvName): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export function requireEnv(name: EnvName): string {
  const value = readEnv(name);
  if (!value) throw new MissingEnvError(name);
  return value;
}
