import { useId } from 'react';

/**
 * Ilustración de respaldo para portadas sin foto: amanecer sobre el Chimborazo, el volcán que
 * se ve desde Riobamba. Decorativa (aria-hidden); en cuanto la iglesia sube una foto, se usa la
 * foto.
 */
export function HeroArt({ className = '' }: { className?: string }) {
  // Ids propios por dibujo: la portada usa dos en la misma página y un id repetido es HTML
  // inválido (el segundo degradado tomaría el del primero).
  const id = useId();
  return (
    <svg
      viewBox="0 0 1600 800"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <linearGradient id={`${id}-cielo`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1a33" />
          <stop offset="0.42" stopColor="#1d3b8f" />
          <stop offset="0.7" stopColor="#7d8fcf" />
          <stop offset="0.9" stopColor="#f8cba0" />
        </linearGradient>
        <radialGradient id={`${id}-sol`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fde6cc" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#f8cba0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f8cba0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="800" fill={`url(#${id}-cielo)`} />
      <circle cx="1210" cy="470" r="330" fill={`url(#${id}-sol)`} />
      <circle cx="1210" cy="470" r="92" fill="#fde6cc" />
      <path
        d="M0 640C110 560 210 480 300 462c62-12 122 40 220 104 84 52 164 82 244 100L0 720Z"
        fill="#2a4a86"
        opacity="0.85"
      />
      <path
        d="M380 800C560 640 760 440 900 330c40-30 80-45 120-42 50 4 90 30 130 62 140 110 290 270 450 370v80Z"
        fill="#34579a"
      />
      <path
        d="M860 362c40-37 85-64 125-72 35-5 85 2 125 28 30 19 60 42 86 68l-24 6-22-14-22 24-28-18-28 26-26-22-28 26-26-22-30 26-26-24-28 12-24-22Z"
        fill="#f5eee6"
      />
      <path
        d="M0 640c160-50 300-40 440-10 160 35 280-20 440-10s300 70 460 40c120-22 200-20 260-10v150H0Z"
        fill="#142e57"
      />
      <path
        d="M0 710c200-30 380 10 560 2 200-10 360 33 560 18 180-14 340-30 480-10v80H0Z"
        fill="#0a1a33"
      />
    </svg>
  );
}
