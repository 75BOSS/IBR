import type { Metadata, Viewport } from 'next';
import { Figtree, Fraunces } from 'next/font/google';
import { ToastProvider } from '@/components/Toast';
import { siteUrl } from '@/lib/site';
import './globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  axes: ['opsz', 'SOFT'],
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
  openGraph: {
    type: 'website',
    locale: 'es_EC',
    siteName: 'Iglesia Bíblica Riobamba',
  },
};

export const viewport: Viewport = {
  themeColor: '#0e5e6f',
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
