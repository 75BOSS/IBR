'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Icon } from '@/components/Icon';
import { youTubeThumbnail } from '@/lib/youtube';

type Props = {
  /** Título del video: se usa como texto alternativo y título del iframe (accesibilidad). */
  title: string;
  className?: string;
} & ({ videoId: string; channelId?: never } | { channelId: string; videoId?: never });

/**
 * Video de YouTube liviano: muestra la miniatura y carga el reproductor (youtube-nocookie)
 * solo al pulsar. Con `channelId` incrusta la transmisión en vivo del canal.
 */
export function YouTubeEmbed({ title, className = '', ...source }: Props) {
  const [playing, setPlaying] = useState(false);
  const src =
    source.videoId !== undefined
      ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(source.videoId)}?autoplay=1&rel=0`
      : `https://www.youtube-nocookie.com/embed/live_stream?channel=${encodeURIComponent(source.channelId)}&autoplay=1`;

  return (
    // overflow-hidden recortaría un anillo externo: el foco del botón se dibuja por dentro.
    <div className={`relative aspect-video overflow-hidden rounded-2xl bg-ink ${className}`}>
      {playing ? (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 grid size-full place-items-center [--focus-ring:var(--color-surface)] focus-visible:outline-offset-[-6px]"
        >
          {source.videoId !== undefined ? (
            <Image
              src={youTubeThumbnail(source.videoId)}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
            />
          ) : (
            <span className="absolute inset-0 bg-brand-strong" aria-hidden="true" />
          )}
          <span className="relative grid size-14 place-items-center rounded-full bg-accent text-surface shadow-pop transition-transform group-hover:scale-105 group-focus-visible:ring-4 group-focus-visible:ring-surface md:size-18">
            <Icon name="play" className="size-7 translate-x-0.5 md:size-9" />
          </span>
          <span className="sr-only">Reproducir: {title}</span>
        </button>
      )}
    </div>
  );
}
