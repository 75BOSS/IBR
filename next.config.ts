import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Solo en producción (el navegador la ignora en http). Sin includeSubDomains hasta confirmar
  // TLS en todos los subdominios de ibriglesia.com.
  ...(process.env.NODE_ENV === 'production'
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000' }]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Solo lo que el sitio usa, para que /_next/image no sirva de proxy de imágenes ajenas.
    // Cloudinary se agrega en F1 con la ruta de la cuenta de la iglesia (/<cloud>/image/upload/…).
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/*/hqdefault.jpg' },
    ],
    qualities: [75],
    maximumDiskCacheSize: 200 * 1024 * 1024,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
