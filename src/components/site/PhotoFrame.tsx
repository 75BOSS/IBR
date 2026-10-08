import Image from 'next/image';
import type { ReactNode } from 'react';
import { HeroArt } from '@/components/site/HeroArt';

/**
 * Marco grande de foto (portada, cierre del inicio, Nosotros). Sin foto, la ilustración del
 * Chimborazo. Con texto encima (`children`, va abajo) lleva un velo oscuro que asegura el contraste
 * sobre cualquier foto y sobre la nieve del volcán.
 */
export function PhotoFrame({
  image,
  video,
  alt = '',
  sizes = '(min-width: 1216px) 1216px, 100vw',
  priority = false,
  mirrored = false,
  className = '',
  children,
}: {
  image?: string | null;
  /** Video de fondo en bucle (sin sonido); con «reducir movimiento» queda la foto. */
  video?: string | null;
  alt?: string;
  sizes?: string;
  /** Portada: carga primero y la foto se acerca despacio al entrar. */
  priority?: boolean;
  /** Ilustración al revés, para que dos marcos de la misma página no se vean iguales. */
  mirrored?: boolean;
  /** Alto o proporción del marco (ej. `min-h-[…]`, `aspect-[5/4]`). */
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`relative isolate flex flex-col justify-end overflow-hidden rounded-(--radius-frame) bg-brand-strong text-surface on-dark ${className}`}
    >
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`-z-30 object-cover ${priority ? 'motion-safe:animate-slow-zoom' : ''}`}
        />
      ) : (
        <HeroArt className={`absolute inset-0 -z-30 size-full ${mirrored ? '-scale-x-100' : ''}`} />
      )}
      {video && (
        <video
          src={video}
          poster={image ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 -z-20 size-full object-cover motion-reduce:hidden"
        />
      )}
      {children && (
        <>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night/95 via-night/60 to-night/5" />
          {children}
        </>
      )}
    </div>
  );
}
