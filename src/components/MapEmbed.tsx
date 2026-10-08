import { Icon } from '@/components/Icon';
import { directionsUrl, mapsEmbedFromLink, safeMapsEmbedUrl } from '@/lib/maps';

type Props = {
  /** config.maps_embed_url (src de «Insertar un mapa» de Google Maps, o el <iframe> completo). */
  embedUrl: string | null | undefined;
  /** config.maps_url: enlace de Google Maps de la iglesia («Cómo llegar» y mapa si no hay embed). */
  mapsUrl?: string | null;
  /** Dirección en texto: se usa para «Cómo llegar» y como alternativa si no hay mapa. */
  address: string | null | undefined;
  title?: string;
  className?: string;
};

/**
 * Mapa de Google Maps con enlace «Cómo llegar». Alto proporcional al ancho de pantalla. El mapa
 * sale del embed pegado en la config o, si no hay, del enlace de Google Maps de la iglesia.
 */
export function MapEmbed({
  embedUrl,
  mapsUrl,
  address,
  title = 'Mapa de ubicación',
  className = '',
}: Props) {
  const src = safeMapsEmbedUrl(embedUrl) ?? mapsEmbedFromLink(mapsUrl);
  const directions = directionsUrl(mapsUrl, address);

  return (
    <div className={`overflow-hidden rounded-2xl bg-sunken ring-1 ring-line/70 ${className}`}>
      {src ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block aspect-[4/3] w-full border-0 md:aspect-video"
        />
      ) : (
        <div className="grid aspect-[4/3] place-items-center p-6 text-center md:aspect-[21/9]">
          <p className="max-w-xs text-ink-soft">
            <Icon name="mapPin" className="mx-auto mb-2 size-8 text-brand" />
            {address ?? 'Pronto publicaremos el mapa de cómo llegar.'}
          </p>
        </div>
      )}
      {directions && (
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-between gap-3 bg-brand-soft px-4 font-semibold text-brand-strong hover:bg-brand-soft/70 focus-visible:outline-offset-[-4px]"
        >
          <span className="flex items-center gap-2">
            <Icon name="mapPin" />
            Cómo llegar
          </span>
          <Icon name="external" className="size-4" />
          <span className="sr-only"> (abre Google Maps en una pestaña nueva)</span>
        </a>
      )}
    </div>
  );
}
