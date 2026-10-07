import type { Metadata, Viewport } from 'next';
import { Figtree, Fraunces } from 'next/font/google';
import { ToastProvider } from '@/components/Toast';
import { DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo';
import { isIndexable, siteUrl } from '@/lib/site';
import './globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  // Variable: tamaño óptico, suavidad y letras «traviesas» (WONK) para la cursiva de los títulos.
  axes: ['opsz', 'SOFT', 'WONK'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const figtree = Figtree({
  variable: '--font-figtree',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: 'Iglesia Bíblica Riobamba',
    template: '%s · Iglesia Bíblica Riobamba',
  },
  description:
    'Iglesia Bíblica Riobamba: horarios de reunión, grupos por edad, prédicas y cómo llegar. Bienvenido a casa.',
  applicationName: 'IBR',
  // Copias de prueba (dev., subdominio de Pixelia): fuera de Google. Ver PRODUCTION_HOSTS.
  robots: isIndexable() ? undefined : { index: false, follow: false },
  openGraph: {
    type: 'website',
    locale: 'es_EC',
    siteName: SITE_NAME,
    images: [DEFAULT_OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: '#102a4f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${fraunces.variable} ${figtree.variable}`}>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
