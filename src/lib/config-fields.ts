import type { ConfigKey } from '@/lib/config';
import { paragraphs } from '@/lib/text';

/**
 * Qué se edita en /admin/config y cómo. Una sola definición para el formulario y la
 * validación del servidor (no se aceptan claves fuera de esta lista).
 */
export type ConfigFieldKind =
  | 'text'
  | 'textarea'
  | 'url'
  | 'maps'
  | 'mapsLink'
  | 'phone'
  | 'whatsapp'
  | 'email'
  | 'bool'
  | 'youtubeChannel'
  | 'image'
  | 'accounts';

export type ConfigField = {
  key: ConfigKey;
  label: string;
  kind: ConfigFieldKind;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  max?: number;
};

export type ConfigSection = { group: string; title: string; intro: string; fields: ConfigField[] };

export const CONFIG_SECTIONS: ConfigSection[] = [
  {
    group: 'general',
    title: 'Datos de la iglesia',
    intro: 'Aparecen en el encabezado, el pie de página y cuando se comparte el sitio.',
    fields: [
      {
        key: 'nombre_iglesia',
        label: 'Nombre de la iglesia',
        kind: 'text',
        required: true,
        max: 120,
      },
      { key: 'nombre_corto', label: 'Nombre corto', kind: 'text', max: 20, placeholder: 'ej. IBR' },
      { key: 'vision', label: 'Visión', kind: 'textarea', max: 300 },
      {
        key: 'anio_fundacion',
        label: 'Año de fundación',
        kind: 'text',
        max: 4,
        placeholder: 'ej. 2008',
      },
    ],
  },
  {
    group: 'contacto',
    title: 'Contacto y ubicación',
    intro: 'Dirección, mapa y medios de contacto que ve un visitante nuevo.',
    fields: [
      { key: 'direccion', label: 'Dirección del auditorio', kind: 'textarea', max: 255 },
      {
        key: 'referencia_llegada',
        label: 'Cómo llegar (referencia)',
        kind: 'textarea',
        max: 255,
        hint: 'Ej. «Frente al parque Guayaquil, portón verde».',
      },
      {
        key: 'maps_url',
        label: 'Enlace de Google Maps',
        kind: 'mapsLink',
        placeholder: 'ej. https://maps.app.goo.gl/…',
        hint: 'En Google Maps, busca la iglesia → Compartir → Copiar enlace, y pégalo aquí. Con esto el botón «Cómo llegar» abre el lugar exacto y se dibuja el mapa.',
      },
      {
        key: 'maps_embed_url',
        label: 'Mapa insertado (opcional)',
        kind: 'maps',
        hint: 'Solo si quieres otro encuadre del mapa: en Google Maps, Compartir → Insertar un mapa → Copiar HTML, y pégalo aquí completo. Si lo dejas vacío, se usa el enlace de arriba.',
      },
      { key: 'telefono', label: 'Teléfono', kind: 'phone', placeholder: 'ej. 032123456' },
      {
        key: 'whatsapp',
        label: 'WhatsApp de la iglesia',
        kind: 'whatsapp',
        placeholder: 'ej. 0991234567',
        hint: 'Lo usan todos los botones de WhatsApp del sitio.',
      },
      { key: 'whatsapp_canal_url', label: 'Enlace del canal de WhatsApp', kind: 'url' },
      {
        key: 'email',
        label: 'Correo público',
        kind: 'email',
        placeholder: 'ej. hola@ibriglesia.com',
      },
      {
        key: 'email_avisos',
        label: 'Correo que recibe los avisos',
        kind: 'email',
        hint: 'Llegan aquí los registros de «Soy nuevo», las peticiones de oración y los mensajes de contacto.',
      },
    ],
  },
  {
    group: 'redes',
    title: 'Redes sociales',
    intro: 'Se muestran en el pie de página. Deja vacío lo que no uses.',
    fields: [
      { key: 'instagram', label: 'Instagram', kind: 'url' },
      { key: 'youtube', label: 'YouTube', kind: 'url' },
      { key: 'tiktok', label: 'TikTok', kind: 'url' },
      { key: 'facebook', label: 'Facebook', kind: 'url' },
    ],
  },
  {
    group: 'en_vivo',
    title: 'Transmisión en vivo',
    intro: 'Controla el botón «En vivo» de Prédicas.',
    fields: [
      {
        key: 'youtube_channel_id',
        label: 'ID del canal de YouTube',
        kind: 'youtubeChannel',
        placeholder: 'ej. UCxxxxxxxxxxxxxxxxxxxxxx',
        hint: 'En YouTube: Configuración → Configuración avanzada → ID del canal (empieza con UC).',
      },
      {
        key: 'en_vivo_activo',
        label: 'Mostrar el botón «En vivo» ahora (además del horario de culto)',
        kind: 'bool',
      },
    ],
  },
  {
    group: 'dar',
    title: 'Dar (diezmos y ofrendas)',
    intro: 'Lo que aparece en la página «Dar».',
    fields: [
      { key: 'dar_intro', label: 'Texto pastoral', kind: 'textarea', max: 1000 },
      { key: 'dar_cuentas', label: 'Cuentas bancarias', kind: 'accounts' },
      { key: 'dar_qr_url', label: 'Código QR para transferir', kind: 'image' },
    ],
  },
  {
    group: 'home',
    title: 'Portada del inicio',
    intro: 'Lo primero que ve quien entra al sitio.',
    fields: [
      { key: 'home_hero_titulo', label: 'Título grande', kind: 'text', required: true, max: 80 },
      { key: 'home_hero_sub', label: 'Texto de bienvenida', kind: 'textarea', max: 300 },
      {
        key: 'home_hero_imagen',
        label: 'Foto de portada',
        kind: 'image',
        hint: 'Una foto real de la iglesia, horizontal, de al menos 1600 px de ancho. Sin foto se muestra una ilustración del Chimborazo.',
      },
      {
        key: 'home_hero_video',
        label: 'Video de portada (opcional)',
        kind: 'url',
        hint: 'Enlace a un video MP4 corto (10 a 20 segundos, sin sonido), por ejemplo subido a Cloudinary. Se repite en silencio sobre la foto; quien tiene activado «reducir movimiento» ve solo la foto.',
      },
    ],
  },
  {
    group: 'nosotros',
    title: 'Nosotros',
    intro:
      'Lo que se muestra en la página «Nosotros». La visión se edita en «Datos de la iglesia».',
    fields: [
      {
        key: 'nosotros_historia',
        label: 'Nuestra historia',
        kind: 'textarea',
        max: 4000,
        hint: 'Cómo y cuándo nació la iglesia. Separa los párrafos con una línea en blanco.',
      },
      { key: 'nosotros_mision', label: 'Misión', kind: 'textarea', max: 400 },
      {
        key: 'nosotros_creencias',
        label: 'En qué creemos',
        kind: 'textarea',
        max: 6000,
        hint: 'Una creencia por párrafo, separados por una línea en blanco. La primera línea es el título (ej. «La Biblia») y debajo va la explicación. Si lo dejas vacío, la sección no aparece.',
      },
      {
        key: 'nosotros_imagen',
        label: 'Foto de la iglesia',
        kind: 'image',
        hint: 'Una foto de la congregación o del auditorio, horizontal.',
      },
    ],
  },
];

/** Cuentas bancarias de /dar (config.dar_cuentas, JSON). */
export type BankAccount = {
  banco: string;
  tipo: string;
  numero: string;
  titular: string;
  ruc_ci: string;
};
export const MAX_BANK_ACCOUNTS = 4;

export function parseBankAccounts(value: string | null | undefined): BankAccount[] {
  try {
    const parsed: unknown = JSON.parse(value ?? '[]');
    return Array.isArray(parsed)
      ? (parsed as BankAccount[]).filter((a) => a && a.banco && a.numero)
      : [];
  } catch {
    return []; // JSON dañado a mano en phpMyAdmin: se muestra sin cuentas en vez de romper la página
  }
}

export type Creencia = { titulo: string | null; texto: string };

/**
 * «En qué creemos» (config.nosotros_creencias): párrafos separados por una línea en blanco;
 * en cada uno, la primera línea es el título y el resto la explicación. Un párrafo de una sola
 * línea queda como texto sin título.
 */
export function parseCreencias(value: string | null | undefined): Creencia[] {
  return paragraphs(value).map((block) => {
    const [first = '', ...rest] = block.split('\n');
    const texto = rest.join('\n').trim();
    return texto ? { titulo: first.trim(), texto } : { titulo: null, texto: first.trim() };
  });
}
