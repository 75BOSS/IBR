import type { MetadataRoute } from 'next';
import { SITE_NAME } from '@/lib/seo';

/** Manifiesto básico: permite «Agregar a pantalla de inicio» con nombre, colores e ícono. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'IBR',
    description: 'Horarios, grupos, prédicas y eventos de la Iglesia Bíblica Riobamba.',
    start_url: '/',
    display: 'standalone',
    lang: 'es-EC',
    background_color: '#f4eee3',
    theme_color: '#0e5e6f',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
