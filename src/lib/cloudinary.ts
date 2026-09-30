import 'server-only';
import { createHash } from 'node:crypto';
import { readEnv, requireEnv } from '@/lib/env';

/** Fotos subidas desde el panel: JPG, PNG o WebP de hasta 8 MB. */
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const IMAGE_MAX_BYTES = 8 * 1024 * 1024;

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    readEnv('CLOUDINARY_CLOUD_NAME') &&
    readEnv('CLOUDINARY_API_KEY') &&
    readEnv('CLOUDINARY_API_SECRET'),
  );
}

/** null si el archivo sirve; si no, qué pasa y cómo arreglarlo. */
export function imageProblem(file: File): string | null {
  if (!IMAGE_TYPES.includes(file.type)) return 'La foto debe ser JPG, PNG o WebP.';
  if (file.size > IMAGE_MAX_BYTES)
    return 'La foto pesa más de 8 MB. Usa una más liviana (o una captura de pantalla).';
  return null;
}

function sign(params: Record<string, string>): string {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return createHash('sha1')
    .update(payload + requireEnv('CLOUDINARY_API_SECRET'))
    .digest('hex');
}

async function callCloudinary(
  action: 'upload' | 'destroy',
  params: Record<string, string>,
  file?: File,
) {
  const cloud = requireEnv('CLOUDINARY_CLOUD_NAME');
  const body = new FormData();
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signed = { ...params, timestamp };
  for (const [key, value] of Object.entries(signed)) body.set(key, value);
  body.set('api_key', requireEnv('CLOUDINARY_API_KEY'));
  body.set('signature', sign(signed));
  if (file) body.set('file', file);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/${action}`, {
    method: 'POST',
    body,
  });
  const data = (await response.json()) as {
    secure_url?: string;
    public_id?: string;
    error?: { message: string };
  };
  if (!response.ok)
    throw new Error(`Cloudinary ${action}: ${data.error?.message ?? response.status}`);
  return data;
}

/** Sube una foto (firmada desde el servidor) a la carpeta ibr/<folder>. */
export async function uploadImage(
  file: File,
  folder: string,
): Promise<{ url: string; publicId: string }> {
  const data = await callCloudinary('upload', { folder: `ibr/${folder}` }, file);
  if (!data.secure_url || !data.public_id)
    throw new Error('Cloudinary no devolvió la URL de la foto.');
  return { url: data.secure_url, publicId: data.public_id };
}

/** Borra una foto; si falla, se registra (la foto huérfana no afecta al sitio). */
export async function deleteImage(publicId: string | null | undefined): Promise<void> {
  if (!publicId || !isCloudinaryConfigured()) return;
  try {
    await callCloudinary('destroy', { public_id: publicId });
  } catch (error) {
    console.error(`[cloudinary] no se pudo borrar ${publicId}:`, error);
  }
}

export type StoredImage = { url: string | null; publicId: string | null };

/**
 * Procesa un campo de foto de un formulario del panel (ImageField): archivo nuevo → sube y
 * borra la anterior; «Quitar esta foto» → borra; nada → deja la actual.
 */
export async function resolveImageField(
  formData: FormData,
  field: string,
  current: StoredImage,
  folder: string,
): Promise<StoredImage | { error: string }> {
  const file = formData.get(field);
  if (file instanceof File && file.size > 0) {
    const problem = imageProblem(file);
    if (problem) return { error: problem };
    if (!isCloudinaryConfigured())
      return { error: 'La subida de fotos aún no está activada (falta configurar Cloudinary).' };
    const uploaded = await uploadImage(file, folder);
    await deleteImage(current.publicId);
    return uploaded;
  }
  if (formData.get(`${field}__quitar`) === '1') {
    await deleteImage(current.publicId);
    return { url: null, publicId: null };
  }
  return current;
}
