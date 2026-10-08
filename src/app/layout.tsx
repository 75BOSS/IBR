import type { Metadata, Viewport } from 'next';
import { Figtree, Pinyon_Script, Poppins } from 'next/font/google';
import { ToastProvider } from '@/components/Toast';
import { DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo';
import { isIndexable, siteUrl } from '@/lib/site';
import './globals.css';

// Tipografía de la marca «Somos Familia» (ver sus piezas en redes): Poppins en los títulos (la
// letra del logo), Pinyon Script para la palabra destacada (como «en familia») y Figtree para
// leer (geométrica como Poppins, pero más angosta y cómoda en párrafos).
const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

const pinyon = Pinyon_Script({
  variable: '--font-pinyon',
  subsets: ['latin'],
  weight: '400',
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
    <html lang="es" className={`${poppins.variable} ${pinyon.variable} ${figtree.variable}`}>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
