import { Icon } from '@/components/Icon';
import { botonPoster } from '../botones';
import { IconoPoster } from '../IconoPoster';
import { Lema, PestanaNueva, Titulo } from '../piezas';

/**
 * «Cómo llegar» en un bloque rojo de cartel: el titular enorme, la dirección y la referencia que
 * la iglesia escribió en el panel (si las hay) y el botón a Google Maps. Solo existe si hay a
 * dónde llevar (`comoLlegar`); nunca muestra una dirección inventada.
 */
export function ComoLlegar({
  comoLlegar,
  direccion,
  referencia,
}: {
  comoLlegar: string | null;
  direccion: string | null;
  referencia: string | null;
}) {
  if (!comoLlegar) return null;
  return (
    <section
      id="como-llegar"
      aria-labelledby="como-llegar-titulo"
      className="@container bg-accent text-canvas on-dark"
    >
      <div className="grid gap-[clamp(1.25rem,4cqi,2.5rem)] p-[clamp(1.25rem,5cqi,3.5rem)] @3xl:grid-cols-[auto_minmax(0,1fr)] @3xl:items-end">
        <IconoPoster
          nombre="mapPin"
          className="size-[clamp(3.5rem,14cqi,8rem)] @3xl:row-span-2 @3xl:self-start"
        />
        <div className="flex flex-col gap-3">
          <Lema>Riobamba · Ecuador</Lema>
          <Titulo
            id="como-llegar-titulo"
            estilo="negro"
            className="pt-[0.1em] text-[clamp(2.75rem,14cqi,7rem)] font-stretch-[78%]"
          >
            Cómo llegar
          </Titulo>
        </div>
        <div className="flex flex-col gap-4 border-t-2 border-canvas/70 pt-[clamp(1rem,3cqi,1.5rem)] @3xl:flex-row @3xl:items-center @3xl:justify-between @3xl:gap-8">
          <div className="flex flex-col gap-1 text-[clamp(1rem,0.95rem+0.3vw,1.25rem)] leading-snug">
            {direccion ? (
              <address className="font-semibold not-italic">{direccion}</address>
            ) : (
              <p className="font-semibold">Abre la ubicación de la iglesia en el mapa.</p>
            )}
            {referencia && <p className="text-canvas/90">{referencia}</p>}
          </div>
          <a
            href={comoLlegar}
            target="_blank"
            rel="noopener noreferrer"
            className={botonPoster('crema', 'shrink-0')}
          >
            Abrir en Google Maps
            <Icon name="arrowRight" className="d-flecha size-[1.1em]" />
            <PestanaNueva />
          </a>
        </div>
      </div>
    </section>
  );
}
